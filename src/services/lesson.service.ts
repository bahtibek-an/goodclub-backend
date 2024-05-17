import {Repository} from "typeorm";
import {AppDataSource} from "../config/db.config";
import {Lesson, LessonStatus} from "../entity/lesson.entity";
import {LessonDto} from "../dto/lesson.dto";
import fs from "node:fs";
import ffmpeg from "fluent-ffmpeg";
import {User} from "../entity/user.entity";
import {StudentLesson, StudentLessonStatus} from "../entity/student.lesson.entity";
import ApiError from "../exceptions/api.error.exception";
import path from "node:path";
import {Assignment} from "../entity/assignment.entity";

class LessonService {
    private readonly lessonRepository: Repository<Lesson> = AppDataSource.getRepository(Lesson);
    private readonly studentLessonRepository: Repository<StudentLesson> = AppDataSource.getRepository(StudentLesson);
    private readonly assignmentRepository: Repository<Assignment> = AppDataSource.getRepository(Assignment);

    public async initializeVideos(user: User) {
        const lessons = await this.lessonRepository.find();
        for (const lesson of lessons) {
            const index = lessons.indexOf(lesson);
            const studentLesson = await this.studentLessonRepository.findOneBy({
                lesson: {id: lesson.id},
                user: {id: user.id}
            });
            if (studentLesson) {
                continue;
            }
            await this.studentLessonRepository.save({
                status: index === 0 ? StudentLessonStatus.UNLOCKED : StudentLessonStatus.LOCKED,
                lesson: {id: lesson.id},
                user: {id: user.id}
            });
        }
    }

    public async getStudentLessons(user: User) {
        await this.initializeVideos(user);
        return await this.studentLessonRepository.find({
            where: {user: {id: user.id}},
            relations: ["lesson"],
            order: {
                lesson: {
                    created_at: "ASC"
                }
            }
        });
    }

    public async updateLesson({
                                  lessonId,
                                  title,
                                  description,
                                  imageName,
                                  author,
                                  qualification,
                                  assignments,
                                  videoName
                              }: {
        lessonId: number,
        title: string,
        description: string,
        imageName: string,
        author: string,
        qualification: string,
        assignments: any,
        videoName: string | null | undefined,
    }) {
        const lesson = await this.lessonRepository.findOneBy({
            id: lessonId,
        })
        if (!lesson) {
            throw ApiError.NotFoundError();
        }
        if(videoName && lesson.status === LessonStatus.PROCESS) {
            const originalVideoPath = this.getUploadDir(videoName);
            this.removeFile(originalVideoPath)
                .then(() => {
                    console.log(`Video ${originalVideoPath} was deleted because lesson in PROCESS`);
                })
                .catch((e) => {
                    console.log(e);
                });
            throw ApiError.BadRequest("You cannot upload a new video if old lesson have status PROCESS");
        }
        if(lesson.status === LessonStatus.PROCESS) {
            throw ApiError.BadRequest("You cannot upload a new video if old lesson have status PROCESS");
        }
        if(imageName) {
            const imagePath = this.getUploadDir(lesson.image);
            this.removeFile(imagePath)
                .then(() => {
                    console.log(`Image ${imagePath} was deleted`);
                })
                .catch((e) => {
                    console.log(e);
                });
            lesson.image = imageName;
        }
        if (videoName) {
            const originalVideoPath = this.getUploadDir(videoName);
            const video360Path = this.getUploadDir(lesson.video360p);
            const video720Path = this.getUploadDir(lesson.video720p);
            lesson.status = LessonStatus.PROCESS;
            lesson.video720p = "";
            lesson.video360p = "";
            this.removeFile(video360Path)
                .then(() => {
                    console.log(`Video ${video360Path} with quality 360 was deleted`);
                })
                .catch((e) => {
                    console.log(e);
                });
            this.removeFile(video720Path)
                .then(() => {
                    console.log(`Video ${video360Path} with quality 720 was deleted`);
                })
                .catch((e) => {
                    console.log(e);
                });
            this.createQualitiesOfVideo(lessonId, originalVideoPath, videoName)
                .then(() => {
                    console.log("Qualities created!");
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        lesson.title = title;
        lesson.description = description;
        lesson.author = author;
        lesson.qualification = qualification;
        lesson.assignments = assignments;

        return await this.lessonRepository.save(lesson);
    }

    public async saveLesson({title, description, imageName, author, qualification, assignments, videoName}: {
        title: string,
        description: string,
        imageName: string,
        author: string,
        qualification: string,
        assignments: any,
        videoName: string,
    }) {
        const videoPath = this.getUploadDir(videoName);
        const lesson = await this.createLesson({
            title,
            description,
            image: imageName,
            author: author,
            qualification: qualification,
            assignments: assignments,
            // order: order
            order: 0,
        });
        this.createQualitiesOfVideo(lesson.id, videoPath, videoName)
            .then(() => {
                console.log("Qualities created!");
            })
            .catch((e) => {
                console.log(e);
            });
        return lesson;
    }

    public async completeLesson(userId: number, lessonId: number) {
        const currentLesson = await this.studentLessonRepository.findOne({
            where: {
                user: {id: userId},
                lesson: {id: lessonId},
            },
            relations: ["lesson"]
        });
        if (!currentLesson || currentLesson.status !== StudentLessonStatus.UNLOCKED) {
            throw ApiError.ForbiddenError();
        }

        currentLesson.status = StudentLessonStatus.COMPLETED;
        await this.studentLessonRepository.save(currentLesson);

        const studentLessons = await this.studentLessonRepository.find({
            where: {user: {id: userId}},
            relations: ["lesson"],
            order: {
                lesson: {
                    created_at: "ASC"
                }
            }
        });

        let nextLessonFound = false;
        for (let i = 0; i < studentLessons.length - 1; i++) {
            if (studentLessons[i].id === currentLesson.id && studentLessons[i + 1].status === StudentLessonStatus.LOCKED) {
                studentLessons[i + 1].status = StudentLessonStatus.UNLOCKED;
                await this.studentLessonRepository.save(studentLessons[i + 1]);
                nextLessonFound = true;
                break;
            }
        }

        if (!nextLessonFound) {
            throw ApiError.NotFoundError();
        }
    }

    public getUploadDir(fileName: string) {
        return path.join(__dirname, "..", "..", "uploads", fileName);
    }

    public async createLesson(lesson: LessonDto) {
        return await this.lessonRepository.save(lesson);
    }

    public async getAllLessons() {
        return await this.lessonRepository.find();
    }

    public async getLessonById(lessonId: number) {
        return await this.lessonRepository.findOneBy({id: lessonId});
    }

    public async deleteLessonById(lessonId: number) {
        const lesson = await this.lessonRepository.findOneBy({id: lessonId});
        if (!lesson) {
            throw ApiError.NotFoundError();
        }
        const video360Path = this.getUploadDir(lesson.video360p);
        const video720Path = this.getUploadDir(lesson.video720p);
        const imagePath = this.getUploadDir(lesson.image);
        this.removeFile(video360Path)
            .then(() => {
                console.log(`Video ${video360Path} with quality 360 was deleted`);
            })
            .catch((e) => {
                console.log(e);
            });
        this.removeFile(video720Path)
            .then(() => {
                console.log(`Video ${video360Path} with quality 720 was deleted`);
            })
            .catch((e) => {
                console.log(e);
            });
        this.removeFile(imagePath)
            .then(() => {
                console.log(`Image ${imagePath} was deleted`);
            })
            .catch((e) => {
                console.log(e);
            });
        await this.assignmentRepository.delete({lesson: {id: lesson.id}});
        await this.studentLessonRepository.delete({lesson: {id: lessonId}});
        return await this.lessonRepository.delete({id: lessonId});
    }

    public async removeFile(path: string) {
        return await new Promise<void>((resolve, reject) => {
            fs.unlink(path, (error) => {
                if (error) {
                    reject(new Error('Error deleting video'));
                } else {
                    resolve();
                }
            });
        })
    }

    public createQualitiesOfVideo = async (lessonId: number, videoPath: string, videoName: string) => {
        let videoDuration = 0;
        const resolutions = ['1280x720', '640x360'];
        const videoFiles: any[] = await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (metadata.format.duration) {
                    videoDuration = metadata.format.duration;
                }
                const tasks = resolutions.map(res => {
                    return new Promise((resolve, reject) => {
                        const outputFileName = `${videoName}_${res}.mp4`;
                        const outputPath = `${videoPath}_${res}.mp4`;
                        ffmpeg(videoPath)
                            .outputOptions(['-s', res])
                            .output(outputPath)
                            .on('end', () => resolve(outputFileName))
                            .on('error', (err) => reject(err))
                            .run();
                    });
                });
                Promise.all(tasks).then(resolve).catch(reject);
            });
        });
        const lesson = await this.lessonRepository.findOneBy({id: lessonId});
        await this.lessonRepository.save({
            ...lesson,
            video720p: videoFiles[0],
            video360p: videoFiles[1],
            duration: videoDuration,
            status: LessonStatus.ACTIVE
        });
        this.removeFile(videoPath)
            .then(() => {
                console.log(`Original video is deleted ${videoPath}`);
            })
            .catch((e) => {
                console.log(e);
            });
    }
}

export default LessonService;
import {Repository} from "typeorm";
import {AppDataSource} from "../config/db.config";
import {Lesson, LessonStatus} from "../entity/lesson.entity";
import {LessonDto} from "../dto/lesson.dto";
import fs from "node:fs";
import ffmpeg from "fluent-ffmpeg";

class LessonService {
    private readonly lessonRepository: Repository<Lesson> = AppDataSource.getRepository(Lesson);

    public async createLesson(lesson: LessonDto) {
        return await this.lessonRepository.save(lesson);
    }

    public async getAllLessons() {
        return await this.lessonRepository.find();
    }

    public async removeVideo(path: string) {
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
                if(metadata.format.duration) {
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
        const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
        await this.lessonRepository.save({
            ...lesson,
            video720p: videoFiles[0],
            video360p: videoFiles[1],
            duration: videoDuration,
            status: LessonStatus.ACTIVE
        });
        this.removeVideo(videoPath)
            .then(() => {
                console.log(`Original video is deleted ${videoPath}`);
            });
    }
}

export default LessonService;
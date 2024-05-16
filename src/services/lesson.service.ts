import {Repository} from "typeorm";
import {AppDataSource} from "../config/db.config";
import {Lesson} from "../entity/lesson.entity";
import {LessonDto} from "../dto/lesson.dto";
import fs from "node:fs";

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
}

export default LessonService;
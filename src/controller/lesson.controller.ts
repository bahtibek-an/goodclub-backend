import {Request, Response, NextFunction} from "express";
import UserService from "../services/user.service";
import LessonService from "../services/lesson.service";
import RequestWithBody from "../interfaces/RequstWithBody.interface";
import {Lesson} from "../entity/lesson.entity";
import {LessonDto} from "../dto/lesson.dto";
import {Assignment} from "../entity/assignment.entity";
import ApiError from "../exceptions/api.error.exception";
import {validationResult} from "express-validator";
import ffmpeg, {ffprobe} from "fluent-ffmpeg";
import path from "node:path";
import fs from "node:fs";


class LessonController {
    private readonly lessonService: LessonService;

    constructor() {
        this.lessonService = new LessonService();
    }

    public createLesson = async (req: RequestWithBody<LessonDto>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const {title, description, author, qualification, assignments: assignmentsBody} = req.body;
            const files = req.files as any;
            const videoName = files.video?.[0]?.filename;
            const imageName = files.image?.[0]?.filename;
            const assignments = assignmentsBody?.map((assignment) => JSON.parse(assignment as unknown as string));
            if (!videoName) {
                throw ApiError.BadRequest("Video is required");
            }
            if (!imageName) {
                throw ApiError.BadRequest("Image is required");
            }
            const videoPath = path.join(__dirname, "..", "..", "uploads", videoName);
            const lesson = await this.lessonService.createLesson({
                title,
                description,
                image: imageName,
                author: author,
                qualification: qualification,
                assignments: assignments,
            });
            this.lessonService.createQualitiesOfVideo(lesson.id, videoPath, videoName)
                .then(() => {
                    console.log("Qualities created!");
                });
            return res.status(201).json(lesson);
        } catch (e) {
            next(e);
        }
    }


    public getAllLessons = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lessons = await this.lessonService.getAllLessons();
            return res.json(lessons);
        } catch (e) {
            next(e);
        }
    }

}

export default LessonController;
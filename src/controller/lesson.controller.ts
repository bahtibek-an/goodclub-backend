import {Request, Response, NextFunction} from "express";
import UserService from "../services/user.service";
import LessonService from "../services/lesson.service";
import RequestWithBody from "../interfaces/RequstWithBody.interface";
import {LessonDto} from "../dto/lesson.dto";
import ApiError from "../exceptions/api.error.exception";
import {validationResult} from "express-validator";
import path from "node:path";
import RequestWithUser from "../interfaces/RequestWithUser.interface";


class LessonController {
    private readonly lessonService: LessonService;
    private readonly userService: UserService;

    constructor() {
        this.lessonService = new LessonService();
        this.userService = new UserService();
    }

    public createLesson = async (req: RequestWithBody<LessonDto>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const {title, description, author, qualification, order, assignments: assignmentsBody} = req.body;
            const files = req.files as any;
            const videoName = files.video?.[0]?.filename;
            const imageName = files.image?.[0]?.filename;
            const assignments = assignmentsBody?.map((assignment) => JSON.parse(assignment as unknown as string)) || [];
            if(!imageName && videoName) {
                const videoPath = this.lessonService.getUploadDir(videoName);
                this.lessonService.removeFile(videoPath)
                    .then(() => {
                        console.log(`Video is provided but the image is, that's why ${videoPath} was deleted`);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
            if (!videoName) {
                throw ApiError.BadRequest("Video is required");
            }
            if (!imageName) {
                throw ApiError.BadRequest("Image is required");
            }
            const lesson = await this.lessonService.saveLesson({
                title: title,
                description: description,
                author: author,
                qualification: qualification,
                assignments: assignments,
                videoName: videoName,
                imageName: imageName,
            });
            return res.status(201).json(lesson);
        } catch (e) {
            next(e);
        }
    }

    public updateLesson = async (req: RequestWithBody<LessonDto>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const { id } = req.params;
            const {title, description, author, qualification, order, assignments: assignmentsBody} = req.body;
            const files = req.files as any;
            const videoName = files.video?.[0]?.filename;
            const imageName = files.image?.[0]?.filename;
            const assignments = assignmentsBody?.map((assignment) => JSON.parse(assignment as unknown as string));
            const lesson = await this.lessonService.updateLesson({
                lessonId: +id,
                title,
                description,
                imageName: imageName,
                author: author,
                qualification: qualification,
                assignments: assignments,
                videoName: videoName
            });
            return res.status(201).json(lesson);
        } catch (e) {
            next(e);
        }
    }

    public deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const lesson = await this.lessonService.deleteLessonById(+id);
            return res.json(lesson);
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

    public getLessonById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const lesson = await this.lessonService.getLessonById(+id);
            if (!lesson) {
                throw ApiError.NotFoundError();
            }
            return res.json(lesson);
        } catch (e) {
            next(e);
        }
    }

    public getStudentLesson = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as RequestWithUser).user.id;
            const lesson = await this.lessonService.getStudentLesson(userId);
            return res.json(lesson);
        } catch (e) {
            next(e);
        }
    }

    public getStudentLessons = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as RequestWithUser).user.id;
            const user = await this.userService.getUserById(userId);
            if (!user) {
                throw ApiError.NotFoundError();
            }
            const studentLessons = await this.lessonService.getStudentLessons(user);

            return res.json(studentLessons);
        } catch (e) {
            next(e);
        }
    }

    public completeLesson = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id: lessonId} = req.params;
            const userId = (req as RequestWithUser).user.id;
            await this.lessonService.completeLesson(userId, +lessonId);
            return res.json({message: "Lesson completed and next lesson is unlocked"});
        } catch (e) {
            next(e);
        }
    }

}

export default LessonController;
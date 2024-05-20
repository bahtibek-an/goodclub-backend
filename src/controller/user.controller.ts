import express, {NextFunction, Request, Response} from "express";
import UserService from "../services/user.service";
import {UserCreateDto, UserDto} from "../dto/user.dto";
import {User, UserStatus} from "../entity/user.entity";
import RequestWithBody from "../interfaces/RequstWithBody.interface";
import RequestWithUser from "../interfaces/RequestWithUser.interface";
import {validationResult} from "express-validator";
import ApiError from "../exceptions/api.error.exception";
import {StudentLessonStatus} from "../entity/student.lesson.entity";


class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.create();
            return res.json(new UserCreateDto(user));
        } catch (e) {
            next(e);
        }
    }

    fillUser = async (req: RequestWithBody<User>, res: express.Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const user = (req as unknown as RequestWithUser).user;
            const {
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth,
                province,
                district,
                userType,
                workplace,
                gender,
                schoolNumber
            } = req.body;
            const updatedUser = await this.userService.fillUserById(user.id, {
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth,
                province,
                district,
                userType,
                workplace,
                gender,
                schoolNumber,
            });
            return res.json(new UserDto("", updatedUser));
        } catch (e) {
            next(e);
        }
    }

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const offset = (page - 1) * limit;
            const status = req.query.status as UserStatus;
            const search = req.query.search as string;

            const users = await this.userService.getUsers(offset, limit, status, search);
            return res.json({
                results: users.data.map((user: User) => new UserCreateDto(user)),
                page: page,
                limit: limit,
                count: users.count,
            });
        } catch (e) {
            next(e);
        }
    }

    public getExcelOfStudents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.set({
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": 'attachment; filename=Export.xlsx'
            });
            const buffer = await this.userService.generateExcel();
            return res.send(buffer);
        } catch (e) {
            next(e);
        }
    }

    public getStudentById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(+id);
            if(!user) {
                throw ApiError.NotFoundError();
            }
            (user as any).currentLesson  = user.lessons.find((item) => item.status === StudentLessonStatus.UNLOCKED);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }


}

export default UserController;
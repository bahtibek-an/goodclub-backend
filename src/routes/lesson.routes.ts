import {Router} from "express";
import LessonController from "../controller/lesson.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import {UserRole} from "../entity/user.entity";
import {upload} from "../config/multer.config";
import {lessonValidator} from "../dto/lesson.dto";

const lessonRoutes = Router();
const lessonController = new LessonController();



// Routes for user
lessonRoutes.get("/student", authMiddleware, roleMiddleware(UserRole.USER), lessonController.getStudentLessons);


// Routes for admin
lessonRoutes.post("/create", authMiddleware, roleMiddleware(UserRole.ADMIN),
    upload.fields([
        {name: "video", maxCount: 1},
        {name: "image", maxCount: 1},
    ]), lessonValidator, lessonController.createLesson);
lessonRoutes.get("/:id", authMiddleware, roleMiddleware(UserRole.ADMIN), lessonController.getLessonById);
lessonRoutes.get("/", authMiddleware, roleMiddleware(UserRole.ADMIN), lessonController.getAllLessons);



export default lessonRoutes;
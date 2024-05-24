import {Router} from "express";
import UserController from "../controller/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import {UserRole} from "../entity/user.entity";
import {fillUserValidator} from "../dto/user.dto";
import adminController from "../controller/admin.controller";

const userRoutes = Router();

const userController = new UserController();

// admin routes
userRoutes.get("/admin", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getAdmin);
userRoutes.put("/admin", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.updateAdmin);

userRoutes.get("/", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getAllUsers);
userRoutes.post("/create", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.createUser);
userRoutes.post("/fill-user", authMiddleware, fillUserValidator, userController.fillUser);
userRoutes.get("/generate-excel", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getExcelOfStudents);
userRoutes.get("/:id", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getStudentById)


export default userRoutes;
import {Router} from "express";
import UserController from "../controller/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import {UserRole} from "../entity/user.entity";
import {fillUserValidator} from "../dto/user.dto";

const userRoutes = Router();

const userController = new UserController();

// admin routes
userRoutes.get("/admin", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getAdmin);
userRoutes.put("/admin", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.updateAdmin);
userRoutes.put("/change-password", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.updateAdminPassword);

userRoutes.get("/", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getAllUsers);
userRoutes.post("/create", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.createUser);
userRoutes.get("/generate-excel", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getExcelOfStudents);
userRoutes.get("/:id", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getStudentById)

userRoutes.post("/fill-user", authMiddleware, fillUserValidator, userController.fillUser);


export default userRoutes;

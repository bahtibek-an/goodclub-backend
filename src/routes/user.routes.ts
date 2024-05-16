import {Router} from "express";
import UserController from "../controller/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import {UserRole} from "../entity/user.entity";
import {fillUserValidator} from "../dto/user.dto";

const userRoutes = Router();

const userController = new UserController();

userRoutes.get("/", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.getAllUsers);
userRoutes.post("/create", authMiddleware, roleMiddleware(UserRole.ADMIN), userController.createUser);
userRoutes.post("/fill-user", authMiddleware, fillUserValidator, userController.fillUser);


export default userRoutes;
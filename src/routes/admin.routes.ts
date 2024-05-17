import {Router} from "express";
import AdminController from "../controller/admin.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import {UserRole} from "../entity/user.entity";


const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get("/stats", authMiddleware, roleMiddleware(UserRole.ADMIN), adminController.getStats);

export default adminRoutes;
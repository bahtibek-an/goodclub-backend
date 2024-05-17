import {Router} from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import lessonRoutes from "./lesson.routes";
import adminRoutes from "./admin.routes";


const routes = Router();

routes.use("/admin", adminRoutes);
routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/lesson", lessonRoutes);

export default routes;
import express, {Router} from "express";
import AuthController from "../controller/auth.controller";
import {loginValidator} from "../dto/user.dto";


const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/login", loginValidator, authController.login);
authRoutes.post("/login-admin", loginValidator, authController.loginAdmin);
authRoutes.delete("/logout", authController.logout)
authRoutes.get("/refresh", authController.refresh);
authRoutes.post("/refresh", authController.refresh);

export default authRoutes;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const user_login_dto_1 = require("../dto/user.login.dto");
const authRoutes = (0, express_1.Router)();
const authController = new auth_controller_1.default();
authRoutes.post("/login", user_login_dto_1.loginValidator, authController.login);
authRoutes.post("/register", user_login_dto_1.registerValidator, authController.register);
authRoutes.delete("/logout", authController.logout);
authRoutes.get("/refresh", authController.refresh);
exports.default = authRoutes;

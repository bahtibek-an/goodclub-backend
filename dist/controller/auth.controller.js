"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const express_validator_1 = require("express-validator");
const api_error_exception_1 = __importDefault(require("../exceptions/api.error.exception"));
class AuthController {
    constructor() {
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw api_error_exception_1.default.BadRequest("error", errors.array());
                }
                const userLoginDto = req.body;
                const user = yield this.authService.login(userLoginDto);
                const refreshToken = yield this.authService.createRefreshToken(user.user.id, user.user.role);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    sameSite: "none",
                    secure: true,
                });
                return res.json(user);
            }
            catch (e) {
                next(e);
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw api_error_exception_1.default.BadRequest("error", errors.array());
                }
                const userRegisterDto = req.body;
                const user = yield this.authService.register(userRegisterDto);
                const refreshToken = yield this.authService.createRefreshToken(user.user.id, user.user.role);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    sameSite: "none",
                    secure: true
                });
                return res.json(user);
            }
            catch (e) {
                next(e);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("refreshToken");
                res.cookie("refreshToken", "", {
                    httpOnly: true,
                    maxAge: 0,
                    sameSite: "none",
                    secure: true
                });
                return res.sendStatus(200);
            }
            catch (e) {
                next(e);
            }
        });
        this.refresh = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.cookies;
                const user = yield this.authService.refresh(refreshToken);
                const newRefreshToken = yield this.authService.createRefreshToken(user.user.id, user.user.role);
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    sameSite: "none",
                    secure: true
                });
                return res.json(user);
            }
            catch (e) {
                next(e);
            }
        });
        this.authService = new auth_service_1.default();
    }
}
exports.default = AuthController;

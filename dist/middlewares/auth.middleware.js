"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_exception_1 = __importDefault(require("../exceptions/api.error.exception"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
function authMiddleware(req, res, next) {
    try {
        const authService = new auth_service_1.default();
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(api_error_exception_1.default.UnauthorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(api_error_exception_1.default.UnauthorizedError());
        }
        const user = authService.validateAccessToken(accessToken);
        if (!user) {
            return next(api_error_exception_1.default.UnauthorizedError());
        }
        req.user = user;
        next();
    }
    catch (e) {
        next(api_error_exception_1.default.UnauthorizedError());
    }
}
exports.default = authMiddleware;

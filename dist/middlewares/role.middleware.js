"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_exception_1 = __importDefault(require("../exceptions/api.error.exception"));
function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.role || user.role !== requiredRole) {
                return next(api_error_exception_1.default.ForbiddenError());
            }
            next();
        }
        catch (e) {
            next(api_error_exception_1.default.ForbiddenError());
        }
    };
}
exports.default = roleMiddleware;

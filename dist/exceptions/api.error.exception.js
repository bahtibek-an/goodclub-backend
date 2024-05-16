"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static UnauthorizedError() {
        return new ApiError(401, "User not authorized");
    }
    static ConflictError() {
        return new ApiError(409, "Conflict");
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
    static ForbiddenError() {
        return new ApiError(403, "Forbidden");
    }
    static NotFoundError() {
        return new ApiError(404, "Not Found");
    }
}
exports.default = ApiError;

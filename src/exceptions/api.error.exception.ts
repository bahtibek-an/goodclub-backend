

class ApiError extends Error {
    status: number;
    errors: any[];

    constructor(status: number, message: string, errors: any[] = []) {
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

    static BadRequest(message: string, errors: any[] = []) {
        return new ApiError(400, message, errors);
    }

    static ForbiddenError() {
        return new ApiError(403, "Forbidden");
    }

    static NotFoundError() {
        return new ApiError(404, "Not Found");
    }


}

export default ApiError;
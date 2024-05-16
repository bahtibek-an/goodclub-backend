import {NextFunction, Request, Response} from "express";
import {UserRole} from "../entity/user.entity";
import RequestWithUser from "../interfaces/RequestWithUser.interface";
import ApiError from "../exceptions/api.error.exception";

export default function roleMiddleware(requiredRole: UserRole) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as RequestWithUser).user;
            if(!user || !user.role || user.role !== requiredRole) {
                return next(ApiError.ForbiddenError());
            }
            next();
        } catch (e) {
            next(ApiError.ForbiddenError());
        }
    }
}
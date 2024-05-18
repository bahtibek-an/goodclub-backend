import { Request } from "express";
import {JwtPayload} from "jsonwebtoken";
import {GenderEnum, UserRole, UserStatus} from "../entity/user.entity";

export interface UserJwtPayload {
    id: number;
    gender: GenderEnum;
    role: UserRole;
    status: UserStatus
}

interface RequestWithUser extends Request {
    user: UserJwtPayload;
}

export default RequestWithUser;
import jwt from "jsonwebtoken";
import {UserJwtPayload} from "../interfaces/RequestWithUser.interface";
import dotenv from "dotenv";
import {Admin} from "typeorm";
dotenv.config();


class JwtConfig {
    public createAccessToken = async (data: UserJwtPayload) => {
        return jwt.sign(data, process.env.JWT_ACCESS_SECRET!, {expiresIn: '7d'});
    }

    public createRefreshToken = async (data: UserJwtPayload) => {
        return jwt.sign(data , process.env.JWT_REFRESH_TOKEN!, {expiresIn: "30d"})
    }

    public validateAccessToken(token: string): UserJwtPayload | null {
        try {
            return <UserJwtPayload>jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        } catch (e) {
            return null;
        }
    }

    public validateRefreshToken(token: string): UserJwtPayload | null {
        try {
            return <UserJwtPayload>jwt.verify(token, process.env.JWT_REFRESH_TOKEN!);
        } catch (e) {
            return null;
        }
    }
}

export default JwtConfig;
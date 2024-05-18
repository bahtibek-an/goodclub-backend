import express, {NextFunction, Request, Response} from "express";
import AuthService from "../services/auth.service";
import {UserDto, UserLoginDto} from "../dto/user.dto";
import RequestWithBody from "../interfaces/RequstWithBody.interface";
import {validationResult} from "express-validator";
import ApiError from "../exceptions/api.error.exception";
import RequestWithCookies from "../interfaces/RequestWithCookies.interface";
import JwtConfig from "../config/jwt.config";
import RequestWithUser from "../interfaces/RequestWithUser.interface";
import UserService from "../services/user.service";
import {User} from "../entity/user.entity";


class AuthController {
    private readonly authService: AuthService;
    private readonly jwtConfig: JwtConfig = new JwtConfig();

    constructor() {
        this.authService = new AuthService();
    }

    login = async (req: RequestWithBody<UserLoginDto>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const userLoginDto = req.body;
            const user = await this.authService.login(userLoginDto);
            const refreshToken = await this.jwtConfig.createRefreshToken({
                id: user.user.id,
                role: user.user.role,
                gender: user.user.gender,
                status: user.user.status,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: "lax",
                secure: true,
            });
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    loginAdmin = async (req: RequestWithBody<UserLoginDto>, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.BadRequest("error", errors.array());
            }
            const userLoginDto = req.body;
            const user = await this.authService.loginAdmin(userLoginDto);
            const refreshToken = await this.jwtConfig.createRefreshToken({
                id: user.user.id,
                role: user.user.role,
                gender: user.user.gender,
                status: user.user.status,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: "lax",
                secure: true,
            });
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie("refreshToken");
            res.cookie("refreshToken", "", {
                httpOnly: true,
                maxAge: 0,
                sameSite: "lax",
                secure: true
            });
            return res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    refresh = async (req: RequestWithCookies, res: express.Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies;
            const user = await this.authService.refresh(refreshToken);
            const newRefreshToken = await this.jwtConfig.createRefreshToken({
                id: user.user.id,
                role: user.user.role,
                gender: user.user.gender,
                status: user.user.status,
            });
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: "lax",
                secure: true
            });
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

}

export default AuthController;
import {User, UserRole} from "../entity/user.entity";
import {Repository} from "typeorm";
import {AppDataSource} from "../config/db.config";
import {UserDto, UserLoginDto} from "../dto/user.dto";
import ApiError from "../exceptions/api.error.exception";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import JwtConfig from "../config/jwt.config";

dotenv.config();


class AuthService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);
    private readonly jwtConfig: JwtConfig = new JwtConfig();

    async login(user: UserLoginDto) {
        const {username, password} = user;
        const candidate = await this.userRepository.findOneBy({username, role: UserRole.USER});
        if (!candidate) {
            throw ApiError.UnauthorizedError();
        }
        // const isEqualPassword = await bcrypt.compare(password, candidate.password!);
        // if (!isEqualPassword) {
        //     throw ApiError.UnauthorizedError();
        // }
        if(password !== candidate.password) {
            throw ApiError.UnauthorizedError();
        }
        const accessToken = await this.jwtConfig.createAccessToken({
            id: candidate.id,
            role: candidate.role,
            gender: candidate.gender
        });
        return new UserDto(accessToken, candidate);
    }

    async loginAdmin(user: UserLoginDto) {
        const {username, password} = user;
        const candidate = await this.userRepository.findOneBy({username, role: UserRole.ADMIN});
        if (!candidate) {
            throw ApiError.UnauthorizedError();
        }
        const isEqualPassword = await bcrypt.compare(password, candidate.password!);
        if (!isEqualPassword) {
            throw ApiError.UnauthorizedError();
        }
        const accessToken = await this.jwtConfig.createAccessToken({
            id: candidate.id,
            role: candidate.role,
            gender: candidate.gender
        });
        return new UserDto(accessToken, candidate);
    }

    async refresh(refreshToken: string | undefined) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = this.jwtConfig.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }
        const user = await this.userRepository.findOneBy({id: userData.id});
        if (!user) {
            throw ApiError.UnauthorizedError();
        }
        const accessToken = await this.jwtConfig.createAccessToken({
            id: user.id,
            role: user.role,
            gender: user.gender
        });
        return {
            accessToken,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.username,
                id: user.id,
                role: user.role,
                gender: user.gender,
            },
        };
    }

}

export default AuthService;
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
const user_entity_1 = require("../entity/user.entity");
const db_config_1 = require("../config/db.config");
const user_login_dto_1 = require("../dto/user.login.dto");
const api_error_exception_1 = __importDefault(require("../exceptions/api.error.exception"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthService {
    constructor() {
        this.userRepository = db_config_1.AppDataSource.getRepository(user_entity_1.User);
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = user;
            const candidate = yield this.userRepository.findOneBy({ email });
            if (!candidate) {
                throw api_error_exception_1.default.UnauthorizedError();
            }
            const isEqualPassword = yield bcrypt_1.default.compare(password, candidate.password);
            if (!isEqualPassword) {
                throw api_error_exception_1.default.UnauthorizedError();
            }
            const accessToken = yield this.createAccessToken(candidate.id, candidate.role);
            return new user_login_dto_1.UserDto(accessToken, candidate);
        });
    }
    register(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield this.userRepository.findOneBy({ email: user.email });
            if (candidate) {
                throw api_error_exception_1.default.ConflictError();
            }
            const hashPassword = yield this.createHashPassword(user.password);
            const newUser = yield this.userRepository.save(Object.assign(Object.assign({}, user), { password: hashPassword }));
            const accessToken = yield this.createAccessToken(newUser.id, newUser.role);
            return new user_login_dto_1.UserDto(accessToken, newUser);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw api_error_exception_1.default.UnauthorizedError();
            }
            const userData = this.validateRefreshToken(refreshToken);
            if (!userData) {
                throw api_error_exception_1.default.UnauthorizedError();
            }
            const user = yield this.userRepository.findOneBy({ id: userData.userId });
            if (!user) {
                throw api_error_exception_1.default.UnauthorizedError();
            }
            const accessToken = yield this.createAccessToken(user.id, user.role);
            return {
                accessToken,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: user.id,
                    role: user.role,
                },
            };
        });
    }
    createAccessToken(userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: userId, role: userRole }, process.env.JWT_ACCESS_SECRET, { expiresIn: '7d' });
        });
    }
    createRefreshToken(userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: userId, role: userRole }, process.env.JWT_REFRESH_TOKEN, { expiresIn: "30d" });
        });
    }
    createHashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hash(password, 12);
        });
    }
    validateAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        }
        catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_TOKEN);
        }
        catch (e) {
            return null;
        }
    }
}
exports.default = AuthService;

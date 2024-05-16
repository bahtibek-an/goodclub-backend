"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDto = exports.UserLoginDto = exports.UserRegisterDto = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.check)("firstName")
        .isAlpha()
        .withMessage("First name should contain only letters")
        .isLength({ min: 1 })
        .withMessage("First name is required")
        .notEmpty().withMessage("First name is required")
        .trim(),
    (0, express_validator_1.check)("lastName")
        .isAlpha()
        .withMessage("Last name should contain only letter")
        .isLength({ min: 1 })
        .withMessage("Last name is required")
        .notEmpty().withMessage("Last name is required")
        .trim(),
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Invalid email address")
        .notEmpty().withMessage("Email address is required")
        .trim(),
    (0, express_validator_1.check)("password")
        .isLength({ min: 4 }).withMessage("Password must be at least 4 characters long")
        .notEmpty().withMessage("Password is required"),
    (0, express_validator_1.check)("role")
        .optional()
        .isIn(["USER", "ADMIN"]).withMessage("Invalid role specified"),
];
exports.loginValidator = [
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Invalid email address")
        .notEmpty().withMessage("Email address is required")
        .trim(),
    (0, express_validator_1.check)("password")
        .isLength({ min: 4 }).withMessage("Password must be at least 4 characters long")
        .notEmpty().withMessage("Password is required"),
];
class UserRegisterDto {
}
exports.UserRegisterDto = UserRegisterDto;
class UserLoginDto {
}
exports.UserLoginDto = UserLoginDto;
class UserDto {
    constructor(accessToken, user) {
        this.accessToken = accessToken;
        this.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }
}
exports.UserDto = UserDto;

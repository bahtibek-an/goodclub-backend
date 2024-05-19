import {body, check} from "express-validator";
import {GenderEnum, User, UserRole, UserStatus, UserType} from "../entity/user.entity";

export const loginValidator = [
    check("username")
        .notEmpty().withMessage("Username address is required")
        .trim(),
    check("password")
        .isLength({min: 4}).withMessage("Password must be at least 4 characters long")
        .notEmpty().withMessage("Password is required"),
];

export const fillUserValidator = [
    check("firstName")
        .notEmpty().withMessage("First name is required")
        .trim(),
    check("lastName")
        .notEmpty().withMessage("Last name is required")
        .trim(),
    check("phoneNumber")
        .notEmpty().withMessage("phone number is required")
        .trim(),
    check("dateOfBirth")
        .notEmpty().withMessage("Date of birth is required")
        .isDate()
        .withMessage("Date of birth is incorrect"),
    check("province")
        .notEmpty().withMessage("Province is required")
        .trim(),
    check("district")
        .notEmpty().withMessage("District is required")
        .trim(),
    check("userType")
        .isIn(["STUDENT", "TEACHER", "OTHERS"]).withMessage("Invalid user type specified"),
    check("gender")
        .isIn(["MALE", "FEMALE"]).withMessage("Invalid gender specified"),
    check("workplace")
        .trim()
        .custom((value, {req}) => {
            const userType = req.body.userType;
            if (userType === UserType.OTHERS && !value) {
                throw new Error("Workplace is required if user type is OTHERS");
            }
            return true;
        }),
    check("schoolNumber")
        .trim()
        .custom((value, {req}) => {
            const userType = req.body.userType;
            if (userType === UserType.TEACHER && !value) {
                throw new Error("School number is required if user type is TEACHER");
            }
            return true;
        }),
]

export class UserLoginDto {
    username: string;
    password: string;
}

export class UserDto {
    accessToken: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        username: string;
        role: UserRole;
        gender: GenderEnum;
        status: UserStatus;
        schoolNumber: number;
        workplace: string;
    }

    constructor(accessToken: string, user: User) {
        this.accessToken = accessToken;
        this.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            role: user.role,
            gender: user.gender,
            status: user.status,
            schoolNumber: user.schoolNumber,
            workplace: user.workplace,
        };
    }
}

export class UserCreateDto {
    id: number;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    dateOfBirth: Date | null;
    province: string | null;
    district: string | null;
    gender: GenderEnum | null;
    status: UserStatus;
    username: string;
    password: string;
    role: UserRole;
    userType: UserType;
    workplace: string;
    schoolNumber: number;

    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.role = user.role;
        this.gender = user.gender;
        this.phoneNumber = user.phoneNumber;
        this.dateOfBirth = user.dateOfBirth;
        this.province = user.province;
        this.district = user.district;
        this.password = user.password;
        this.status = user.status;
        this.userType = user.userType;
        this.workplace = user.workplace;
        this.schoolNumber = user.schoolNumber;
    }
}
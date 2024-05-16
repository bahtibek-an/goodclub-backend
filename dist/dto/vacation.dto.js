"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVacationDTO = exports.createVacationValidator = void 0;
const express_validator_1 = require("express-validator");
const multer_config_1 = require("../config/multer.config");
exports.createVacationValidator = [
    multer_config_1.upload.single('picture'),
    (0, express_validator_1.check)("destination").notEmpty().withMessage("Destination is required"),
    (0, express_validator_1.check)("description").notEmpty().withMessage("Description is required"),
    (0, express_validator_1.check)("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0, max: 10000 })
        .withMessage("Price must be between $0 and $10000"),
    (0, express_validator_1.check)("start_date")
        .notEmpty()
        .withMessage("Start date is required")
        .isDate()
        .withMessage("Start date must be a valid date.")
        .isAfter(new Date().toISOString().split("T")[0])
        .withMessage("Start date cannot be in the past"),
    (0, express_validator_1.check)("end_date")
        .notEmpty()
        .withMessage("End date is required")
        .isDate()
        .withMessage("End date must be a valid date.")
        .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.start_date)) {
            throw new Error("End date must be after the start date.");
        }
        return true;
    }),
];
class CreateVacationDTO {
}
exports.CreateVacationDTO = CreateVacationDTO;

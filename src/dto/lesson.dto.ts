import {Assignment} from "../entity/assignment.entity";
import {body, check} from "express-validator";
import {Column} from "typeorm";

export const lessonValidator = [
    check("title")
        .notEmpty().withMessage("Title is required")
        .trim(),
    check("description")
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    check("author")
        .isString()
        .withMessage('Description must be a string'),
    check("order")
        .isNumeric()
        .withMessage('Order must be a number'),
    check("qualification")
        .isString()
        .withMessage('Description must be a string'),
    body('assignments').optional().isArray().withMessage('Assignments must be an array'),
    body('assignments.*.title').optional().isString().withMessage('Assignment title must be a string'),
    body('assignments.*.description').optional().isString().withMessage('Assignment description must be a string'),
];

export class LessonDto {
    title: string;
    description: string;
    image: string;
    author: string;
    qualification: string;
    order: number;
    assignments: Assignment[];
}
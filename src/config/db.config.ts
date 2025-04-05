import {DataSource} from "typeorm";
import dotenv from "dotenv";
import {User} from "../entity/user.entity";
import {Lesson} from "../entity/lesson.entity";
import {Assignment} from "../entity/assignment.entity";
import {StudentLesson} from "../entity/student.lesson.entity";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: false,
    logging: true,
    entities: [User, Lesson, Assignment, StudentLesson],
    subscribers: [],
    migrations: [],
})

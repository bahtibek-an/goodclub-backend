import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
import {Lesson} from "./lesson.entity";

export enum StudentLessonStatus {
    LOCKED = "LOCKED",
    UNLOCKED = "UNLOCKED",
    COMPLETED = "COMPLETED",
}

@Entity()
export class StudentLesson {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => User, user => user.lessons, { cascade: true })
    public user: User;

    @Column({
        type: "enum",
        enum: StudentLessonStatus,
        default: StudentLessonStatus.LOCKED,
    })
    public status: StudentLessonStatus;

    @ManyToOne(() => Lesson, lesson => lesson.studentLessons, { cascade: true })
    public lesson: Lesson
}
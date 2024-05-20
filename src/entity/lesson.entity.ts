import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Assignment} from "./assignment.entity";
import {StudentLesson} from "./student.lesson.entity";

export enum LessonStatus {
    PROCESS = "PROCESS",
    ACTIVE = "ACTIVE",
    BLOCK = "BLOCK",
}

@Entity()
export class Lesson {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 255, nullable: true})
    public video720p: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    public video360p: string;

    @Column({ type: "decimal", nullable: false, default: 0 })
    public duration: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    public image: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    public title: string;

    @Column({type: 'enum', enum: LessonStatus, default: LessonStatus.PROCESS})
    public status: LessonStatus;

    @Column({type: "text", nullable: true})
    public description: string;

    @Column({type: "text", nullable: false})
    public author: string;

    @Column({type: "text", nullable: false})
    public qualification: string;

    @Column({ type: "decimal", nullable: false, default: 0 })
    public order: number;

    @Column({ type: "boolean", default: false })
    public isAlwaysOpened: boolean;

    @OneToMany(() => Assignment, assignment => assignment.lesson)
    public assignments: Assignment[];

    @OneToMany(() => StudentLesson, studentLesson => studentLesson.lesson)
    public studentLessons: StudentLesson[];

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public created_at: Date;

    @UpdateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
    public updated_at: Date;
}
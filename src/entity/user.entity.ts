import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {StudentLesson} from "./student.lesson.entity";

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
}

export enum GenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
}

export enum UserType {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    OTHERS = "OTHERS"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @OneToMany(() => StudentLesson, studentLesson => studentLesson.user)
    public lessons: StudentLesson[];

    @Column({type: 'varchar', length: 255, unique: true})
    public username: string;

    @Column({type: 'varchar', length: 255})
    public password: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    public firstName: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    public lastName: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    public phoneNumber: string;

    @Column({type: 'date', nullable: true})
    public dateOfBirth: Date;

    @Column({type: 'varchar', length: 255, nullable: true})
    public province: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    public district: string;



    // admin data

    @Column({type: 'varchar', length: 255, nullable: true, default: ""})
    public companyName: string;

    @Column({type: 'varchar', length: 255, nullable: true, default: ""})
    public inn: string;

    @Column({type: 'varchar', length: 255, nullable: true, default: ""})
    public contact: string;

    @Column({type: 'varchar', length: 255, nullable: true, default: ""})
    public email: string;





    @Column({type: 'enum', enum: UserType, default: UserType.STUDENT})
    public userType: UserType;

    @Column({
        type: 'enum',
        enum: GenderEnum,
        default: GenderEnum.MALE
    })
    public gender: GenderEnum;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true
    })
    public workplace: string;


    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    public role: UserRole;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    public status: UserStatus;

    @Column({ type: "decimal", nullable: true })
    public schoolNumber: number;

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public created_at: Date;

    @UpdateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
    public updated_at: Date;
}
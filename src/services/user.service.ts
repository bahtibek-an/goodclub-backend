import {Repository} from "typeorm";
import {GenderEnum, User, UserRole, UserStatus} from "../entity/user.entity";
import {AppDataSource} from "../config/db.config";
import {createHashPassword} from "../config/bcrypt.config";
import ApiError from "../exceptions/api.error.exception";
import * as ExcelJS from "exceljs";


class UserService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

    public async getUserById(userId: number) {
        return await this.userRepository.findOne({
            where: {
                id: userId,
                status: UserStatus.ACTIVE
            },
            relations: ["lessons", "lessons.lesson"]
        });
    }

    public getAdminById =  async (userId: number) => {
        return await this.userRepository.findOneBy({
            id: userId,
            role: UserRole.ADMIN,
        });
    }

    public updateAdminById = async (userId: number, username: string, password: string) => {
        const user = await this.userRepository.findOneBy({
            id: userId,
            role: UserRole.ADMIN,
        });
        return await this.userRepository.save({
            ...user,
            username: username,
            password: password,
        });
    }


    public async getUsers(offset: number, limit: number, status?: UserStatus, search?: string) {
        let query = this.userRepository.createQueryBuilder('user');

        query = query.where('user.role = :role', {role: UserRole.USER});

        if (status) {
            query = query.andWhere('user.status = :status', {status});
        }

        if (search) {
            query = query.andWhere(
                '(user.firstName ILIKE :search OR user.lastName ILIKE :search)',
                {search: `%${search}%`}
            );
        }

        const [users, total] = await query
            .orderBy('user.created_at', 'DESC')
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        return {data: users, count: total};
    }

    public async fillUserById(userId: number, user: Partial<User>) {
        const updatedUser = await this.userRepository.findOneBy({id: userId});
        if (!updatedUser) {
            throw ApiError.UnauthorizedError();
        }
        if (updatedUser.status === UserStatus.ACTIVE) {
            throw ApiError.BadRequest("User already been activated");
        }
        return this.userRepository.save({
            ...updatedUser,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            province: user.province,
            district: user.district,
            userType: user.userType,
            gender: user.gender,
            workplace: user.workplace,
            status: UserStatus.ACTIVE,
            schoolNumber: user.schoolNumber,
        });
    }

    public async create(): Promise<User> {

        const lastUser = await this.userRepository
            .createQueryBuilder("user")
            .orderBy("user.id", "DESC")
            .getOne();

        let nextNumber = 1;
        if (lastUser) {
            const lastNumber = lastUser.id;
            nextNumber = lastNumber + 1;
        }
        const newUsername = `GCEFR-${nextNumber.toString()}`;
        const password = this.generatePassword();

        return await this.userRepository.save({username: newUsername, password});
    }

    public async createAdmin(): Promise<User> {
        const password = await createHashPassword("admin");
        return await this.userRepository.save({
            username: "admin@gmail.com",
            password, role: UserRole.ADMIN,
            firstName: "admin",
            lastName: "admin",
            phoneNumber: "0123456789",
            dateOfBirth: "1990-01-01",
            country: "Russia",
            region: "Moscow",
            gender: GenderEnum.MALE,
        });
    }

    private generatePassword = () => {
        let length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    public async generateExcel() {
        const users = await this.userRepository.find({where: {role: UserRole.USER}});
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users", {
            pageSetup: {fitToPage: true}
        });
        worksheet.autoFilter = {
            from: "A",
            to: "H"
        };
        worksheet.columns = [
            {header: "ID", key: "col1", width: 25},
            {header: "username", key: "col2", width: 25},
            {header: "password", key: "col3", width: 25},
            {header: "First name", key: "col4", width: 25},
            {header: "Last name", key: "col5", width: 25},
            {header: "Phone number", key: "col6", width: 25},
            {header: "Date of birth", key: "col7", width: 25},
            {header: "Province", key: "col8", width: 25},
            {header: "District", key: "col9", width: 25},
            {header: "User type", key: "col10", width: 25},
            {header: "Gender", key: "col11", width: 25},
            {header: "Workplace", key: "col12", width: 25},
            {header: "Status", key: "col13", width: 25},
            {header: "School number", key: "col14", width: 25},
        ];
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {argb: "5B9BD5"}
            };
            cell.border = {
                top: {style: "thin"},
                left: {style: "thin"},
                bottom: {style: "thin"},
                right: {style: "thin"}
            };
        });
        users.forEach((user, index) => {
            const row = worksheet.addRow({
                col1: user.id,
                col2: user.username,
                col3: user.password,
                col4: user.firstName,
                col5: user.lastName,
                col6: user.phoneNumber,
                col7: user.dateOfBirth,
                col8: user.province,
                col9: user.district,
                col10: user.userType,
                col11: user.gender,
                col12: user.workplace,
                col13: user.status,
                col14: user.schoolNumber,
            });

            if (index % 2 === 1) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: {argb: "DDEBF7"}
                    };
                });
            }
        });

        return await workbook.xlsx.writeBuffer();
    }
}

export default UserService;
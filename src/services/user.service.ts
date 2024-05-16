import {FindOptionsWhere, ILike, Repository} from "typeorm";
import {GenderEnum, User, UserRole, UserStatus} from "../entity/user.entity";
import {AppDataSource} from "../config/db.config";
import {createHashPassword} from "../config/bcrypt.config";
import ApiError from "../exceptions/api.error.exception";


class UserService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

    public async getUsers(offset: number, limit: number, status?: UserStatus, search?: string) {
        const whereClause: FindOptionsWhere<User> = {
            role: UserRole.USER,
        }
        if(status) {
            whereClause.status = status;
        }

        if(search) {
            whereClause.firstName = ILike(`%${search}%`);
            whereClause.lastName = ILike(`%${search}%`);
        }


        const [users, total] = await this.userRepository.findAndCount({
                where: whereClause,
                skip: offset,
                take: limit,
                order: {
                    created_at: "DESC"
                }
            }
        );
        return {data: users, count: total}
    }

    public async fillUserById(userId: number, user: Partial<User>) {
        const updatedUser = await this.userRepository.findOneBy({ id: userId });
        if(!updatedUser) {
            throw ApiError.UnauthorizedError();
        }
        if(updatedUser.status === UserStatus.ACTIVE) {
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
            status: UserStatus.ACTIVE
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
        const newUsername = `CefrUser${nextNumber.toString()}`;
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
}

export default UserService;
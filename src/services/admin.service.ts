import {Repository} from "typeorm";
import {User} from "../entity/user.entity";
import {AppDataSource} from "../config/db.config";
import JwtConfig from "../config/jwt.config";
import {Lesson} from "../entity/lesson.entity";


class AdminService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);
    private readonly lessonRepository: Repository<Lesson> = AppDataSource.getRepository(Lesson);

    public async getStats() {
        const countOfUsers = await this.userRepository.count();
        const countOfLessons = await this.lessonRepository.count();

        return { countOfUsers, countOfLessons };
    }

}

export default AdminService;
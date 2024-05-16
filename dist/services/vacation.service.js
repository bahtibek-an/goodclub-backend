"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("../config/db.config");
const vacation_entity_1 = require("../entity/vacation.entity");
const user_entity_1 = require("../entity/user.entity");
const followers_entity_1 = require("../entity/followers.entity");
const api_error_exception_1 = __importDefault(require("../exceptions/api.error.exception"));
class VacationService {
    constructor() {
        this.vacationRepository = db_config_1.AppDataSource.getRepository(vacation_entity_1.Vacation);
        this.userRepository = db_config_1.AppDataSource.getRepository(user_entity_1.User);
        this.followersRepository = db_config_1.AppDataSource.getRepository(followers_entity_1.Followers);
    }
    getAllVacations(host, userId, follow, upcoming, active, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.vacationRepository.createQueryBuilder("vacation");
            query = query.leftJoinAndMapMany("vacation.followers", followers_entity_1.Followers, "follower", "follower.vacationId = vacation.id");
            if (follow) {
                query = query.
                    leftJoinAndSelect("vacation.followers", "followers")
                    .where("followers.userId = :userId", { userId });
            }
            if (upcoming) {
                query = query.andWhere("vacation.start_date > CURRENT_TIMESTAMP");
            }
            if (active) {
                query = query.andWhere("vacation.start_date <= CURRENT_TIMESTAMP AND vacation.end_date >= CURRENT_TIMESTAMP");
            }
            query = query.offset(offset).limit(limit);
            query = query.orderBy("vacation.start_date", "ASC");
            const [vacations, total] = yield query.getManyAndCount();
            for (const vacation of vacations) {
                if (vacation.picture) {
                    vacation.picture = `${host}${vacation.picture}`;
                }
                if (userId) {
                    vacation.is_following = (yield this.isUserFollowingVacation(userId, vacation.id)) != null;
                }
                vacation.followers_count = vacation.followers.length;
            }
            return { data: vacations, total: total };
        });
    }
    getVacationById(vacationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vacation = yield this.vacationRepository.findOneBy({ id: vacationId });
            if (!vacation) {
                throw api_error_exception_1.default.NotFoundError();
            }
            return vacation;
        });
    }
    createVacation(createVacation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.vacationRepository.save(createVacation);
        });
    }
    updateVacation(vacationId, updateVacation) {
        return __awaiter(this, void 0, void 0, function* () {
            // const vacation = await this.vacationRepository.findOneBy({ id: +vacationId });
            // if (!vacation) {
            //     throw ApiError.NotFoundError();
            // }
            // this.vacationRepository.merge(vacation, updateVacation);
            // return await this.userRepository.save(vacation);
            const vacation = yield this.vacationRepository.update(vacationId, updateVacation);
            return vacation;
        });
    }
    deleteVacation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.followersRepository.createQueryBuilder()
                .delete()
                .from(followers_entity_1.Followers)
                .where("vacationId = :id", { id })
                .execute();
            return yield this.vacationRepository.delete(id);
        });
    }
    followToVacation(userId, vacationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id: userId });
            const vacation = yield this.vacationRepository.findOneBy({ id: vacationId });
            if (!user || !vacation) {
                throw api_error_exception_1.default.NotFoundError();
            }
            const follower = new followers_entity_1.Followers();
            follower.user = user;
            follower.vacation = vacation;
            return yield this.followersRepository.save(follower);
        });
    }
    unfollowFromVacation(userId, vacationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const follower = yield this.followersRepository.findOneBy({
                user: { id: userId },
                vacation: { id: vacationId }
            });
            if (!follower) {
                throw api_error_exception_1.default.NotFoundError();
            }
            return yield this.followersRepository.remove(follower);
        });
    }
    isUserFollowingVacation(userId, vacationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.followersRepository.findOneBy({
                user: { id: userId },
                vacation: { id: vacationId }
            });
        });
    }
    getVacationsWithFollowersCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const vacationsWithFollowers = yield this.vacationRepository.find({
                relations: ["followers"]
            });
            const reportData = vacationsWithFollowers.map(vacation => ({
                destination: vacation.destination,
                followersCount: vacation.followers.length
            }));
            return reportData;
        });
    }
}
exports.default = VacationService;

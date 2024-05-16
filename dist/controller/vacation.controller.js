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
const express_validator_1 = require("express-validator");
const api_error_exception_1 = __importDefault(require("../exceptions/api.error.exception"));
const vacation_service_1 = __importDefault(require("../services/vacation.service"));
const csv_stringify_1 = require("csv-stringify");
class AuthController {
    constructor() {
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.vacationService.getVacationsWithFollowersCount();
                const fullUrl = req.protocol + '://' + req.get('host') + "/";
                const userId = req.user.userId;
                const follow = req.query.follow === 'true';
                const upcoming = req.query.upcoming === 'true';
                const active = req.query.active === 'true';
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const offset = (page - 1) * limit;
                const vacations = yield this.vacationService.getAllVacations(fullUrl, userId, follow, upcoming, active, limit, offset);
                return res.json({
                    results: vacations.data,
                    page,
                    limit,
                    totalRecords: vacations.total
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.getVacationStats = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.vacationService.getVacationsWithFollowersCount();
                return res.json(stats);
            }
            catch (e) {
                next(e);
            }
        });
        this.getOne = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const vacation = yield this.vacationService.getVacationById(+id);
                return res.json(vacation);
            }
            catch (e) {
                next(e);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw api_error_exception_1.default.BadRequest("error", errors.array());
                }
                if (!req.file) {
                    throw api_error_exception_1.default.BadRequest("Picture is required");
                }
                const picture = req.file.filename;
                const vacation = yield this.vacationService.createVacation(Object.assign(Object.assign({}, req.body), { picture }));
                return res.status(201).json(vacation);
            }
            catch (e) {
                next(e);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id } = req.params;
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    throw api_error_exception_1.default.BadRequest("error", errors.array());
                }
                const picture = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                const vacation = yield this.vacationService.updateVacation(id, Object.assign(Object.assign({}, req.body), { picture }));
                return res.json(vacation);
            }
            catch (e) {
                next(e);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const vacation = yield this.vacationService.deleteVacation(id);
                return res.status(200).json(vacation);
            }
            catch (e) {
                next(e);
            }
        });
        this.followVacation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { vacationId } = req.params;
            const userId = req.user.userId;
            try {
                const follower = yield this.vacationService.followToVacation(userId, +vacationId);
                return res.status(201).json(follower);
            }
            catch (e) {
                next(e);
            }
        });
        this.unfollowVacation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { vacationId } = req.params;
            const userId = req.user.userId;
            try {
                const follower = yield this.vacationService.unfollowFromVacation(userId, +vacationId);
                return res.status(200).json(follower);
            }
            catch (e) {
                next(e);
            }
        });
        this.getCsvFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const parsedData = yield this.vacationService.getVacationsWithFollowersCount();
            const data = parsedData.map((item) => ({
                Destination: item.destination,
                Followers: item.followersCount,
            }));
            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', 'attachment; filename="filename.csv"');
            (0, csv_stringify_1.stringify)(data, { header: true })
                .pipe(res);
        });
        this.vacationService = new vacation_service_1.default();
    }
}
exports.default = AuthController;

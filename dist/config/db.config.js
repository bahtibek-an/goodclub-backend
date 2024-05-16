"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const user_entity_1 = require("../entity/user.entity");
const vacation_entity_1 = require("../entity/vacation.entity");
const followers_entity_1 = require("../entity/followers.entity");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.MYSQLDB_HOST,
    port: +process.env.MYSQLDB_LOCAL_PORT,
    username: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [user_entity_1.User, vacation_entity_1.Vacation, followers_entity_1.Followers],
    subscribers: [],
    migrations: [],
});

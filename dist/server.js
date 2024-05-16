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
const db_config_1 = require("./config/db.config");
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
// const options = {
//     key: fs.readFileSync(path.join(__dirname, "..", "./localhost.key")),
//     cert: fs.readFileSync(path.join(__dirname, "..", "./localhost.crt")),
// };
// const httpServer = https.createServer(options, app);
const httpServer = http_1.default.createServer(app_1.default);
;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_config_1.AppDataSource.initialize();
        httpServer.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    }
    catch (e) {
        console.error(e);
    }
}))();
process.on("SIGTERM", () => {
    console.log("Received SIGTERM signal. Shutting down gracefully...");
    process.exit(0);
});

import {AppDataSource} from "./config/db.config";
import app from "./app";
import dotenv from "dotenv";
import https from "node:https";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import UserService from "./services/user.service";

const PORT = process.env.PORT || 5000;
dotenv.config();
const httpServer = http.createServer(app);

;(async () => {
    try {
        await AppDataSource.initialize();
        // const userService = new UserService();
        // await userService.createAdmin();
        httpServer.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        });
    } catch (e) {
        console.error(e);
    }
})();

process.on("SIGTERM", () => {
    console.log("Received SIGTERM signal. Shutting down gracefully...");
    process.exit(0);
});
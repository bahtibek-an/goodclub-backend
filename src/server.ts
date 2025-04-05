import {AppDataSource} from "./config/db.config";
import app from "./app";
import dotenv from "dotenv";
import http from "node:http";


dotenv.config();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

;(async () => {
    try {
        await AppDataSource.initialize();
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

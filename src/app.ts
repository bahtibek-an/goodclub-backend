import express, {NextFunction} from "express";
import cors from "cors";
import "reflect-metadata"
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import path from "node:path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authMiddleware from "./middlewares/auth.middleware";

const app = express();
app.use(morgan("combined"));
app.use(cors({credentials: true, origin: true, }));

app.use(cookieParser());
app.use(express.json());

app.use(
    // authMiddleware,
    express.static(path.join(__dirname, "..", "uploads"))
);

app.use("/api/v1", routes);
app.use(errorMiddleware);


export default app;
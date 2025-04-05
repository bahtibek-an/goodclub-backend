import express from "express";
import cors from "cors";
import "reflect-metadata"
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {getUploadDirWithoutFileName} from "./utils";
import {serve, setup, swaggerSpec} from "./config/swagger.config";
import basicAuth from 'express-basic-auth';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const SWAGGER_USER = process.env.SWAGGER_USER!;
const SWAGGER_PASSWORD = process.env.SWAGGER_PASSWORD!;

app.use(morgan("combined"));
app.use(cors({credentials: true, origin: true, }));

app.use(cookieParser());
app.use(express.json());

app.use(
    express.static(getUploadDirWithoutFileName())
);


app.use("/api/v1", routes);
app.use('/', basicAuth({
    users: { [SWAGGER_USER]: SWAGGER_PASSWORD },
    challenge: true,
    realm: 'Imb4T3st4pp',
}), serve, setup(swaggerSpec));

app.use(errorMiddleware);


export default app;

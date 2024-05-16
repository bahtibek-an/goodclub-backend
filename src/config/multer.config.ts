import multer from "multer";
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import express from "express";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        console.log(file)
        cb(null, `${uniqueSuffix}${file.originalname}`);
    }
});

const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // cb(null, false);
        cb(new Error("Not a valid file type"));
    }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
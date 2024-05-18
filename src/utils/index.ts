import path from "node:path";
import dotenv from "dotenv";
dotenv.config();


export const getUploadDirWithoutFileName = () => {
    const baseUploadPath = process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads");
    return path.join(baseUploadPath);
}
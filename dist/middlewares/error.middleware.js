"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_exception_1 = __importDefault(require("../exceptions/api.error.exception"));
function default_1(err, req, res, next) {
    if (err instanceof api_error_exception_1.default) {
        console.error(err.message);
        return res.status(err.status).json({ message: err.message, status: err.errors });
    }
    console.error(err);
    return res.status(500).json({ message: "Unexpected error" });
}
exports.default = default_1;

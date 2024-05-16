import { Request } from "express";

interface RequestWithCookies extends Request {
    cookies: any;
}

export default RequestWithCookies;
import AdminService from "../services/admin.service";
import {Request, Response, NextFunction} from "express";
import RequestWithUser from "../interfaces/RequestWithUser.interface";


class AdminController {
    private readonly adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
    }

    public getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await this.adminService.getStats();
            return res.json(stats);
        } catch (e) {
            next(e);
        }
    }

}

export default AdminController;
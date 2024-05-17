import AdminService from "../services/admin.service";
import {Request, Response, NextFunction} from "express";


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
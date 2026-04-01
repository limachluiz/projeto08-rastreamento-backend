import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(authMiddleware);
dashboardRoutes.get("/", (req, res) => dashboardController.show(req, res));

export { dashboardRoutes };
import { Router } from "express";
import { LoteController } from "../controllers/LoteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const loteRoutes = Router();
const loteController = new LoteController();

loteRoutes.use(authMiddleware);

loteRoutes.post("/", (req, res) => loteController.create(req, res));
loteRoutes.get("/", (req, res) => loteController.list(req, res));
loteRoutes.get("/:id", (req, res) => loteController.findById(req, res));
loteRoutes.patch("/:id/status", (req, res) =>
  loteController.updateStatus(req, res)
);

export { loteRoutes };
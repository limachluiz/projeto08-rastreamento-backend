import { Router } from "express";
import { InspecaoController } from "../controllers/InspecaoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const inspecaoRoutes = Router();
const inspecaoController = new InspecaoController();

inspecaoRoutes.use(authMiddleware);

inspecaoRoutes.post("/lotes/:id/inspecao", (req, res) =>
  inspecaoController.create(req, res)
);

export { inspecaoRoutes };
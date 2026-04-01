import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { RastreabilidadeController } from "../controllers/RastreabilidadeController";

const rastreabilidadeRoutes = Router();
const rastreabilidadeController = new RastreabilidadeController();

rastreabilidadeRoutes.use(authMiddleware);

rastreabilidadeRoutes.get("/rastreabilidade", (req, res) =>
  rastreabilidadeController.show(req, res)
);

export { rastreabilidadeRoutes };
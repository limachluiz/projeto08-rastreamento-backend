import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { InsumoLoteController } from "../controllers/InsumoLoteController";

const insumoLoteRoutes = Router();
const insumoLoteController = new InsumoLoteController();

insumoLoteRoutes.use(authMiddleware);

insumoLoteRoutes.post("/lotes/:id/insumos", (req, res) =>
  insumoLoteController.create(req, res)
);

insumoLoteRoutes.get("/lotes/:id/insumos", (req, res) =>
  insumoLoteController.listByLote(req, res)
);

insumoLoteRoutes.delete("/lotes/:id/insumos/:insumoId", (req, res) =>
  insumoLoteController.remove(req, res)
);

export { insumoLoteRoutes };
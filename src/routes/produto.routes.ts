import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const produtoRoutes = Router();
const produtoController = new ProdutoController();

produtoRoutes.use(authMiddleware);

produtoRoutes.post("/", (req, res) => produtoController.create(req, res));
produtoRoutes.get("/", (req, res) => produtoController.list(req, res));
produtoRoutes.get("/:id", (req, res) => produtoController.findById(req, res));
produtoRoutes.patch("/:id", (req, res) => produtoController.update(req, res));
produtoRoutes.delete("/:id", (req, res) => produtoController.inativar(req, res));

export { produtoRoutes };
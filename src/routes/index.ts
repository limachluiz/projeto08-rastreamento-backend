import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { produtoRoutes } from "./produto.routes";
import { loteRoutes } from "./lote.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/produtos", produtoRoutes);
routes.use("/lotes", loteRoutes);

export { routes };
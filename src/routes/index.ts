import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { produtoRoutes } from "./produto.routes";
import { loteRoutes } from "./lote.routes";
import { inspecaoRoutes } from "./inspecao.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { insumoLoteRoutes } from "./insumo-lote.routes";
import { rastreabilidadeRoutes } from "./rastreabilidade.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/produtos", produtoRoutes);
routes.use("/lotes", loteRoutes);
routes.use(inspecaoRoutes);
routes.use("/dashboard", dashboardRoutes);
routes.use(insumoLoteRoutes);
routes.use(rastreabilidadeRoutes);

export { routes };
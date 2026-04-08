import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.get("/me", authMiddleware, (req, res) => authController.me(req, res));
authRoutes.post("/refresh", (req, res) => authController.refresh(req, res));
authRoutes.post("/logout", authMiddleware, (req, res) =>
  authController.logout(req, res)
);

export { authRoutes };
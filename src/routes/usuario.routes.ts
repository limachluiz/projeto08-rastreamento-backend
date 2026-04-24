import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new UsuarioController();

router.use(authMiddleware);

router.get("/",        (req, res) => controller.list(req, res));
router.post("/",       (req, res) => controller.create(req, res));
router.put("/:id",     (req, res) => controller.update(req, res));
router.delete("/:id",  (req, res) => controller.remove(req, res));

export default router;

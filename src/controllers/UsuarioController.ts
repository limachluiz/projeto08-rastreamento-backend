import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const service = new UsuarioService();

export class UsuarioController {
  async list(req: Request, res: Response) {
    const data = await service.list();
    return res.json(data);
  }

  async create(req: Request, res: Response) {
    const { nome, email, senha, perfil } = req.body;
    const data = await service.create({ nome, email, senha, perfil });
    return res.status(201).json(data);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await service.update(id, req.body);
    return res.json(data);
  }

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await service.remove(id);
    return res.json(data);
  }
}

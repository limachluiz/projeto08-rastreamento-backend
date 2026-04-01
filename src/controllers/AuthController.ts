import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService = new AuthService();

  async login(request: Request, response: Response) {
    const { email, senha } = request.body;
    const resultado = await this.authService.login({ email, senha });
    return response.status(200).json(resultado);
  }

me(request: Request, response: Response) {
    return response.status(200).json({
        usuario: request.user,
    });
  }
}
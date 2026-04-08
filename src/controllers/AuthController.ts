import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService = new AuthService();

  async login(request: Request, response: Response) {
    try {
      const { email, senha } = request.body ?? {};

      if (!email || !senha) {
        return response.status(400).json({
          message: "E-mail e senha são obrigatórios.",
        });
      }

      const resultado = await this.authService.login({ email, senha });

      return response.status(200).json(resultado);
    } catch (error) {
      return response.status(401).json({
        message:
          error instanceof Error ? error.message : "Erro ao realizar login.",
      });
    }
  }

  me(request: Request, response: Response) {
    return response.status(200).json({
      usuario: request.user,
    });
  }

  async refresh(request: Request, response: Response) {
    try {
      const { refreshToken } = request.body ?? {};

      if (!refreshToken) {
        return response.status(400).json({
          message: "O campo refreshToken é obrigatório.",
        });
      }

      const resultado = await this.authService.refresh(refreshToken);

      return response.status(200).json(resultado);
    } catch (error) {
      return response.status(401).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao renovar o token.",
      });
    }
  }

  async logout(request: Request, response: Response) {
    try {
      if (!request.user) {
        return response.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      const resultado = await this.authService.logout(request.user.id);

      return response.status(200).json(resultado);
    } catch (error) {
      return response.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao realizar logout.",
      });
    }
  }
}
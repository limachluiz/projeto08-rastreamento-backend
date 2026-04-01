import { Request, Response } from "express";
import { InspecaoService } from "../services/InspecaoService";

export class InspecaoController {
  private inspecaoService = new InspecaoService();

  async create(request: Request, response: Response) {
    try {
      const loteId = Number(request.params.id);
      const { resultado, quantidadeRepr, descricaoDesvio } = request.body ?? {};

      if (!request.user) {
        return response.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      if (!resultado) {
        return response.status(400).json({
          message: "O campo resultado é obrigatório.",
        });
      }

      const inspecao = await this.inspecaoService.create({
        loteId,
        inspetorId: request.user.id,
        resultado,
        quantidadeRepr: quantidadeRepr ? Number(quantidadeRepr) : 0,
        descricaoDesvio,
      });

      return response.status(201).json(inspecao);
    } catch (error) {
      return response.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao registrar inspeção.",
      });
    }
  }
}
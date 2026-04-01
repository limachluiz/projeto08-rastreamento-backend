import { Request, Response } from "express";
import { RastreabilidadeService } from "../services/RastreabilidadeService";

export class RastreabilidadeController {
  private rastreabilidadeService = new RastreabilidadeService();

  async show(request: Request, response: Response) {
    try {
      const lote = request.query.lote ? String(request.query.lote) : undefined;
      const insumo = request.query.insumo ? String(request.query.insumo) : undefined;

      if (!lote && !insumo) {
        return response.status(400).json({
          message: "Informe o parâmetro ?lote= ou ?insumo=.",
        });
      }

      const resultado = await this.rastreabilidadeService.buscar({
        lote,
        insumo,
      });

      return response.status(200).json(resultado);
    } catch (error) {
      return response.status(404).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao consultar rastreabilidade.",
      });
    }
  }
}
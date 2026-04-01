import { Request, Response } from "express";
import { InsumoLoteService } from "../services/InsumoLoteService";

export class InsumoLoteController {
  private insumoLoteService = new InsumoLoteService();

  async create(request: Request, response: Response) {
    try {
      const loteId = Number(request.params.id);
      const {
        nomeInsumo,
        codigoInsumo,
        loteInsumo,
        quantidade,
        unidade,
      } = request.body ?? {};

      if (!nomeInsumo || !quantidade || !unidade) {
        return response.status(400).json({
          message: "nomeInsumo, quantidade e unidade são obrigatórios.",
        });
      }

      const insumo = await this.insumoLoteService.create({
        loteId,
        nomeInsumo,
        codigoInsumo,
        loteInsumo,
        quantidade: Number(quantidade),
        unidade,
      });

      return response.status(201).json(insumo);
    } catch (error) {
      return response.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao adicionar insumo.",
      });
    }
  }

  async listByLote(request: Request, response: Response) {
    try {
      const loteId = Number(request.params.id);

      const insumos = await this.insumoLoteService.listByLote(loteId);

      return response.status(200).json(insumos);
    } catch (error) {
      return response.status(404).json({
        message:
          error instanceof Error ? error.message : "Erro ao listar insumos.",
      });
    }
  }

  async remove(request: Request, response: Response) {
    try {
      const loteId = Number(request.params.id);
      const insumoId = Number(request.params.insumoId);

      const result = await this.insumoLoteService.remove(loteId, insumoId);

      return response.status(200).json(result);
    } catch (error) {
      return response.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao remover insumo.",
      });
    }
  }
}
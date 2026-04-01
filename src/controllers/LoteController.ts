import { Request, Response } from "express";
import { LoteService } from "../services/LoteService";

export class LoteController {
  private loteService = new LoteService();

  async create(request: Request, response: Response) {
    try {
      const {
        produtoId,
        dataProducao,
        turno,
        operadorId,
        linha,
        quantidadeProd,
        observacoes,
      } = request.body ?? {};

      if (
        !produtoId ||
        !dataProducao ||
        !turno ||
        !operadorId ||
        !linha ||
        !quantidadeProd
      ) {
        return response.status(400).json({
          message:
            "produtoId, dataProducao, turno, operadorId, linha e quantidadeProd são obrigatórios.",
        });
      }

      const lote = await this.loteService.create({
        produtoId: Number(produtoId),
        dataProducao,
        turno,
        operadorId: Number(operadorId),
        linha,
        quantidadeProd: Number(quantidadeProd),
        observacoes,
      });

      return response.status(201).json(lote);
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao criar lote.",
      });
    }
  }

  async list(request: Request, response: Response) {
    try {
      const { produtoId, status, dataInicio, dataFim, numeroLote } = request.query;

      const lotes = await this.loteService.list({
        produtoId: produtoId ? Number(produtoId) : undefined,
        status: status ? String(status) : undefined,
        dataInicio: dataInicio ? String(dataInicio) : undefined,
        dataFim: dataFim ? String(dataFim) : undefined,
        numeroLote: numeroLote ? String(numeroLote) : undefined,
      });

      return response.status(200).json(lotes);
    } catch {
      return response.status(500).json({
        message: "Erro ao listar lotes.",
      });
    }
  }

  async findById(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);
      const lote = await this.loteService.findById(id);

      return response.status(200).json(lote);
    } catch (error) {
      return response.status(404).json({
        message: error instanceof Error ? error.message : "Lote não encontrado.",
      });
    }
  }

  async updateStatus(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);
      const { status } = request.body ?? {};

      if (!status) {
        return response.status(400).json({
          message: "O campo status é obrigatório.",
        });
      }

      const lote = await this.loteService.updateStatus(id, { status });

      return response.status(200).json(lote);
    } catch (error) {
      return response.status(400).json({
        message:
          error instanceof Error ? error.message : "Erro ao atualizar status do lote.",
      });
    }
  }
}
import { Request, Response } from "express";
import { ProdutoService } from "../services/ProdutoService";

export class ProdutoController {
  private produtoService = new ProdutoService();

  async create(request: Request, response: Response) {
    try {
      const { codigo, nome, descricao, linha } = request.body ?? {};

      if (!codigo || !nome || !linha) {
        return response.status(400).json({
          message: "Código, nome e linha são obrigatórios.",
        });
      }

      const produto = await this.produtoService.create({
        codigo,
        nome,
        descricao,
        linha,
      });

      return response.status(201).json(produto);
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao criar produto.",
      });
    }
  }

  async list(_request: Request, response: Response) {
    try {
      const produtos = await this.produtoService.list();

      return response.status(200).json(produtos);
    } catch {
      return response.status(500).json({
        message: "Erro ao listar produtos.",
      });
    }
  }

  async findById(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      const produto = await this.produtoService.findById(id);

      return response.status(200).json(produto);
    } catch (error) {
      return response.status(404).json({
        message: error instanceof Error ? error.message : "Produto não encontrado.",
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      const produto = await this.produtoService.update(id, request.body ?? {});

      return response.status(200).json(produto);
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao atualizar produto.",
      });
    }
  }

  async inativar(request: Request, response: Response) {
    try {
      const id = Number(request.params.id);

      const produto = await this.produtoService.inativar(id);

      return response.status(200).json(produto);
    } catch (error) {
      return response.status(404).json({
        message: error instanceof Error ? error.message : "Produto não encontrado.",
      });
    }
  }
}
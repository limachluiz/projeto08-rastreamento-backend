import { appDataSource } from "../database/appDataSource";
import { CreateInsumoLoteDTO } from "../dtos/CreateInsumoLoteDTO";
import { InsumoLote } from "../entities/InsumoLote";
import { Lote } from "../entities/Lote";
import { Status } from "../types/Status";

export class InsumoLoteService {
  private insumoLoteRepository = appDataSource.getRepository(InsumoLote);
  private loteRepository = appDataSource.getRepository(Lote);

  async create(data: CreateInsumoLoteDTO) {
    const lote = await this.loteRepository.findOne({
      where: { id: data.loteId },
      relations: {
        insumos: true,
      },
    });

    if (!lote) {
      throw new Error("Lote não encontrado.");
    }

    if (lote.status !== Status.EM_PRODUCAO) {
      throw new Error("Só é possível adicionar insumos em lotes em produção.");
    }

    if (data.quantidade <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }

    const insumo = this.insumoLoteRepository.create({
      lote,
      nomeInsumo: data.nomeInsumo.trim(),
      codigoInsumo: data.codigoInsumo?.trim() || null,
      loteInsumo: data.loteInsumo?.trim() || null,
      quantidade: Number(data.quantidade),
      unidade: data.unidade.trim(),
    });

    return await this.insumoLoteRepository.save(insumo);
  }

  async listByLote(loteId: number) {
    const lote = await this.loteRepository.findOne({
      where: { id: loteId },
    });

    if (!lote) {
      throw new Error("Lote não encontrado.");
    }

    return await this.insumoLoteRepository.find({
      where: {
        lote: { id: loteId },
      },
      order: {
        id: "ASC",
      },
    });
  }

  async remove(loteId: number, insumoId: number) {
    const lote = await this.loteRepository.findOne({
      where: { id: loteId },
    });

    if (!lote) {
      throw new Error("Lote não encontrado.");
    }

    if (lote.status !== Status.EM_PRODUCAO) {
      throw new Error("Só é possível remover insumos de lotes em produção.");
    }

    const insumo = await this.insumoLoteRepository.findOne({
      where: {
        id: insumoId,
        lote: { id: loteId },
      },
      relations: {
        lote: true,
      },
    });

    if (!insumo) {
      throw new Error("Insumo não encontrado para este lote.");
    }

    await this.insumoLoteRepository.remove(insumo);

    return {
      message: "Insumo removido com sucesso.",
    };
  }
}
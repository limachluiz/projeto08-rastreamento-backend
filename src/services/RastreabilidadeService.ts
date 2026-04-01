import { ILike } from "typeorm";
import { appDataSource } from "../database/appDataSource";
import { InsumoLote } from "../entities/InsumoLote";
import { Lote } from "../entities/Lote";
import { AppError } from "../errors/AppError";

export class RastreabilidadeService {
  private loteRepository = appDataSource.getRepository(Lote);
  private insumoLoteRepository = appDataSource.getRepository(InsumoLote);

  async buscarPorLote(numeroLote: string) {
    const lote = await this.loteRepository.findOne({
      where: {
        numeroLote: numeroLote.trim(),
      },
      relations: {
        produto: true,
        operador: true,
        insumos: true,
        inspecao: {
          inspetor: true,
        },
      },
    });

    if (!lote) {
      throw new AppError("Lote não encontrado.", 404);
    }

    return {
      tipoConsulta: "lote",
      lote: {
        id: lote.id,
        numeroLote: lote.numeroLote,
        dataProducao: lote.dataProducao,
        turno: lote.turno,
        linha: lote.linha,
        quantidadeProd: lote.quantidadeProd,
        quantidadeRepr: lote.quantidadeRepr,
        status: lote.status,
        observacoes: lote.observacoes,
        abertoEm: lote.abertoEm,
        encerradoEm: lote.encerradoEm,
        produto: {
          id: lote.produto.id,
          codigo: lote.produto.codigo,
          nome: lote.produto.nome,
          linha: lote.produto.linha,
        },
        operador: {
          id: lote.operador.id,
          nome: lote.operador.nome,
          email: lote.operador.email,
          perfil: lote.operador.perfil,
        },
        insumos: lote.insumos.map((insumo) => ({
          id: insumo.id,
          nomeInsumo: insumo.nomeInsumo,
          codigoInsumo: insumo.codigoInsumo,
          loteInsumo: insumo.loteInsumo,
          quantidade: insumo.quantidade,
          unidade: insumo.unidade,
        })),
        inspecao: lote.inspecao
          ? {
              id: lote.inspecao.id,
              resultado: lote.inspecao.resultado,
              quantidadeRepr: lote.inspecao.quantidadeRepr,
              descricaoDesvio: lote.inspecao.descricaoDesvio,
              inspecionadoEm: lote.inspecao.inspecionadoEm,
              inspetor: lote.inspecao.inspetor
                ? {
                    id: lote.inspecao.inspetor.id,
                    nome: lote.inspecao.inspetor.nome,
                    email: lote.inspecao.inspetor.email,
                  }
                : null,
            }
          : null,
      },
    };
  }

  async buscarPorInsumo(termo: string) {
    const termoBusca = termo.trim();

    const insumos = await this.insumoLoteRepository.find({
      where: [
        { codigoInsumo: ILike(`%${termoBusca}%`) },
        { loteInsumo: ILike(`%${termoBusca}%`) },
        { nomeInsumo: ILike(`%${termoBusca}%`) },
      ],
      relations: {
        lote: {
          produto: true,
          operador: true,
        },
      },
      order: {
        id: "DESC",
      },
    });

    if (insumos.length === 0) {
      throw new AppError("Nenhum lote encontrado para o insumo informado.", 404);
    }

    const lotesMap = new Map<number, any>();

    for (const insumo of insumos) {
      const lote = insumo.lote;

      if (!lotesMap.has(lote.id)) {
        lotesMap.set(lote.id, {
          id: lote.id,
          numeroLote: lote.numeroLote,
          dataProducao: lote.dataProducao,
          status: lote.status,
          linha: lote.linha,
          quantidadeProd: lote.quantidadeProd,
          produto: {
            id: lote.produto.id,
            codigo: lote.produto.codigo,
            nome: lote.produto.nome,
          },
          operador: {
            id: lote.operador.id,
            nome: lote.operador.nome,
          },
          insumosCorrespondentes: [],
        });
      }

      lotesMap.get(lote.id).insumosCorrespondentes.push({
        id: insumo.id,
        nomeInsumo: insumo.nomeInsumo,
        codigoInsumo: insumo.codigoInsumo,
        loteInsumo: insumo.loteInsumo,
        quantidade: insumo.quantidade,
        unidade: insumo.unidade,
      });
    }

    return {
      tipoConsulta: "insumo",
      termoBuscado: termoBusca,
      totalLotesAfetados: lotesMap.size,
      lotesAfetados: Array.from(lotesMap.values()),
    };
  }

  async buscar(params: { lote?: string; insumo?: string }) {
    if (params.lote) {
      return await this.buscarPorLote(params.lote);
    }

    if (params.insumo) {
      return await this.buscarPorInsumo(params.insumo);
    }

    throw new AppError("Informe ?lote=NUMERO_LOTE ou ?insumo=TERMO.");
  }
}
import { Between, ILike } from "typeorm";
import { appDataSource } from "../database/appDataSource";
import { CreateLoteDTO } from "../dtos/CreateLoteDTO";
import { ListLotesDTO } from "../dtos/ListLotesDTO";
import { UpdateStatusLoteDTO } from "../dtos/UpdateStatusLoteDTO";
import { Lote } from "../entities/Lote";
import { Produto } from "../entities/Produto";
import { Usuario } from "../entities/Usuario";
import { Status } from "../types/Status";
import { Turno } from "../types/Turno";
import { AppError } from "../errors/AppError";

export class LoteService {
  private loteRepository = appDataSource.getRepository(Lote);
  private produtoRepository = appDataSource.getRepository(Produto);
  private usuarioRepository = appDataSource.getRepository(Usuario);

  private async gerarNumeroLote(dataProducao: string): Promise<string> {
    const ano = new Date(dataProducao).getFullYear();

    const ultimoLote = await this.loteRepository
      .createQueryBuilder("lote")
      .where("lote.numero_lote LIKE :prefixo", {
        prefixo: `LOT-${ano}-%`,
      })
      .orderBy("lote.numero_lote", "DESC")
      .getOne();

    if (!ultimoLote) {
      return `LOT-${ano}-00001`;
    }

    const ultimaSequencia = Number(ultimoLote.numeroLote.split("-")[2] ?? "0");
    const novaSequencia = String(ultimaSequencia + 1).padStart(5, "0");

    return `LOT-${ano}-${novaSequencia}`;
  }

  async create(data: CreateLoteDTO) {
    const produto = await this.produtoRepository.findOne({
      where: { id: data.produtoId },
    });

    if (!produto) {
      throw new AppError("Produto não encontrado.", 404);
    }

    if (!produto.ativo) {
      throw new AppError("Produto inativo não pode gerar novo lote.", 404);
    }

    const operador = await this.usuarioRepository.findOne({
      where: { id: data.operadorId },
    });

    if (!operador) {
      throw new AppError("Operador não encontrado.", 404);
    }

    const turnoValido = Object.values(Turno).includes(data.turno as Turno);
    if (!turnoValido) {
      throw new AppError("Turno inválido.");
    }

    if (data.quantidadeProd <= 0) {
      throw new AppError("A quantidade produzida deve ser maior que zero.");
    }

    const numeroLote = await this.gerarNumeroLote(data.dataProducao);

    const lote = this.loteRepository.create({
      numeroLote,
      produto,
      dataProducao: data.dataProducao,
      turno: data.turno as Turno,
      operador,
      linha: data.linha,
      quantidadeProd: data.quantidadeProd,
      quantidadeRepr: 0,
      status: Status.EM_PRODUCAO,
      observacoes: data.observacoes ?? null,
      encerradoEm: null,
    });

    return await this.loteRepository.save(lote);
  }

  async list(filters: ListLotesDTO) {
    const where: any = {};

    if (filters.produtoId) {
      where.produto = { id: filters.produtoId };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.numeroLote) {
      where.numeroLote = ILike(`%${filters.numeroLote}%`);
    }

    if (filters.dataInicio && filters.dataFim) {
      where.dataProducao = Between(filters.dataInicio, filters.dataFim);
    }

    return await this.loteRepository.find({
      where,
      relations: {
        produto: true,
        operador: true,
      },
      order: {
        id: "DESC",
      },
    });
  }

  async findById(id: number) {
    const lote = await this.loteRepository.findOne({
      where: { id },
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

    return lote;
  }

  async updateStatus(id: number, data: UpdateStatusLoteDTO) {
    const lote = await this.loteRepository.findOne({
      where: { id },
      relations: {
        inspecao: true,
      },
    });

    if (!lote) {
      throw new AppError("Lote não encontrado.", 404);
    }

    const statusNovo = data.status as Status;

    const transicoesPermitidas: Record<Status, Status[]> = {
      [Status.EM_PRODUCAO]: [Status.AGUARDANDO_INSPECAO],
      [Status.AGUARDANDO_INSPECAO]: [
        Status.APROVADO,
        Status.APROVADO_RESTRICAO,
        Status.REPROVADO,
      ],
      [Status.APROVADO]: [],
      [Status.APROVADO_RESTRICAO]: [Status.AGUARDANDO_INSPECAO],
      [Status.REPROVADO]: [],
    };

    const permitido = transicoesPermitidas[lote.status].includes(statusNovo);

    if (!permitido) {
      throw new Error(
        `Transição inválida de '${lote.status}' para '${statusNovo}'.`
      );
    }

    lote.status = statusNovo;

    if (statusNovo === Status.AGUARDANDO_INSPECAO) {
      lote.encerradoEm = new Date();
    }

    return await this.loteRepository.save(lote);
  }
}

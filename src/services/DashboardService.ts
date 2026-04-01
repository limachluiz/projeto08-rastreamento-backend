import { appDataSource } from "../database/appDataSource";
import { Lote } from "../entities/Lote";
import { Status } from "../types/Status";

export class DashboardService {
  private loteRepository = appDataSource.getRepository(Lote);

  async getDashboard() {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0];

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);

    const inicioMesStr = inicioMes.toISOString().split("T")[0];
    const proximoMesStr = proximoMes.toISOString().split("T")[0];

    const lotesProduzidosHoje = await this.loteRepository.count({
      where: {
        dataProducao: hojeStr,
      },
    });

    const unidadesHojeRaw = await this.loteRepository
      .createQueryBuilder("lote")
      .select("COALESCE(SUM(lote.quantidade_prod), 0)", "total")
      .where("lote.data_producao = :hoje", { hoje: hojeStr })
      .getRawOne();

    const unidadesProduzidasHoje = Number(unidadesHojeRaw?.total ?? 0);

    const totalInspecionadosMes = await this.loteRepository
      .createQueryBuilder("lote")
      .where("lote.data_producao >= :inicioMes", { inicioMes: inicioMesStr })
      .andWhere("lote.data_producao < :proximoMes", { proximoMes: proximoMesStr })
      .andWhere("lote.status IN (:...status)", {
        status: [
          Status.APROVADO,
          Status.APROVADO_RESTRICAO,
          Status.REPROVADO,
        ],
      })
      .getCount();

    const aprovadosMes = await this.loteRepository
      .createQueryBuilder("lote")
      .where("lote.data_producao >= :inicioMes", { inicioMes: inicioMesStr })
      .andWhere("lote.data_producao < :proximoMes", { proximoMes: proximoMesStr })
      .andWhere("lote.status = :status", {
        status: Status.APROVADO,
      })
      .getCount();

    const taxaAprovacaoMes =
      totalInspecionadosMes > 0
        ? Number(((aprovadosMes / totalInspecionadosMes) * 100).toFixed(2))
        : 0;

    const lotesAguardandoInspecao = await this.loteRepository.count({
      where: {
        status: Status.AGUARDANDO_INSPECAO,
      },
    });

    const ultimosLotes = await this.loteRepository.find({
      relations: {
        produto: true,
        operador: true,
      },
      order: {
        id: "DESC",
      },
      take: 10,
    });

    return {
      indicadores: {
        lotesProduzidosHoje,
        unidadesProduzidasHoje,
        taxaAprovacaoMes,
        lotesAguardandoInspecao,
      },
      ultimosLotes: ultimosLotes.map((lote) => ({
        id: lote.id,
        numeroLote: lote.numeroLote,
        dataProducao: lote.dataProducao,
        status: lote.status,
        produto: {
          id: lote.produto.id,
          nome: lote.produto.nome,
          codigo: lote.produto.codigo,
        },
        operador: {
          id: lote.operador.id,
          nome: lote.operador.nome,
          email: lote.operador.email,
        },
      })),
    };
  }
}
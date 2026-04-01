import { appDataSource } from "../database/appDataSource";
import { CreateInspecaoDTO } from "../dtos/CreateInspecaoDTO";
import { InspecaoLote } from "../entities/InspecaoLote";
import { Lote } from "../entities/Lote";
import { Usuario } from "../entities/Usuario";
import { Perfil } from "../types/Perfil";
import { ResultadoInspecao } from "../types/ResultadoInspecao";
import { Status } from "../types/Status";

export class InspecaoService {
  private inspecaoRepository = appDataSource.getRepository(InspecaoLote);
  private loteRepository = appDataSource.getRepository(Lote);
  private usuarioRepository = appDataSource.getRepository(Usuario);

  async create(data: CreateInspecaoDTO) {
    const lote = await this.loteRepository.findOne({
      where: { id: data.loteId },
      relations: {
        inspecao: true,
      },
    });

    if (!lote) {
      throw new Error("Lote não encontrado.");
    }

    if (lote.inspecao) {
      throw new Error("Este lote já possui inspeção registrada.");
    }

    if (lote.status !== Status.AGUARDANDO_INSPECAO) {
      throw new Error("Somente lotes aguardando inspeção podem ser inspecionados.");
    }

    const inspetor = await this.usuarioRepository.findOne({
      where: { id: data.inspetorId },
    });

    if (!inspetor) {
      throw new Error("Inspetor não encontrado.");
    }

    if (![Perfil.INSPETOR, Perfil.GESTOR].includes(inspetor.perfil)) {
      throw new Error("Usuário sem permissão para registrar inspeção.");
    }

    const resultadoValido = Object.values(ResultadoInspecao).includes(
      data.resultado as ResultadoInspecao
    );

    if (!resultadoValido) {
      throw new Error("Resultado de inspeção inválido.");
    }

    const quantidadeRepr = Number(data.quantidadeRepr ?? 0);

    if (quantidadeRepr < 0) {
      throw new Error("A quantidade reprovada não pode ser negativa.");
    }

    if (
      data.resultado !== ResultadoInspecao.APROVADO &&
      !data.descricaoDesvio?.trim()
    ) {
      throw new Error(
        "A descrição do desvio é obrigatória quando a inspeção não for aprovada."
      );
    }

    const inspecao = this.inspecaoRepository.create({
      lote,
      inspetor,
      resultado: data.resultado as ResultadoInspecao,
      quantidadeRepr,
      descricaoDesvio: data.descricaoDesvio?.trim() || null,
    });

    const inspecaoSalva = await this.inspecaoRepository.save(inspecao);

    if (data.resultado === ResultadoInspecao.APROVADO) {
      lote.status = Status.APROVADO;
    }

    if (data.resultado === ResultadoInspecao.APROVADO_RESTRICAO) {
      lote.status = Status.APROVADO_RESTRICAO;
    }

    if (data.resultado === ResultadoInspecao.REPROVADO) {
      lote.status = Status.REPROVADO;
    }

    lote.quantidadeRepr = quantidadeRepr;

    await this.loteRepository.save(lote);

    return inspecaoSalva;
  }
}
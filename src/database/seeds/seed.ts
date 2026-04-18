import "dotenv/config";
import "reflect-metadata";
import bcrypt from "bcryptjs";
import { appDataSource } from "../appDataSource";

import { Usuario } from "../../entities/Usuario";
import { Produto } from "../../entities/Produto";
import { Lote } from "../../entities/Lote";

import { Perfil } from "../../types/Perfil";
import { Turno } from "../../types/Turno";
import { Status } from "../../types/Status";

async function runSeed() {
  await appDataSource.initialize();

  const usuarioRepository = appDataSource.getRepository(Usuario);
  const produtoRepository = appDataSource.getRepository(Produto);
  const loteRepository = appDataSource.getRepository(Lote);

  const usuariosCount = await usuarioRepository.count();
  const produtosCount = await produtoRepository.count();
  const lotesCount = await loteRepository.count();

  if (usuariosCount > 0 || produtosCount > 0 || lotesCount > 0) {
    console.log("Seed não executado: já existem dados no banco.");
    await appDataSource.destroy();
    return;
  }

  const senhaHash = await bcrypt.hash("123456", 10);

  const operador = usuarioRepository.create({
    nome: "Operador Teste",
    email: "operador@iande.com",
    senha: senhaHash,
    perfil: Perfil.OPERADOR,
    ativo: true,
  });

  const inspetor = usuarioRepository.create({
    nome: "Inspetor Teste",
    email: "inspetor@iande.com",
    senha: senhaHash,
    perfil: Perfil.INSPETOR,
    ativo: true,
  });

  const gestor = usuarioRepository.create({
    nome: "Gestor Teste",
    email: "gestor@iande.com",
    senha: senhaHash,
    perfil: Perfil.GESTOR,
    ativo: true,
  });

  await usuarioRepository.save([operador, inspetor, gestor]);

  const produto1 = produtoRepository.create({
    codigo: "PRD-001",
    nome: "Placa Eletrônica A",
    descricao: "Placa eletrônica para módulo industrial",
    linha: "Linha SMT 01",
    ativo: true,
  });

  const produto2 = produtoRepository.create({
    codigo: "PRD-002",
    nome: "Sensor Inteligente B",
    descricao: "Sensor de monitoramento industrial",
    linha: "Linha Montagem 02",
    ativo: true,
  });

  const produto3 = produtoRepository.create({
    codigo: "PRD-003",
    nome: "Módulo de Controle C",
    descricao: "Módulo de controle automatizado",
    linha: "Linha Final 03",
    ativo: true,
  });

  await produtoRepository.save([produto1, produto2, produto3]);

  const lotes = loteRepository.create([
    {
      numeroLote: "LOT-2026-00001",
      produto: produto1,
      dataProducao: "2026-03-31",
      turno: Turno.MANHA,
      operador,
      linha: "Linha SMT 01",
      quantidadeProd: 500,
      quantidadeRepr: 0,
      status: Status.EM_PRODUCAO,
      observacoes: "Lote iniciado normalmente",
      encerradoEm: null,
    },
    {
      numeroLote: "LOT-2026-00002",
      produto: produto2,
      dataProducao: "2026-03-31",
      turno: Turno.TARDE,
      operador,
      linha: "Linha Montagem 02",
      quantidadeProd: 300,
      quantidadeRepr: 0,
      status: Status.AGUARDANDO_INSPECAO,
      observacoes: "Aguardando inspeção final",
      encerradoEm: new Date(),
    },
    {
      numeroLote: "LOT-2026-00003",
      produto: produto3,
      dataProducao: "2026-03-30",
      turno: Turno.NOITE,
      operador,
      linha: "Linha Final 03",
      quantidadeProd: 250,
      quantidadeRepr: 5,
      status: Status.APROVADO,
      observacoes: "Lote aprovado sem restrições",
      encerradoEm: new Date(),
    },
    {
      numeroLote: "LOT-2026-00004",
      produto: produto1,
      dataProducao: "2026-03-29",
      turno: Turno.MANHA,
      operador,
      linha: "Linha SMT 01",
      quantidadeProd: 450,
      quantidadeRepr: 12,
      status: Status.APROVADO_RESTRICAO,
      observacoes: "Aprovado com pequenas restrições",
      encerradoEm: new Date(),
    },
    {
      numeroLote: "LOT-2026-00005",
      produto: produto2,
      dataProducao: "2026-03-28",
      turno: Turno.TARDE,
      operador,
      linha: "Linha Montagem 02",
      quantidadeProd: 600,
      quantidadeRepr: 40,
      status: Status.REPROVADO,
      observacoes: "Falha detectada na inspeção",
      encerradoEm: new Date(),
    },
  ]);

  await loteRepository.save(lotes);

  console.log("Seed executado com sucesso.");
  console.log("Usuários criados:");
  console.log("operador@iande.com / 123456");
  console.log("inspetor@iande.com / 123456");
  console.log("gestor@iande.com / 123456");

  await appDataSource.destroy();
}

runSeed().catch(async (error) => {
  console.error("Erro ao executar seed:", error);

  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
});

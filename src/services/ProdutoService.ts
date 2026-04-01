import { appDataSource } from "../database/appDataSource";
import { Produto } from "../entities/Produto";
import { CreateProdutoDTO } from "../dtos/CreateProdutoDTO";
import { UpdateProdutoDTO } from "../dtos/UpdateProdutoDTO";
import { AppError } from "../errors/AppError";

export class ProdutoService {
  private produtoRepository = appDataSource.getRepository(Produto);

  async create(data: CreateProdutoDTO) {
    const produtoExistente = await this.produtoRepository.findOne({
      where: { codigo: data.codigo },
    });

    if (produtoExistente) {
      throw new AppError("Já existe um produto com este código.", 404);
    }

    const produto = this.produtoRepository.create({
      codigo: data.codigo,
      nome: data.nome,
      descricao: data.descricao ?? null,
      linha: data.linha,
      ativo: true,
    });

    return await this.produtoRepository.save(produto);
  }

  async list() {
    return await this.produtoRepository.find({
      order: { id: "ASC" },
    });
  }

  async findById(id: number) {
    const produto = await this.produtoRepository.findOne({
      where: { id },
    });

    if (!produto) {
      throw new Error("Produto não encontrado.");
    }

    return produto;
  }

  async update(id: number, data: UpdateProdutoDTO) {
    const produto = await this.produtoRepository.findOne({
      where: { id },
    });

    if (!produto) {
      throw new Error("Produto não encontrado.");
    }

    if (data.codigo && data.codigo !== produto.codigo) {
      const codigoEmUso = await this.produtoRepository.findOne({
        where: { codigo: data.codigo },
      });

      if (codigoEmUso) {
        throw new AppError("Já existe um produto com este código.", 409);
      }
    }

    produto.codigo = data.codigo ?? produto.codigo;
    produto.nome = data.nome ?? produto.nome;
    produto.descricao =
      data.descricao !== undefined ? data.descricao : produto.descricao;
    produto.linha = data.linha ?? produto.linha;
    produto.ativo = data.ativo ?? produto.ativo;

    return await this.produtoRepository.save(produto);
  }

  async inativar(id: number) {
    const produto = await this.produtoRepository.findOne({
      where: { id },
    });

    if (!produto) {
      throw new AppError("Produto não encontrado.", 404);
    }

    produto.ativo = false;

    return await this.produtoRepository.save(produto);
  }
}
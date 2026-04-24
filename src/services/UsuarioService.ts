import bcrypt from "bcryptjs";
import { appDataSource } from "../database/appDataSource";
import { Usuario } from "../entities/Usuario";
import { Perfil } from "../types/Perfil";
import { AppError } from "../errors/AppError";

interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

interface UpdateUsuarioDTO {
  nome?: string;
  email?: string;
  senha?: string;
  perfil?: Perfil;
}

export class UsuarioService {
  private repo = appDataSource.getRepository(Usuario);

  async list() {
    const usuarios = await this.repo.find({
      order: { createdAt: "ASC" },
    });
    return usuarios.map((u) => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      perfil: u.perfil,
      ativo: u.ativo,
      createdAt: u.createdAt,
    }));
  }

  async create({ nome, email, senha, perfil }: CreateUsuarioDTO) {
    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new AppError("E-mail já cadastrado.", 409);

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = this.repo.create({ nome, email, senha: senhaHash, perfil });
    await this.repo.save(usuario);

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };
  }

  async update(id: number, dto: UpdateUsuarioDTO) {
    const usuario = await this.repo.findOne({ where: { id } });
    if (!usuario) throw new AppError("Usuário não encontrado.", 404);

    if (dto.email && dto.email !== usuario.email) {
      const existing = await this.repo.findOne({ where: { email: dto.email } });
      if (existing) throw new AppError("E-mail já cadastrado.", 409);
    }

    if (dto.nome)   usuario.nome   = dto.nome;
    if (dto.email)  usuario.email  = dto.email;
    if (dto.perfil) usuario.perfil = dto.perfil;
    if (dto.senha)  usuario.senha  = await bcrypt.hash(dto.senha, 10);

    await this.repo.save(usuario);

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
    };
  }

  async remove(id: number) {
    const usuario = await this.repo.findOne({ where: { id } });
    if (!usuario) throw new AppError("Usuário não encontrado.", 404);
    await this.repo.remove(usuario);
    return { message: "Usuário removido com sucesso." };
  }
}

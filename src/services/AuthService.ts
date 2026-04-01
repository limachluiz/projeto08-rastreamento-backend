import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appDataSource } from "../database/appDataSource";
import { Usuario } from "../entities/Usuario";
import { LoginDTO } from "../dtos/LoginDTO";

export class AuthService {
  private usuarioRepository = appDataSource.getRepository(Usuario);

  async login({ email, senha }: LoginDTO) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const accessToken = jwt.sign(
      {
        sub: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      accessToken,
    };
  }
}
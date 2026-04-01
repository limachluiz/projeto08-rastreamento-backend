import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appDataSource } from "../database/appDataSource";
import { Usuario } from "../entities/Usuario";
import { LoginDTO } from "../dtos/LoginDTO";
import { AppError } from "../errors/AppError";

export class AuthService {
  private usuarioRepository = appDataSource.getRepository(Usuario);

  async login({ email, senha }: LoginDTO) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new AppError("E-mail ou senha inválidos.", 400);
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new AppError("E-mail ou senha inválidos.", 400);
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
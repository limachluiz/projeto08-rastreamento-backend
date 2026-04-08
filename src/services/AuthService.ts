import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appDataSource } from "../database/appDataSource";
import { Usuario } from "../entities/Usuario";
import { LoginDTO } from "../dtos/LoginDTO";

interface TokenPayload {
  sub: string;
  email?: string;
  perfil?: string;
  type: "access" | "refresh";
}

export class AuthService {
  private usuarioRepository = appDataSource.getRepository(Usuario);

  private generateAccessToken(usuario: Usuario) {
    return jwt.sign(
      {
        email: usuario.email,
        perfil: usuario.perfil,
        type: "access",
      },
      process.env.JWT_ACCESS_SECRET as string,
      {
        subject: String(usuario.id),
        expiresIn: "15m",
      }
    );
  }

  private generateRefreshToken(usuario: Usuario) {
    return jwt.sign(
      {
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET as string,
      {
        subject: String(usuario.id),
        expiresIn: "7d",
      }
    );
  }

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

    const accessToken = this.generateAccessToken(usuario);
    const refreshToken = this.generateRefreshToken(usuario);

    usuario.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usuarioRepository.save(usuario);

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token é obrigatório.");
    }

    let decoded: TokenPayload;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as TokenPayload;
    } catch {
      throw new Error("Refresh token inválido ou expirado.");
    }

    if (decoded.type !== "refresh") {
      throw new Error("Tipo de token inválido.");
    }

    const usuarioId = Number(decoded.sub);

    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario || !usuario.refreshTokenHash) {
      throw new Error("Sessão inválida.");
    }

    const refreshTokenValido = await bcrypt.compare(
      refreshToken,
      usuario.refreshTokenHash
    );

    if (!refreshTokenValido) {
      throw new Error("Refresh token inválido.");
    }

    const novoAccessToken = this.generateAccessToken(usuario);
    const novoRefreshToken = this.generateRefreshToken(usuario);

    usuario.refreshTokenHash = await bcrypt.hash(novoRefreshToken, 10);
    await this.usuarioRepository.save(usuario);

    return {
      accessToken: novoAccessToken,
      refreshToken: novoRefreshToken,
    };
  }

  async logout(usuarioId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    usuario.refreshTokenHash = null;
    await this.usuarioRepository.save(usuario);

    return {
      message: "Logout realizado com sucesso.",
    };
  }
}
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Perfil } from "../types/Perfil";

interface TokenPayload {
  sub: string;
  email: string;
  perfil: Perfil;
  type: "access" | "refresh";
}

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token não informado.",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return response.status(401).json({
      message: "Token inválido.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as TokenPayload;

    if (decoded.type !== "access") {
      return response.status(401).json({
        message: "Tipo de token inválido.",
      });
    }

    request.user = {
      id: Number(decoded.sub),
      email: decoded.email,
      perfil: decoded.perfil,
    };

    return next();
  } catch {
    return response.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}
import { Perfil } from "./Perfil";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        perfil: Perfil;
      };
    }
  }
}

export {};
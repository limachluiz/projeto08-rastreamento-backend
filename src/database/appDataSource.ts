import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

import { Usuario } from "../entities/Usuario";
import { Produto } from "../entities/Produto";
import { Lote } from "../entities/Lote";
import { InsumoLote } from "../entities/InsumoLote";
import { InspecaoLote } from "../entities/InspecaoLote";

export const appDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "postgres",
  database: process.env.DB_NAME ?? "indt_lote_pim",
  synchronize: true,
  logging: false,
  entities: [Usuario, Produto, Lote, InsumoLote, InspecaoLote],
  migrations: [],
  subscribers: [],
});
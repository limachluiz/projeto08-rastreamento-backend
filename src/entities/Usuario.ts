import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Perfil } from "../types/Perfil";
import { Lote } from "./Lote";
import { InspecaoLote } from "./InspecaoLote";

@Entity("usuario")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  nome!: string;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  senha!: string;

  @Column({
    type: "enum",
    enum: Perfil,
    default: Perfil.OPERADOR,
  })
  perfil!: Perfil;

  @Column({ type: "boolean", default: true })
  ativo!: boolean;

  @Column({ name: "refresh_token_hash", type: "text", nullable: true })
  refreshTokenHash!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => Lote, (lote) => lote.operador)
  lotesOperados!: Lote[];

  @OneToMany(() => InspecaoLote, (inspecao) => inspecao.inspetor)
  inspecoesRealizadas!: InspecaoLote[];
}
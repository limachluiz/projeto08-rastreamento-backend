import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ResultadoInspecao } from "../types/ResultadoInspecao";
import { Lote } from "./Lote";
import { Usuario } from "./Usuario";

@Entity("inspecao_lote")
export class InspecaoLote {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Lote, (lote) => lote.inspecao, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lote_id" })
  lote!: Lote;

  @ManyToOne(() => Usuario, (usuario) => usuario.inspecoesRealizadas, {
    nullable: false,
  })
  @JoinColumn({ name: "inspetor_id" })
  inspetor!: Usuario;

  @Column({
    type: "enum",
    enum: ResultadoInspecao,
  })
  resultado!: ResultadoInspecao;

  @Column({ name: "quantidade_repr", type: "integer", default: 0 })
  quantidadeRepr!: number;

  @Column({ name: "descricao_desvio", type: "text", nullable: true })
  descricaoDesvio!: string | null;

  @CreateDateColumn({ name: "inspecionado_em", type: "timestamptz" })
  inspecionadoEm!: Date;
}
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lote } from "./Lote";

@Entity("insumo_lote")
export class InsumoLote {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Lote, (lote) => lote.insumos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lote_id" })
  lote!: Lote;

  @Column({ name: "nome_insumo", type: "text" })
  nomeInsumo!: string;

  @Column({ name: "codigo_insumo", type: "text", nullable: true })
  codigoInsumo!: string | null;

  @Column({ name: "lote_insumo", type: "text", nullable: true })
  loteInsumo!: string | null;

  @Column({
    type: "numeric",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  quantidade!: number;

  @Column({ type: "text" })
  unidade!: string;
}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lote } from "./Lote";

@Entity("produto")
export class Produto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  codigo!: string;

  @Column({ type: "text" })
  nome!: string;

  @Column({ type: "text", nullable: true })
  descricao!: string | null;

  @Column({ type: "text" })
  linha!: string;

  @Column({ type: "boolean", default: true })
  ativo!: boolean;

  @OneToMany(() => Lote, (lote) => lote.produto)
  lotes!: Lote[];
}
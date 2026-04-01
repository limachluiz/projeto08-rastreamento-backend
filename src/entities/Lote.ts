import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Produto } from "./Produto";
import { Usuario } from "./Usuario";
import { Turno } from "../types/Turno";
import { Status } from "../types/Status";
import { InsumoLote } from "./InsumoLote";
import { InspecaoLote } from "./InspecaoLote";

@Entity("lote")
export class Lote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "numero_lote", type: "text", unique: true })
  numeroLote!: string;

  @ManyToOne(() => Produto, (produto) => produto.lotes, { nullable: false })
  @JoinColumn({ name: "produto_id" })
  produto!: Produto;

  @Column({ name: "data_producao", type: "date" })
  dataProducao!: string;

  @Column({
    type: "enum",
    enum: Turno,
  })
  turno!: Turno;

  @ManyToOne(() => Usuario, (usuario) => usuario.lotesOperados, { nullable: false })
  @JoinColumn({ name: "operador_id" })
  operador!: Usuario;

  @Column({ type: "text" })
  linha!: string;

  @Column({ name: "quantidade_prod", type: "integer" })
  quantidadeProd!: number;

  @Column({ name: "quantidade_repr", type: "integer", default: 0 })
  quantidadeRepr!: number;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.EM_PRODUCAO,
  })
  status!: Status;

  @Column({ type: "text", nullable: true })
  observacoes!: string | null;

  @CreateDateColumn({ name: "aberto_em", type: "timestamptz" })
  abertoEm!: Date;

  @Column({ name: "encerrado_em", type: "timestamptz", nullable: true })
  encerradoEm!: Date | null;

  @OneToMany(() => InsumoLote, (insumo) => insumo.lote)
  insumos!: InsumoLote[];

  @OneToOne(() => InspecaoLote, (inspecao) => inspecao.lote)
  inspecao!: InspecaoLote;
}
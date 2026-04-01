export interface CreateLoteDTO {
  produtoId: number;
  dataProducao: string;
  turno: "manha" | "tarde" | "noite";
  operadorId: number;
  linha: string;
  quantidadeProd: number;
  observacoes?: string | null;
}
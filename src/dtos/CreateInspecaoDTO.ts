export interface CreateInspecaoDTO {
  loteId: number;
  inspetorId: number;
  resultado: "aprovado" | "aprovado_restricao" | "reprovado";
  quantidadeRepr?: number;
  descricaoDesvio?: string | null;
}
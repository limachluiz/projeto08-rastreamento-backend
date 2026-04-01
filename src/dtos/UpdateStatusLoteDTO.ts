export interface UpdateStatusLoteDTO {
  status: "em_producao" | "aguardando_inspecao" | "aprovado" | "aprovado_restricao" | "reprovado";
}
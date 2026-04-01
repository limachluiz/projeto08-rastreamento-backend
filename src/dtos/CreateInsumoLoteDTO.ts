export interface CreateInsumoLoteDTO {
  loteId: number;
  nomeInsumo: string;
  codigoInsumo?: string | null;
  loteInsumo?: string | null;
  quantidade: number;
  unidade: string;
}
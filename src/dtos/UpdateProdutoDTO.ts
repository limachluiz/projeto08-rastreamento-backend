export interface UpdateProdutoDTO {
  codigo?: string;
  nome?: string;
  descricao?: string | null;
  linha?: string;
  ativo?: boolean;
}
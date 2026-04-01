export interface CreateProdutoDTO {
  codigo: string;
  nome: string;
  descricao?: string | null;
  linha: string;
}
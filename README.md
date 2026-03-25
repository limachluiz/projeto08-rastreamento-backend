# 📦 LotePIM - Backend (Projeto 08)

## 💻 Sobre o Projeto
[cite_start]O LotePIM é um sistema web para registro e rastreamento de lotes de produção industrial[cite: 122]. [cite_start]Ele foi concebido com foco nas demandas do Polo Industrial de Manaus, onde a rastreabilidade é uma exigência legal e contratual[cite: 7, 120]. 

[cite_start]Este repositório contém a API backend responsável por digitalizar o processo de produção: registro de cada lote com data, turno, operador e quantidade[cite: 11]. [cite_start]O grande valor do sistema é permitir a consulta de rastreabilidade rápida em casos de recall, evitando o descarte desnecessário de lotes inteiros[cite: 9, 10, 125].

## 🛠️ Stack Tecnológica
De acordo com o escopo do projeto, a fundação técnica utiliza:
* [cite_start]**Linguagem / Runtime:** Node.js 22[cite: 121].
* [cite_start]**Framework:** Express[cite: 17, 90].
* [cite_start]**Banco de Dados:** PostgreSQL[cite: 17, 91].
* [cite_start]**Autenticação:** JSON Web Token (JWT)[cite: 97, 140].

## 🚀 Funcionalidades Principais
* [cite_start]**Autenticação de Usuários:** Autenticação por e-mail e senha com geração de token JWT contendo ID e perfil do usuário[cite: 140].
* [cite_start]**Gestão de Lotes:** Abertura de lotes com geração automática de um número único (ex: LOT-2025-00001)[cite: 140].
* [cite_start]**Controle de Insumos:** Funcionalidade que permite vincular múltiplos insumos a um lote específico, informando nome, código, lote do insumo e quantidade[cite: 140].
* [cite_start]**Inspeção de Qualidade:** Endpoints para registrar o resultado da inspeção de um lote, o que atualiza automaticamente o seu status (em_producao, aguardando_inspecao, aprovado, aprovado_restricao, reprovado)[cite: 140, 148].
* [cite_start]**Motor de Rastreabilidade:** Consultas completas de rastreabilidade, permitindo buscar um lote para ver seus insumos ou fazer a rastreabilidade reversa (buscar um insumo e listar todos os lotes que o utilizaram)[cite: 140].

## 🗄️ Estrutura de Banco de Dados
[cite_start]O sistema é construído sobre quatro entidades principais[cite: 32]:
* [cite_start]**produto:** Representa o item que é fabricado na linha de produção[cite: 32, 36].
* [cite_start]**lote:** Representa a unidade de produção rastreável, gerada em uma sessão contínua[cite: 33, 41].
* [cite_start]**insumo_lote:** Entidade central para a rastreabilidade, vinculando os insumos utilizados a um lote específico[cite: 33, 44, 45].
* **inspecao:** Registra o resultado de qualidade e define o status final do lote[cite: 34, 49, 50].

## 🏁 Pré-requisitos e Execução
* [cite_start]Node.js v22 instalado localmente[cite: 121].
* [cite_start]PostgreSQL rodando localmente ou via container[cite: 17].

```bash
# Clone o repositório
$ git clone [https://github.com/SEU_USUARIO/projeto08-backend.git](https://github.com/SEU_USUARIO/projeto08-backend.git)

# Instale as dependências
$ npm install

# Configure as variáveis de ambiente baseadas no .env.example
# [cite_start]As variáveis sensíveis devem ficar no .env, fora do controle de versão[cite: 143].

# [cite_start]Execute as migrations/seed do banco (3 produtos, 2 usuários, 5 lotes) [cite: 91]
$ npm run seed # (exemplo de script)

# Inicie o servidor
[cite_start]$ node server.js # [cite: 93]

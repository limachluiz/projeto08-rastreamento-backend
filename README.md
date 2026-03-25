# INDT - Rastreamento de Produção por
# 📦 LotePIM - Backend (Projeto 08)

## 💻 Sobre o Projeto
O LotePIM é um sistema web para registro e rastreamento de lotes de produção industrial. Ele foi concebido com foco nas demandas do Polo Industrial de Manaus, onde a rastreabilidade é uma exigência legal e contratual. 

Este repositório contém a API backend responsável por digitalizar o processo de produção: registro de cada lote com data, turno, operador e quantidade. O grande valor do sistema é permitir a consulta de rastreabilidade rápida em casos de recall, evitando o descarte desnecessário de lotes inteiros.

## 🛠️ Stack Tecnológica
* **Linguagem / Runtime:** Node.js 22
* **Framework:** Express
* **Banco de Dados:** PostgreSQL
* **Autenticação:** JSON Web Token (JWT)

## 🚀 Funcionalidades Principais
* **Autenticação de Usuários:** Login por e-mail e senha com geração de token JWT.
* **Gestão de Lotes:** Abertura e encerramento de lotes com geração automática de numeração (ex: LOT-2025-00001).
* **Controle de Insumos:** Vínculo de múltiplos insumos a um lote específico, registrando nome, código e quantidade.
* **Inspeção de Qualidade:** Registro do resultado da inspeção, atualizando o status do lote automaticamente (aprovado, reprovado, etc.).
* **Rastreabilidade (Track & Trace):** Consultas detalhadas para listar os insumos de um lote ou realizar a busca reversa (quais lotes usaram determinado insumo).

## 🗄️ Entidades do Banco de Dados
O sistema gerencia quatro entidades principais:
* **produto:** O item fabricado na linha de produção.
* **lote:** A unidade de produção rastreável.
* **insumo_lote:** A tabela que vincula os insumos utilizados a um lote específico.
* **inspecao_lote:** O registro do resultado de qualidade que define o status final do lote.

## 🏁 Como Rodar a Aplicação

Pré-requisitos: Node.js v22 e PostgreSQL instalados.

```bash
# Clone o repositório
$ git clone [https://github.com/SEU_USUARIO/projeto08-backend.git](https://github.com/SEU_USUARIO/projeto08-backend.git)
$ cd projeto08-backend

# Instale as dependências
$ npm install

# Configure as variáveis de ambiente baseadas no arquivo de exemplo
$ cp .env.example .env

# Execute a criação do banco e o seed inicial (3 produtos, 2 usuários, 5 lotes)
$ npm run seed

# Inicie o servidor
$ npm run dev

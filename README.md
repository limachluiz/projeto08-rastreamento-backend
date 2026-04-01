# INDT - Rastreamento de Produção por Lote

# 📦 LotePIM - Backend (Projeto 08)

## 💻 Sobre o Projeto

O **LotePIM** é um sistema web para **registro e rastreamento de lotes de produção industrial**, desenvolvido com foco nas demandas do **Polo Industrial de Manaus**, onde a rastreabilidade é uma exigência legal e contratual.

Este repositório contém a **API backend** responsável por digitalizar o processo produtivo, permitindo:

- autenticação de usuários
- cadastro e gestão de produtos
- abertura e acompanhamento de lotes
- vínculo de insumos por lote
- registro de inspeção de qualidade
- consulta de rastreabilidade por lote e por insumo
- visualização de indicadores de produção via dashboard

O principal valor do sistema é permitir uma **resposta rápida em cenários de recall**, evitando o descarte desnecessário de lotes inteiros e melhorando o controle de qualidade.

---

## 🛠️ Stack Tecnológica

- **Node.js 22**
- **TypeScript**
- **Express**
- **PostgreSQL**
- **TypeORM**
- **JWT**
- **bcryptjs**
- **Docker**
- **pgAdmin**

---

## 🚀 Funcionalidades Implementadas

### Autenticação
- login com e-mail e senha
- geração de token JWT
- rota protegida para usuário autenticado
- middleware de autenticação

### Produtos
- cadastro de produtos
- listagem de produtos
- busca de produto por ID
- atualização de produto
- inativação e reativação lógica via campo `ativo`

### Lotes
- abertura de lote
- geração automática do número do lote no padrão `LOT-ANO-SEQUENCIA`
- listagem de lotes
- filtros por:
  - produto
  - status
  - período
  - número do lote
- detalhamento de lote
- transição de status com validação de fluxo

### Insumos do Lote
- vínculo de múltiplos insumos a um lote
- listagem de insumos por lote
- remoção de insumos enquanto o lote estiver em produção

### Inspeção
- registro de inspeção por lote
- validação de apenas uma inspeção por lote
- atualização automática do status final do lote
- obrigatoriedade de descrição de desvio quando o resultado não for aprovado

### Dashboard
- lotes produzidos no dia
- unidades produzidas no dia
- taxa de aprovação do mês
- lotes aguardando inspeção
- últimos 10 lotes registrados

### Rastreabilidade
- consulta por número de lote
- consulta reversa por insumo
- exibição de lote, insumos e inspeção

---

## 🗄️ Entidades do Banco de Dados

O sistema utiliza as seguintes entidades principais:

- **usuario** → usuários do sistema com autenticação e perfil
- **produto** → item fabricado na linha de produção
- **lote** → unidade de produção rastreável
- **insumo_lote** → vínculo entre insumos utilizados e o lote
- **inspecao_lote** → resultado da inspeção de qualidade do lote

---

## 📁 Estrutura do Projeto

```bash
src/
├── controllers/
├── database/
│   └── seeds/
├── dtos/
├── entities/
├── errors/
├── middlewares/
├── routes/
├── services/
├── types/
└── server.ts

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

#Suba os containers do banco e do pgAdmin
$ docker compose --env-file .env up -d

#Para verificar se os containers estão rodando:
$docker ps

#Acesse o pgAdmin
$ http://localhost:8080
$ Use as credenciais configuradas no .env:
$
$ Email: valor de PGADMIN_EMAIL
$ Senha: valor de PGADMIN_PASSWORD

# Inicie o servidor
$ npm run dev

# Execute a criação do banco e o seed inicial (3 produtos, 2 usuários, 5 lotes)
$ npm run seed

#Usuários de teste
#e-mail: operador@lotepim.com
#senha: 123456
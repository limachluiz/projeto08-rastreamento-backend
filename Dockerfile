# ===== Etapa 1: build =====
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compila TypeScript
RUN npm run build


# ===== Etapa 2: produção =====
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copia só o necessário da build
COPY --from=builder /app/dist ./dist

# Porta do seu backend
EXPOSE 3000

# Comando de produção
CMD ["npm", "start"]
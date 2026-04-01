import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { appDataSource } from './database/appDataSource.js';
import { routes } from './routes/index.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// Rota de teste para confirmar que o servidor está funcionando
app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "API do LotePIM rodando",
    timestamp: new Date().toISOString(),
  });
});

app.use(routes);

appDataSource
  .initialize()
  .then(() => {
    console.log("Banco conectado com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar o banco:", error);
  });
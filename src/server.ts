import "dotenv/config";
import express from "express";
import { appDataSource } from "./database/appDataSource";
import { routes } from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "API do LotePIM rodando",
    timestamp: new Date().toISOString(),
  });
});

app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

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
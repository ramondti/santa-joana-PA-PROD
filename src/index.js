import express from "express";
import cron from "node-cron";
import { getSantaJoana } from "./modules/sumarioPa/routes/index";
const app = express();

app.use(express.json({ limit: "1000mb" }));

cron.schedule("* * * * *", async () => {
  console.log("### PA PROD ### Executando a tarefa a cada 1 minuto");
  const json = await getSantaJoana();
  console.res.json(json);
});

app.get("/santa-joana", async (req, res) => {
  const json = await getSantaJoana();
  return res.json(json);
});

app.listen(3030, (err, data) => {
  console.log(" ### PA PROD ### Ouvindo na porta 3030");
});

export default app;

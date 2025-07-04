const express = require("express");
const cors = require("cors");
const db = require("./database");

const verifyToken = require('./authMiddleware');

const authRoutes = require("./routes/auth.js");
const projectRoutes = require("./routes/project.js");
const teamRoutes = require("./routes/team.js");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(cors());
app.use(express.json());

// Rota principal de boas-vindas
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo à API do Ocelot!" });
});

// =========== ROTAS  ===========

app.use("/auth", authRoutes);
app.use("/project", projectRoutes);
app.use("/team", teamRoutes);

// Rota de exemplo para buscar todos os usuários
app.get("/users", async (req, res) => {
  try {
    // Executa a query para selecionar todos os usuários
    const { rows } = await db.query(
      'SELECT id, username, name, email FROM "USER"',
    );
    // Envia os resultados como resposta JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Inicia o servidor para escutar na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

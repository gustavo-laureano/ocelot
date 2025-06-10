
// Importa o framework Express
const express = require('express');
// Importa o 'cors' para permitir requisições de diferentes origens (ex: seu frontend)
const cors = require('cors');
// Importa a configuração do banco de dados
const db = require('./database');

// Inicializa a aplicação Express
const app = express();
// Define a porta do servidor, usando a variável de ambiente ou 3000 como padrão
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota principal de boas-vindas
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Ocelot!' });
});

// =========== ROTAS DE EXEMPLO ===========
// Aqui você definirá suas rotas (endpoints) da API.

// Rota de exemplo para buscar todos os usuários
app.get('/users', async (req, res) => {
  try {
    // Executa a query para selecionar todos os usuários
    const { rows } = await db.query('SELECT id, username, name, email FROM "USER"');
    // Envia os resultados como resposta JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inicia o servidor para escutar na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


const { Pool } = require('pg');

// Importa a biblioteca 'dotenv' para carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

// Cria um novo 'Pool' de conexões. O Pool gerencia múltiplas conexões
// para que você não precise abrir e fechar conexões para cada query.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Testa a conexão ao executar uma query simples.
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL', err.stack);
  } else {
    console.log('Conexão com o PostgreSQL bem-sucedida. Conectado em:', res.rows[0].now);
  }
});

// Exporta um objeto com o método 'query' para ser usado em outras partes da aplicação.
module.exports = {
  query: (text, params) => pool.query(text, params),
};

// index.js (continuation)
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(express.json());

const port = process.env.PORT || 3000;

// Rota de exemplo
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

// Criar o CRUD para o recurso
app.get('/clans', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM clans');
      let retorno = { clans: result.rows, 
        "currentPage": 1,
        "pageSize": 20,
        "total": 58}
      res.json(retorno);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar famílias'});
    }
  });
  
  app.get('/clans/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM clans WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Família não encontrada' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar família' });
    }
  });
  
  app.post('/clans', async (req, res) => {
    const { name, characters } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO clans (name, characters) VALUES ($1, $2) RETURNING *',
        [name, characters]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar família' });
    }
  });
  
  app.put('/clans/:id', async (req, res) => {
    const { id } = req.params;
    const { name, characters } = req.body;
    try {
      const result = await pool.query(
        'UPDATE clans SET name = $1, characters = $2 WHERE id = $3 RETURNING *',
        [name, characters, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Família não encontrada' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar família' });
    }
  });
  
  app.delete('/clans/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM clans WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Família não encontrada' });
      }
      res.json({ message: 'Família deletada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar família' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
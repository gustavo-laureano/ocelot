const express = require('express');
const db = require('../database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create', async (req, res) => {
    const { username, name, password_hash, email, phone, photo_path, github_url, linkedin_url } = req.body;

    try {
        const newUser = await db.query(
            'INSERT INTO users (username, name, password_hash, email, phone, photo_path, github_url, linkedin_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [username, name, password_hash, email, phone, photo_path, github_url, linkedin_url]
        );
        res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser.rows[0] });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/list', async (req, res) => {
    const { teamId } = req.query;

    if (!teamId) {
        return res.status(400).json({ message: 'O parâmetro teamId é obrigatório.' });
    }
    try {
        const users = await db.query(
            `SELECT u.* FROM users u
             INNER JOIN user_teams ut ON u.id = ut.user_id
             WHERE ut.team_id = $1`,
            [teamId]
        );
        res.status(200).json({ users: users.rows });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/:teamId/users', async (req, res) => {
    const { teamId } = req.params;

    try {
        const users = await db.query(
            `SELECT u.* FROM users u
             INNER JOIN user_teams ut ON u.id = ut.user_id
             WHERE ut.team_id = $1`,
            [teamId]
        );
        res.status(200).json({ users: users.rows });
    } catch (error) {
        console.error('Erro ao listar usuários do time:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
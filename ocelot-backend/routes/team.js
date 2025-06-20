
const express = require('express');
const db = require('../database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create', async (req, res) => {
    const {name, description} = req.body;

  
    try {
       const newTeam = await db.query(
            'INSERT INTO "TEAM" (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json({ message: 'Time criado com sucesso', team: newTeam.rows[0] });

    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/list', async (req, res) => {
    const{userId} = req.query;

        if (!userId) {
        return res.status(400).json({ message: 'O parâmetro userId é obrigatório.' });
    }
    try {
        const teams = await db.query(
            'SELECT * FROM "TEAM" WHERE id IN (SELECT team_id FROM "USERS_TEAMS" WHERE user_id = $1)',
            [userId]
        );
        res.status(200).json({teams: teams.rows});

    } catch (error) {
        console.error('Erro ao listar times:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
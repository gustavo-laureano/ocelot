
const express = require('express');
const db = require('../database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create', async (req, res) => {
    const {team_id, owner_id, name, description, photo, start_date, real_end_date, status} = req.body;

  
    try {
       const newProject = await db.query(
            'INSERT INTO "PROJECT" (team_id, owner_id, name, description, photo, start_date, real_end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [team_id, owner_id, name, description, photo, start_date, real_end_date, status]
        );

        res.status(201).json({ message: 'Projeto criado com sucesso', user: newProject.rows[0] });
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
        const projects = await db.query(
            'SELECT * FROM "PROJECT" WHERE team_id IN (SELECT team_id FROM "USERS_TEAMS" WHERE user_id = $1)',
            [userId]
        );
        res.status(200).json({projects: projects.rows});

    } catch (error) {
        console.error('Erro ao listar projetos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});


module.exports = router;
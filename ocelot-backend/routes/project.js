const express = require('express');
const db = require('../database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create', async (req, res) => {
    const { team_id, owner_id, name, description, photo_path, start_date, real_end_date, status } = req.body;

    try {
        const newProject = await db.query(
            'INSERT INTO projects (team_id, owner_id, name, description, photo_path, start_date, real_end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [team_id, owner_id, name, description, photo_path, start_date, real_end_date, status]
        );
        res.status(201).json({ message: 'Projeto criado com sucesso', project: newProject.rows[0] });
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/list', async (req, res) => {
    const { userId, project_id } = req.query;

    if (!userId && !project_id) {
        return res.status(400).json({ message: 'O parâmetro userId ou project_id é obrigatório' });
    }

    if (userId) {
        try {
            const projects = await db.query(
                `SELECT p.*, STRING_AGG(u.name, ', ') AS team_members
                 FROM projects p
                 LEFT JOIN user_teams ut ON p.team_id = ut.team_id
                 LEFT JOIN users u ON ut.user_id = u.id
                 WHERE ut.user_id = $1
                 GROUP BY p.id`,
                [userId]
            );
            res.status(200).json({ projects: projects.rows });
        } catch (error) {
            console.error('Erro ao listar projetos:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
    if (project_id) {
        try {
            const projects = await db.query(
                `SELECT p.*, STRING_AGG(u.name, ', ') AS team_members
                 FROM projects p
                 LEFT JOIN user_teams ut ON p.team_id = ut.team_id
                 LEFT JOIN users u ON ut.user_id = u.id
                 WHERE p.id = $1
                 GROUP BY p.id`,
                [project_id]
            );
            res.status(200).json({ projects: projects.rows });
        } catch (error) {
            console.error('Erro ao listar projetos:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
});

router.delete('/delete', async (req, res) => {
    const { project_id } = req.query;
    if (!project_id) {
        return res.status(400).json({ message: 'O parâmetro project_id é obrigatório.' });
    }
    try {
        await db.query(
            'DELETE FROM projects WHERE id = $1',
            [project_id]
        );
        res.status(200).json({ message: 'Projeto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar projeto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
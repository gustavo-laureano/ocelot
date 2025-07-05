
const express = require('express');
const db = require('../database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create', async (req, res) => {
    const {team_id, owner_id, name, description, photo, start_date, real_end_date, status} = req.body;
    const base64String = photo;
    const bufferData = Buffer.from(base64String, 'base64');
  
    try {
       const newProject = await db.query(
            'INSERT INTO "PROJECT" (team_id, owner_id, name, description, photo, start_date, real_end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [team_id, owner_id, name, description, bufferData, start_date, real_end_date, status]
        );

        res.status(201).json({ message: 'Projeto criado com sucesso', user: newProject.rows[0] });
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/list', async (req, res) => {
    const { userId } = req.query;
    const { project_id } = req.query;

    if (!userId && !project_id) {
        return res.status(400).json({ message: 'O parâmetro userId ou team_id é obrigatório' });
    }

    if (userId) {
    try {
        const projects = await db.query(
            `SELECT
            P.*,
            STRING_AGG(U.name, ', ') AS team_members
        FROM
            "PROJECT" AS P
        LEFT JOIN
            "USERS_TEAMS" AS UT ON P.team_id = UT.team_id
        LEFT JOIN
            "USER" AS U ON UT.user_id = U.id
        GROUP BY
            P.id, P.name
        HAVING
            SUM(CASE WHEN U.id = $1 THEN 1 ELSE 0 END) > 0;`,[userId]
        );
        res.status(200).json({ projects: projects.rows });
    } catch (error) {
        console.error('Erro ao listar projetos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }}
    if(project_id){
    try {
        const projects = await db.query(
            `SELECT
            P.*,
            STRING_AGG(U.name, ', ') AS team_members
        FROM
            "PROJECT" AS P
        LEFT JOIN
            "USERS_TEAMS" AS UT ON P.team_id = UT.team_id
        LEFT JOIN
            "USER" AS U ON UT.user_id = U.id
        GROUP BY
            P.id, P.name
        HAVING
            SUM(CASE WHEN P.id = $1 THEN 1 ELSE 0 END) > 0;`,[project_id]
        );
        res.status(200).json({ projects: projects.rows });
    } catch (error) {
        console.error('Erro ao listar projetos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
    }
});


router.delete('/delete', async (req, res) => {
    const {project_id} = req.query;
    if (!project_id) {
        return res.status(400).json({ message: 'O parâmetro project_id é obrigatório.' });
    }
    try {
        const result = await db.query(
            'DELETE FROM "PROJECT" WHERE ID=$1',
            [project_id]
        );

        res.status(200).json({ message: 'Projeto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar projeto:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
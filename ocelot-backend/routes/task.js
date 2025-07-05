
const express = require('express');
const db = require('../database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create', async (req, res) => {
    const { project_id, name, description, status, priority } = req.body;

    if (!project_id || !name || !status || !priority) {
        return res.status(400).json({ message: 'Parâmetros obrigatórios ausentes.' });
    }

    try {
        const newTask = await db.query(
            `INSERT INTO "TASK" (project_id, name, description, status, priority, created, updated)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING id, project_id, name, description, status, priority, created, updated`,
            [project_id, name, description, status, priority]
        );

        res.status(201).json({ message: 'Task criada com sucesso', task: newTask.rows[0] });
    } catch (error) {
        console.error('Erro ao criar task:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/list', async (req, res) => {
    const { userId } = req.query;
    const { project_id } = req.query;

    if (!project_id) {
        return res.status(400).json({ message: 'O parâmetro project_id é obrigatório' });
    }

    if(project_id){
    try {
        const projects = await db.query(
            `SELECT * FROM "TASK" WHERE project_id=$1;`,[project_id]
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
        return res.status(400).json({ message: 'O parâmetro task_id é obrigatório.' });
    }
    try {
        const result = await db.query(
            'DELETE FROM "TASK" WHERE ID=$1',
            [project_id]
        );

        res.status(200).json({ message: 'Task deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar task:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
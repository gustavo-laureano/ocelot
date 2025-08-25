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
            `INSERT INTO tasks (project_id, name, description, status, priority, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             RETURNING *`,
            [project_id, name, description, status, priority]
        );
        res.status(201).json({ message: 'Task criada com sucesso', task: newTask.rows[0] });
    } catch (error) {
        console.error('Erro ao criar task:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.get('/list', async (req, res) => {
    const { project_id } = req.query;

    if (!project_id) {
        return res.status(400).json({ message: 'O parâmetro project_id é obrigatório' });
    }

    try {
        const tasks = await db.query(
            `SELECT * FROM tasks WHERE project_id = $1;`,
            [project_id]
        );
        res.status(200).json({ tasks: tasks.rows });
    } catch (error) {
        console.error('Erro ao listar tasks:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.delete('/delete', async (req, res) => {
    const { task_id } = req.query;
    if (!task_id) {
        return res.status(400).json({ message: 'O parâmetro task_id é obrigatório.' });
    }
    try {
        await db.query(
            'DELETE FROM tasks WHERE id = $1',
            [task_id]
        );
        res.status(200).json({ message: 'Task deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar task:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
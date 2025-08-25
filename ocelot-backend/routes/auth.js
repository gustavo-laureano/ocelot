const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, name, password, email, phone, github, linkedin, photo } = req.body;

    try {
        const userExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            `INSERT INTO users 
            (username, name, password_hash, email, phone, github_url, linkedin_url, photo_path) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [username, name, hashedPassword, email, phone, github, linkedin, photo]
        );

        res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser.rows[0] });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Usuário não encontrado ou senha incorreta' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Usuário não encontrado ou senha incorreta' });
        }

        // Atualiza o campo last_login_at
        await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login bem-sucedido', token, user });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});


module.exports = router;
require('dotenv').config();
const express = require('express');
const { query } = require('./db/index.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})


app.post('/users', async (req, res) => {
    console.log('Request received:', req.body);
    const { id, email, password } = req.body;
    try {
        const result = await query(
            'INSERT INTO users (id, email, password) VALUES ($1, $2, $3) RETURNING *',
            [ id, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log('Connecting to database:', process.env.PGDATABASE, process.env.PGPORT);
        console.error(err)
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const result = await query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get user'})
    }
});

app.delete('/users', async (req, res) => {
    try {
        const result = await query('DELETE FROM users');
        res.status(204).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete users'})
    }
});

app.post('/products', async (req, res) => {
    const { id, name, description, price, order_stock, category, categories_id } = req.body;

    try {
        const result = await query(
            'INSERT INTO products (id, name, description, price, order_stock, category, categories_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
            [id, name, description, price, order_stock, category, categories_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const result = await query('SELECT * FROM products');
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get products'}) 
    }
});

app.delete('/products', async (req, res) => {
    try {
        const result = await query('DELETE FROM products');
        res.status(204).json();
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to delete products'})
    }
});


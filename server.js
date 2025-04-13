require('dotenv').config();
const express = require('express');
const { query } = require('./db/index.js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5001;
const JWT_SECRET = process.env.JWT_SECRET || secretKey; 


app.use(express.json());
app.use(cors());

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token'});
        }
        req.user = user;
        next();
    })
};

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
});

app.post('/register', async (req, res) => {
    const { email, password, first_name, last_name, address, registration_date, phone_number, date_of_birth, profile_information } = req.body;
    try {
        if ( !email || !password) {
            return res.status(400).json({ error: 'Id, email and password are required'})
        }

        const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await query(
            'INSERT INTO users ( email, password, first_name, last_name, address, registration_date, phone_number, date_of_birth, profile_information) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [email, hashedPassword, first_name, last_name, address, registration_date, phone_number, date_of_birth, profile_information]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.post('/checkout', async (req, res) => {
    const { cartItems, total, userId } = req.body;

    try {
        const orderResult = await query('INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id', [userId, total, 'Pending']);

        const orderId = orderResult.rows[0].id;

        for (const item of cartItems) {
            await query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)', [orderId, item.product_id, item.quantity, item.price]);
        }

        res.status(200).json({ message: 'Checkout successful!' });

    } catch (err) {
        console.error('Checkout failed', err);
        res.status(500).json({ message: 'Error processing checkout' });
    }
})

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


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Received Email:", email);
    console.log("Received Password:", password);

    try {
        const result = await query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length === 0) {
            console.log("User not found in database");
            return res.status(400).json({ error: 'Invalid email or password'});
        }

        const user = result.rows[0];

        console.log("Stored Password in DB:", user.password);
        console.log("Entered Password:", password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            console.log("Passwords do not match!");
            return res.status(400).json({ error: 'Invalid email or password'});
        }

        const token = jwt.sign({ id: user.id, email: user.email}, JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json({ token, user: {id: user.id, first_name: user.first_name, email: user.email} });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to login'});
    }
});


app.post('/products', async (req, res) => {
    const { name, description, price, order_stock, category, categories_id } = req.body;

    try {
        const result = await query(
            'INSERT INTO products (name, description, price, order_stock, category, categories_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
            [name, description, price, order_stock, category, categories_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.get('/products', async (req, res) => {

    const { category } = req.query

    try {

        let result;
        if (category) {
            result = await query('SELECT * FROM products WHERE category = $1', [category])
        } else {
            result = await query('SELECT * FROM products');
        }
        res.status(200).json(result.rows)

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: 'Failed to get products'});
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

app.post('/categories', async (req, res) => {
    const { name } = req.body;

    const sqlQuery = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';  
    console.log("Executing Query:", sqlQuery, "with values:", [name]);

    try {
        const result = await query(sqlQuery, [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create category', details: err.message});
    }
});

app.get('/categories', async (req, res) => {
    try {
        const result = await query('SELECT * FROM categories');
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get categories'});
    }
});

app.delete('/categories', async (req, res) => {
    try {
        const result = await query('DELETE FROM categories');
        res.status(204).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete categories'});
    }
});

app.post('/cart', async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        const result = await query('INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3 RETURNING *', [user_id, product_id, quantity]);
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

app.get('/cart', async (req, res) => {
    try {
        const result = await query('SELECT c.id, c.quantity, p.name, p.price FROM cart c JOIN products p ON c.product_id = p.id');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get cart'})
    }
}) 

app.delete('/cart', async (req, res) => {
    try {
        const result = await query('DELETE FROM cart')
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete items'})
    }
})

app.delete('/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await query('DELETE FROM cart WHERE user_id = $1', [userId]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete cart'});
    }
});

app.put('/cart', async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        if (!user_id || !product_id || quantity== null ) {
            return res.status(400).json({ error: "Missing user_id, product_id or quantitty" });
        }

        const result = await query('UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *', [quantity, user_id, product_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found'});
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

app.post('/orders', async (req, res) => {
    const { user_id, total_amount, shipping_address, payment_method } = req.body;

    try {
        const orderResult = await query('INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [user_id, total_amount, 'Pending', shipping_address, payment_method]
        )
        const order = orderResult.rows[0];

        const cartItems = await query('SELECT product_id, quantity FROM cart WHERE user_id=$1', [user_id]);

        for (const item of cartItems.rows) {
            await query('INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)', [order.id, item.product_id, item.quantity]);
        }

        await query('DELETE FROM cart WHERE user_id = $1', [user_id]);

        res.status(201).json({ order, items: cartItems.rows})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order'})
    }
});

app.get('/orders', async (req, res) => {
    try {
        const result = await query('SELECT * FROM orders');
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get orders'});
    }
})

app.delete('/orders', async (req, res) => {
    try {
        const result = await query('DELETE FROM orders');
        res.status(204).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete orders'});
    }
})


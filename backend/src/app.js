const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/stores', require('./routes/store'));
app.use('/api/products', require('./routes/product'));
app.use('/api/combos', require('./routes/combo'));
app.use('/api/cart', require('./routes/cart'));

module.exports = app;

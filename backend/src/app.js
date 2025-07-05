const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"], // Frontend origin
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Session-ID"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/stores', require('./routes/store'));
app.use('/api/products', require('./routes/product'));
app.use('/api/combos', require('./routes/combo'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/guest-orders', require('./routes/guestOrder'));

module.exports = app;

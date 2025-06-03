require('dotenv').config();
const express = require('express');
const db = require('.');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Start server and sync DB
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected and synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database connection failed:', err);
});

const express = require('express');
const connectDB = require('./config/db');

const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const customerRoutes = require('./routes/customerRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use('/customer', customerRoutes);
app.use('/user', userRoutes);
app.use('/item', itemRoutes);
app.use('/transaction', transactionRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

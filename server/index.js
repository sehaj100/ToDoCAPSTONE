const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (hardcoded)
const mongoUri = 'mongodb+srv://adityathakur22ji_db_user:Aditya22ji@adi.wkm4ble.mongodb.net/todoapp?retryWrites=true&w=majority';

mongoose.connect(mongoUri)
  .then(() => {
    console.log(' Connected to MongoDB');

    // Start server after DB connection
    const PORT = 5000;
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err.message));

// Routes
const todosRouter = require('./routes/todos');
app.use('/api/todos', todosRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

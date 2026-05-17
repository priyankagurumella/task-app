const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from root folder
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.log('❌ Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Start server
app.listen(5000, () => {
    console.log('🚀 Server running on port 5000');
});
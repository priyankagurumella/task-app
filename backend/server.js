const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));


mongoose.connect('mongodb+srv://priyagurumella_db_user:priyamma123@cluster0.rd7hh7e.mongodb.net/taskapp')
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.log('❌ Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});
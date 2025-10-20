const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, () => console.log('MongoDB connected'));

app.listen(5000, () => console.log('Server running on port 5000'));
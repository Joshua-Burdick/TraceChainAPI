const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const plug = mongoose.connect(process.env.MONGO_URI);

const app = express();
app.use(express.json());

app.use('/api/post', require('./api/post'));

const PORT = process.env.PORT || 1776;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} 🎆...`);
})
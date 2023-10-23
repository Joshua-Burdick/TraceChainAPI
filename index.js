const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const AccountRoutes = require('./api/account');

dotenv.config();

const envUri = process.env.MONGO_URI;

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 1776;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGO_DB_NAME
  })
  .then(() => console.log('MongoDB database Connected...'))
  .catch((err) => console.log("mongoose.connect has the following error: ", err));

app.use('/api/account', AccountRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} 🎆...`);
});
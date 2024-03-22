const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

dotenv.config();

const AccountRoutes = require('./api/account');
const PostRoutes = require('./api/post');
const LoginRoutes = require('./api/login');
const RegisterRoutes = require('./api/register');
const ImageUploadRoutes = require('./api/upload');
const AccountVerificationRoutes = require('./api/accountVerification');
const envUri = process.env.MONGO_URI;

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

const PORT = process.env.PORT || 1776;

mongoose.connect(envUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGO_DB_NAME
})
  .then(() => console.log('MongoDB database Connected...'))
  .catch((err) => console.log("mongoose.connect has the following error: ", err));

app.use('/api/account', AccountRoutes);
app.use('/api/post', PostRoutes);
app.use('/api/login', LoginRoutes);
app.use('/api/register', RegisterRoutes);
app.use('/api/upload', ImageUploadRoutes);
app.use('/api/accountVerification', AccountVerificationRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} 🎆...`);
});

module.exports = app;
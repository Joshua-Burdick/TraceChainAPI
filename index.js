const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
})

const PORT = process.env.PORT || 1776;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} 🎆...`);
})
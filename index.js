const express = require('express');

const connectDB = require('./utils/connectDB');

const app = express();

connectDB();

app.use(express.json());

app.get('/api', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

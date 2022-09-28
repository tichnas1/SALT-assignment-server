const express = require('express');
const path = require('path');

const connectDB = require('./utils/connectDB');

const app = express();

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/api', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/balance', require('./routes/api/balance'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

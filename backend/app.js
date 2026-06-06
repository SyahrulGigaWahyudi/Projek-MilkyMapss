const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');
const apiRoutes = require('./src/routes/api');
const authRoutes = require('./src/routes/auth');

app.use(cors());
app.use(express.json());

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
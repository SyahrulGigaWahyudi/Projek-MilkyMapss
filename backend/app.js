const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const apiRoutes = require('./src/routes/api');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
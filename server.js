const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

const connectToDb = require('./controllers/connectToDb');
connectToDb();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`App is listening on port: ${ port }`);
});
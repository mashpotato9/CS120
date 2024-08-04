const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/router');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
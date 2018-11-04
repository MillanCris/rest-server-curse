const express = require('express');
const app = express();


app.use(require('./User'));
app.use(require('./login'));


module.exports = app;
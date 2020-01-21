const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const ruoke = require('./routes');
app.use('/', ruoke);

const server = app.listen(process.env.PORT || 5000, () => console.log("boi"));
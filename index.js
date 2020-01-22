const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const device = require('express-device');

const app = express();

app.use(device.capture());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

const ruoke = require('./routes');
app.use('/', ruoke);
//port = 80 in prod
//5000 or something in dev
const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log("RUNNING IN PORT", port));
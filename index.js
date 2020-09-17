const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const device = require('express-device');
const cors = require('cors');
const app = express();

app.use(device.capture());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.set('view engine', 'ejs');

const routes = require('./routes');
app.use('/', routes);

app.use('/files',  express.static(__dirname + '/files'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("RUNNING IN PORT", port));

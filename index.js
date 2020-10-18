const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const device = require('express-device');
const cors = require('cors');
const app = express();
const path = require('path');
const { misc } = require('./util');

app.use(device.capture());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//const oldRoutes = require('./oldRoutes');
//app.use('/api/v1', oldRoutes);
const routes = require('./routes');

app.use('/', routes);
app.use('/files', express.static(__dirname + '/files'));
app.use('/static', express.static('client/build'));

app.get('*', (req, res) => {
    if (misc.showWebsite(req.device.type)) 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("RUNNING IN PORT", port));

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const device = require('express-device');
const cors = require('cors');
const app = express();
const LukkariBot = require('./lukkaribot');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());
app.use(device.capture());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

const bot = new LukkariBot();
bot.initialize().then(_ => {
    console.log("");
    bot.addClass().then(res => {console.log("theres: ", res)}).catch(e => console.log(e));
})
.catch(err => {
    console.log(err);
});

const ruoke = require('./routes');
app.use('/', ruoke);

app.use('/files',  express.static(__dirname + '/files'));
//port = 80 in prod
//5000 or something in dev
const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log("RUNNING IN PORT", port));
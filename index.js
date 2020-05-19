const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const device = require('express-device');
const cors = require('cors');
const app = express();
const socket = require('socket.io');

app.use(cors());
app.use(device.capture());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

const ruoke = require('./routes');
app.use('/', ruoke);

app.use('/files',  express.static(__dirname + '/files'));
//port = 80 in prod
//5000 or something in dev
const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log("RUNNING IN PORT", port));

const io = socket(server);

let mainController;
let slaveController;

io.sockets.on('connection', socket => {

    socket.on('disconnect', () => {
        if(mainController == socket.id)
            mainController = null;
        else 
            slaveController = null;
    });

    socket.on('join', config => {
        if(config.isMain) {
            mainController = socket.id;
        } else {
            slaveController = socket.id;
        }
    });

    socket.on('relayICECandidate', config => {
        const peer_id = config.peer_id;
        const ice_candidate = config.ice_candidate;

        if(slaveController == peer_id)
            slaveController.emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        else if(mainController == peer_id)
            mainController.emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});

    });

    socket.on('relaySessionDescription', config => {
        const peer_id = config.peer_id;
        const session_description = config.session_description;

        if(slaveController == peer_id)
            slaveController.emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        else if(mainController == peer_id)
            mainController.emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
    });

});
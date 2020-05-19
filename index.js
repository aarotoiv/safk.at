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
    console.log("SOCKET CONNECTED");

    socket.on('disconnect', () => {
        console.log("socket disconnected");
    });

    socket.on('join', config => {
        console.log("ISMAIN: ", config.userdata.isMain);
        if(config.userdata.isMain) {
            mainController = socket;
            if(slaveController) {
                console.log("Emitting to slave");
                slaveController.emit('addMaster', {'peer_id': socket.id, 'should_create_offer': false});
                mainController.emit('addSlave', {'peer_id': slaveController.id, 'should_create_offer': true});
            }
        } else {
            slaveController = socket;
            if(mainController) {
                console.log("Emitting to master");
                slaveController.emit('addMaster', {'peer_id': mainController.id, 'should_create_offer': false});
                mainController.emit('addSlave', {'peer_id': socket.id, 'should_create_offer': true});
            }
                
        }
    });

    socket.on('relayICECandidate', config => {
        console.log("relaying ICE candidate", config);

        const peer_id = config.peer_id;
        const ice_candidate = config.ice_candidate;
        if(slaveController.id == peer_id)
            slaveController.emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});
        else if(mainController.id == peer_id)
            mainController.emit('iceCandidate', {'peer_id': socket.id, 'ice_candidate': ice_candidate});

    });

    socket.on('relaySessionDescription', config => {
        console.log("relaying session description", config);

        const peer_id = config.peer_id;
        const session_description = config.session_description;

        if(mainController.id == socket.id) {
            console.log("SENDING DESC TO SLAVE");
            slaveController.emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
        }
        else if(slaveController.id == socket.id) {
            console.log("SENDING DESC TO MASTER");
            mainController.emit('sessionDescription', {'peer_id': socket.id, 'session_description': session_description});
        }
            
    });

});
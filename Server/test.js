const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
var Round = require("./models/Round");
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Suhdo:aAWbqQMGTprxXvln@suhdo.qqnj3n4.mongodb.net/BigSmall_01?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        createNewRound()
    })
    .catch((e) => {
        console.error(e);
    })

var currentRoundId = null;

function createNewRound() {
    const newRound = new Round({
        small_money: 1000,
        small_players: 0,
        big_money: 500,
        big_players: 10,
        counter: 0, // 1-> 60
        result: -1, // -1: waiting, 1: small, 0: big
        dateCreated: Date.now()
    });

    newRound.save()
        .then(res => {
            console.log('Saved successfully:', res._id);
            currentRoundId = res._id;
            roundCounter(currentRoundId);
        })
        .catch(error => {
            console.error('Error while saving:', error);
            currentRoundId = null;
        });
}

function roundCounter(roundId) {
    Round.findOne({ _id: roundId })
        .then((res) => {
            if (res != null) {
                if (res.counter < 60) {
                    res.counter++;
                    res.small_money += Math.floor(Math.random() * 10000000);
                    res.big_money += Math.floor(Math.random() * 10000000);
                    console.log("current: " + roundId + ', count: ' + res.counter);
                    res.save().then(() => {
                        //send data to all client connected
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(res));
                            }
                        });

                        setTimeout(() => {
                            roundCounter(roundId);
                        }, 1000);
                    })
                        .catch((e) => console.error(e))
                } else {
                    res.result = Math.floor(Math.random() * 2);
                    if (res.result == 0) {
                        res.dice = Math.floor(Math.random() * 3) + 1; // 1 -> 3
                    } else {
                        res.dice = Math.floor(Math.random() * 3) + 4; // 4 -> 6
                    }
                    res.save()
                        .then((res => {
                            console.log("Winner is: " + res.result);
                            setTimeout(() => {
                                createNewRound();
                            }, 1000);
                        }))
                }
            }
        })
        .catch((e) => {
            console.error(e);
        })
}

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('Hello, client!');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
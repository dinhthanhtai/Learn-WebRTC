var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8888});

users = {};

wss.on('connection', function (connection) {
    console.log("User connected");

    connection.on('message', function (message) {
        var data;

        try {
            data = JSON.parse(message);
        } catch (e) {
            console.log("Error parsing JSON message: ");
            data = {};
            
        }

        switch (data.type) {
            case 'login':
                console.log('user logged in as', data.name);
                if (users[data.name]) {
                    sendTo(connection, {
                        type: 'login',
                        success: false
                    })
                } else {
                    users[data.name] = connection;
                    connection.name = data.name;
                    sendTo(connection, {
                        type: 'login',
                        success: true
                    })
                }

                break;
            case 'offer': 
                console.log('sending offer to', data.name);
                var conn = users[data.name];

                if(conn != null) {
                    connection.otherName = data.name;
                    sendTo(conn, {
                        type: 'offer',
                        offer: data.offer,
                        name: connection.name
                    })
                }
                break;
            case 'answer': 
                console.log('sending answer to', data.name);
                var conn = users[data.name];

                if (conn != null) {
                    connection.otherName = data.name;
                    sendTo(conn, {
                        type: 'answer',
                        answer: data.answer,
                    })
                }
                break;
            case "candidate": 
                console.log('sending candidate to', data.name);
                var conn = users[data.name];

                if (conn!= null) {
                    sendTo(conn, {
                        type: "candidate",
                        candidate: data.candidate
                    })
                }
                break;
            case "leave": 
                console.log('sending leave to', data.name);
                var conn = users[data.name];
                conn.otherName = null;

                if (conn != null) {
                    sendTo(conn, {
                        type: 'leave'
                    })
                }
                break;
            default:
                sendTo(connection, {
                    type: 'error',
                    message: 'Unknown message type' + data.type
                });
                break;
        }
    })

    connection.on('close', function () {
        if(connection.name) {
            delete users[connection.name];

            if (connection.otherName) {
                console.log('disconnecting from', connection.otherName);

                var conn = users[connection.otherName];
                conn.otherName = null;

                if (conn != null) {
                    sendTo(conn, {
                        type: 'leave'
                    })
                }
            }
        }
    });
});

function sendTo(connection, message) {
    connection.send(JSON.stringify(message));
}

wss.on('listening', function() {
    console.log("server started...")
})
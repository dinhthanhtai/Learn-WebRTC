var name, connectedUser;

var connection = new WebSocket('ws://localhost:8888');

connection.onopen = function() {
    console.log('connected');
}

// handle all messages through this callback 
connection.onmessage = function (message) {
    console.log('Got message', message.data);

    var data = JSON.parse(message.data);

    switch (data.type) {
        case 'login':
            onLogin(data.success);
            break;
        case "offer":
            onOffer(data.offer, data.name);
            break;
        case "answer":
            onAnswer(data.answer);
            break;
        case "leave": 
            onLeave();
            break;
        default:
            break;
    };
};

connection.onerror = function (err) {
    console.log('Got error', err);
}

// Alias for sending messages in JSON format
function send(message) {
    if(connectedUser) {
        message.name = connectedUser;
    };

    connection.send(JSON.stringify(message))
}

var loginPage = document.querySelector('#login-page');
var userNameInput = document.querySelector('#username');
var loginButton = document.querySelector('#login');
var callPage = document.querySelector('#call-page');
var theirUsernameInput = document.querySelector('#their-username');
var callButton = document.querySelector('#call');
var hangUpButton = document.querySelector('#hang-up');

callPage.style.display = "none";

// Login when the user clicks the button
loginButton.addEventListener('click', function (event) {
    let name = userNameInput.value;

    if (name.length > 0) {
        send({
            type: 'login',
            name: name
        })
    }
})

function onLogin(success) {
    if(success === false) {
        alert('Login unsuccessful, please try a different name.');
    } else {
        loginPage.style.display = "none";
        callPage.style.display = "block";

        // Get the plumbing ready for a call;
        startConnection();
    }
}

var yourVideo = document.querySelector('#yours');
var theirVideo = document.querySelector('#theirs');
var yourConnection, connectedUser, stream;

function startConnection() {
    if (hasUserMedia()) {
        navigator.getUserMedia({
            video: true,
            audio: false
        },
            function(myStream) {
                stream = myStream;
                yourVideo.srcObject = stream;

                if(hasRTCPeerConnection()) {
                    setupPeerConnection(stream);
                } else {
                    alert('Sorry, your browser does not support WebRTCPeerConnection')
                }
            }
        ,
        function(err) {
            alert('Sorry, your browser does not support getUserMedia')
        }
        )
    } else {
        alert('Sorry, your browser does not support WebRTC')
    }
}

function setupPeerConnection(stream) {
    var configuration = {
        "iceServers": [
            {
                "url": "stun:stun.1.google.com:19302"
            }
        ]
    }

    yourConnection = new RTCPeerConnection(configuration);

    let inboundStream = null;

    // Setup stream listening ;
    for(let track of stream.getTracks()) {
        yourConnection.addTrack(track);
    }

    yourConnection.ontrack = function (event) {
        if (event.streams.length > 0) {
            theirVideo.srcObject = event.streams[0];
        } else {
            if (!inboundStream) {
                inboundStream = new MediaStream();

                theirVideo.srcObject = inboundStream;
            }

            inboundStream.addTrack(event.track);
        }
    }

    // Setup ice handling 
    yourConnection.onicecandidate = function (event) {
        if (event.candidate) {
            send({
                type: 'candidate',
                candidate: event.candidate
            })
        }
    }
}

function hasUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    return !!navigator.getUserMedia;
}

function hasRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCSessionDescription;

    window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;


    return !!window.RTCPeerConnection;
}

callButton.addEventListener('click', function() {
    var theirUsername = theirUsernameInput.value;

    if (theirUsername.length > 0) {
        startPeerConnection(theirUsername);
    }
})

function startPeerConnection(user) {
    connectedUser = user;

    // Begin the offer 
    yourConnection.createOffer(function (offer) {
        send({
            type: "offer",
            offer: offer
        });

        yourConnection.setLocalDescription(offer);
    }, function (error) {
        alert("An error has occurred.")
    });
}

function onOffer(offer, name) {
    connectedUser = name;

    yourConnection.setRemoteDescription(new RTCSessionDescription(offer));

    yourConnection.createAnswer(function (answer) {
        yourConnection.setLocalDescription(answer);

        send({
            type: "answer",
            answer: answer
        })
    },
    function (error) {
        alert("An error has occurred.")
    })
}

function onAnswer(answer) {
    yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function onCandidate(candidate) {
    yourConnection.addIceCandidate(new RTCIceCandidate(candidate))
}

hangUpButton.addEventListener('click', function() {
    send({
        type: 'leave'
    });

    onLeave();
})

function onLeave() {
    connectedUser = null;
    theirVideo.srcObject = null;
    yourConnection.close();
    yourConnection.onicecandidate = null;
    yourConnection.addTrack = null;
    setupPeerConnection(stream)
}
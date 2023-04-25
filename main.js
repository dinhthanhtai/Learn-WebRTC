function hasUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    return !!navigator.getUserMedia;
}

function hasRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    return !!window.RTCPeerConnection;
}

var yourVideo = document.querySelector('#yours');
var theirVideo = document.querySelector('#theirs');
var yourConnection, theirConnection;

if (hasUserMedia()) {
    navigator.getUserMedia({
        video: true, 
        audio: false
    }, function (stream) {
        window.stream = stream;
        yourVideo.srcObject = stream;

        if (hasRTCPeerConnection()) {
            startPeerConnection(stream);
        } else {
            alert('Sorry, your browser does not support web RTC.')
        }
    }, function (error) {
        alert('Sorry, we failed to capture your camera, please try again.');
    })
} else {
    alert('Sorry, your browser does not support webRTC.')
}

function startPeerConnection(stream) {
    var configuration = {
        "iceServers": [{ "url": "stun:stun.1.google.com:19302"}]
    };

    yourConnection = new webkitRTCPeerConnection(configuration);
    theirConnection = new webkitRTCPeerConnection(configuration);

    let inboundStream = null;


    // Set up stream listening
    for (const track of stream.getTracks()) {
        yourConnection.addTrack(track);
    } 
    theirConnection.ontrack = function (ev) {
        console.log('caller recived new stream');
        if (ev.streams && ev.streams[0]) {
            videoElem.srcObject = ev.streams[0];
          } else {
            if (!inboundStream) {
              inboundStream = new MediaStream();
              console.log("🚀 ~ file: main.js:59 ~ startPeerConnection ~ inboundStream:", inboundStream)
              theirVideo.srcObject = inboundStream;
            }
            inboundStream.addTrack(ev.track);
          }
        console.log(ev)
    }


    

    // Setup ice handling 
    yourConnection.onicecandidate = function (event) {
        if (event.candidate) {
            theirConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    theirConnection.onicecandidate = function (event) {
        if (event.candidate) {
            yourConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        }
    }

    function error () { console.log('There was an error'); };

    yourConnection.createOffer(function (offer) { console.log('Offer:'); console.log(offer);
        yourConnection.setLocalDescription(offer);
        theirConnection.setRemoteDescription(offer);

        theirConnection.createAnswer(function (answer) { console.log('Answer:'); console.log(answer);
            theirConnection.setLocalDescription(answer);
            yourConnection.setRemoteDescription(answer);
        }, error);
    }, error);
}
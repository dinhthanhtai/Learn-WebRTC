function hasUserMedia () {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGeneric || navigator.mozGetUserMedia || navigator.webkitGeneric || navigator.msGetUserMedia) 
}

var constraints = {
    video: {
        mandatory: {
            minWith: 640,
            minHeight: 480,
        }
    },
    audio: true
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera mini/i.test(navigator.userAgent)) {
    console.log('true ne')
    constraints = {
        video: {
            mandatory: {
                minWith: 480,
                minHeight: 320,
                maxWidth: 1024,
                maxHeight: 768
            }
        },
        audio: true
    }
}

if (hasUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGeneric;

    navigator.getUserMedia(constraints, function (stream) {
        console.log("🚀 ~ file: main.js:9 ~ stream:", stream)
        var video = document.querySelector('video');
        const videoTracks = stream.getVideoTracks();
        console.log("🚀 ~ file: main.js:25 ~ videoTracks:", videoTracks)
        console.log(`Using video device: ${videoTracks[0].label}`);
        window.stream = stream; // make variable available to browser console
        video.srcObject = stream;
    }, function (err) {})
} else {
    alert('Sorry, your browser does not support getUserMedia');
}


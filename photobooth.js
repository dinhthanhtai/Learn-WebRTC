function hasUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia
        )
}

if (hasUserMedia()) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    streaming = false;

    navigator.getUserMedia({
        video: true,
        audio: false
    }, function(stream) {
        video.srcObject = stream;
        streaming = true;
    }, function(error) {
        console.log("Raised an error when capturing: ", error);
    });

    var filters = ['', 'grayscale', 'sepia', 'invert'];
    var currentFilter = 0;

    document.querySelector('#capture').addEventListener('click', function(event) {
        if (streaming) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            var context = canvas.getContext('2d');
            context.drawImage(video, 0, 0);
            context.fillStyle = "white";
            context.fillText("Hello, world!", 10, 10);

            currentFilter++;
            if (currentFilter > filters.length - 1) currentFilter = 0;
            canvas.className = filters[currentFilter] 
        }
    } )
} else {
    alert("Sorry, your browser doest not support getUserMedia")
}
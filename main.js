if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  } else {
      navigator.mediaDevices.enumerateDevices().then(function(sources) {
          var audioSource = null;
          var videoSource = null;
      
          for (var i = 0; i < sources.length; i++) {
              var source = sources[i];
              if (source.kind === 'audioinput') {
                  console.log('Microphone found:', source.label, source.deviceId);
                  audioSource = source.deviceId;
              } else if (source.kind === 'videoinput') {
                  console.log('Camera found:', source.label, source.deviceId)
                  videoSource = source.deviceId;
              } else {
                  console.log('Unknown source:', source);
              }
          }
      
          var constraints = {
              audio: {
                  optional: [{sourceId: audioSource}]
              },
              video: {
                  optional: [{sourceId: videoSource}]
              }
          }
      
          navigator.getUserMedia(constraints, function(stream) {
              var video = document.querySelector('video');
              window.stream = stream;
              video.srcObject = stream;
          }, function(error) {
              console.log('Raised an error when capturing:', error);
          })
      }) 
  }
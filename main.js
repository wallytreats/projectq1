var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

//audio nodes configuration
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -100;
analyser.maxDecibels = -1;
analyser.smoothingTimeConstant = 0.75;

var gain = audioCtx.createGain();
var convolver = audioCtx.createConvolver();


// set up canvas for visualizer
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.visualizer').clientWidth;

canvas.setAttribute('width',intendedWidth);

var drawVisual;

if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // make sure audio is a source
      {
         audio: true
      },
      // this is my success callback
      function(stream) {
         source = audioCtx.createMediaStreamSource(stream);
         source.connect(analyser);
         analyser.connect(convolver);
         convolver.connect(gain);
         gain.connect(audioCtx.destination);

      	 visualize();
      },

      //fail callback
      function(err) {
         console.log('error:' + err);
      }
   );
} else {
   console.log('getUserMedia cant use your browser!');
}

function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    console.log(HEIGHT);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      // canvasCtx.fillRect(0, 0, 120, 120);
      // canvasCtx.arc(75, 50, 50, 0, 2 * Math.PI);

      var barWidth = (WIDTH / bufferLength * 2);
      var barHeight;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        canvasCtx.fillStyle = 'rgb(' + (barHeight) + ',' + (barHeight+50) + ',' + (barHeight+200)+'';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
        x += barWidth + 1;
        // canvasCtx.arc(75, 50, 50, 0, 2 * Math.PI);
      }
    }
  draw();
}

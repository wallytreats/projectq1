$('#mainBtn').click(function(){
  $('#mainBtn').hide();
  $('header').hide();
  $('h4').hide();


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

//audio nodes configuration
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -75;
analyser.maxDecibels = -25;
analyser.smoothingTimeConstant = 0.95;

var gain = audioCtx.createGain();
var convolver = audioCtx.createConvolver();


// set up canvas for visualizer
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.visualizer').clientWidth;

canvas.setAttribute('width', intendedWidth);

var intendedHeight = document.querySelector('.visualizer').clientHeight;

canvas.setAttribute('height', intendedHeight);

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
        //show buttons on audio input confirm
        $('.info').hide();
        // $('#greenBtn').show();
      	visualize();
      },

      //fail callback
      function(err) {
         console.log('error:' + err);
      }
   );
} else {
   console.log('getUserMedia cant be used in your browser!');
}

function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

        //this is my number of bars on screen
    analyser.fftSize = 128;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(' + 0 +',' + 0 + ',' + 0 + ')';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      // canvasCtx.arc(75, 50, 50, 0, 2 * Math.PI);// this will stay at top

      var barWidth = (WIDTH / bufferLength);
      var barHeight;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        //default color//
        canvasCtx.fillStyle = 'rgb(' + (barHeight+80) + ',' + (30) + ',' + (200)+'';
      //change color//
        // $('#greenBtn').click(function(){
        //   canvasCtx.fillStyle = 'rgb(' + (barHeight) + ',' + (200) + ',' + (20)+'';
        // })

        //default shape//
        canvasCtx.fillRect(x,HEIGHT-barHeight,barWidth,barHeight/4);
        x += barWidth;
          console.log(HEIGHT-barHeight);
      }
    }
  draw();
  }
});

$('#mainBtn').click(function(){
  $('#mainBtn').hide();
  $('header').hide();
  $('h4').hide();
  $('#copyright').hide();

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

//audio nodes configuration
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -120;
analyser.maxDecibels = 20;
analyser.smoothingTimeConstant = 0.95;

// set up canvas for visualizer
var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.visualizer').clientWidth;

canvas.setAttribute('width', intendedWidth);

var drawVisual;

if (navigator.getUserMedia) {
   navigator.getUserMedia (

      // make sure audio is a source
      {
         audio: true
      },

      // this is my success callback
      function(stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        //capture the audio and output it again
        // analyser.connect(audioCtx.destination);

        //show/hide elements on audio input confirm
        $('.info').hide();
        $('#greenBtn').fadeIn();
        $('#yellowBtn').fadeIn();
        $('#redBtn').fadeIn();
        $('#blueBtn').fadeIn();
        $('#purpleBtn').fadeIn();
        $('#whiteBtn').fadeIn();
        $('#funBtn').fadeIn();
        $('#clearBtn').fadeIn();
        $('.colorP').fadeIn();
        $('#title').fadeIn();
        $('canvas').show();
        $('#title').click(function(){
          location.reload();
        });
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

//all button clicks for canvas
$('#greenBtn').click(function(){
  barColor = 'rgb(' + (20) + ',' + (220) + ',' + (10)+'';
});
$('#yellowBtn').click(function(){
  barColor = 'rgb(' + (250) + ',' + (250) + ',' + (0)+'';
});
$('#redBtn').click(function(){
  barColor = 'rgb(' + (220) + ',' + (20) + ',' + (10)+'';
});
$('#blueBtn').click(function(){
  barColor = 'rgb(' + (0) + ',' + (20) + ',' + (250)+'';
});
$('#purpleBtn').click(function(){
  barColor = 'rgb(' + (220) + ',' + (60) + ',' + (240)+'';
});
$('#whiteBtn').click(function(){
  barColor = 'rgb(' + (250) + ',' + (250) + ',' + (250)+'';
});
$('#funBtn').click(function(event){
  if(funMode === canvas.height){
    funMode = 0;
  } else {
    funMode = 150;
  }
});
$('#clearBtn').click(function(){
  visualize();
  funMode = 150;
});

//define color variables so they can change
// var backroundColor = 'rgba(' + 0 +',' + 0 + ',' + 0 + ',' + 1 + ')';
var barColor = 'rgb(' + (250) + ',' + (250) + ',' + (250)+'';
var funMode = canvas.height;

//spawn the canvas
function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

        //this is my number of bars on screen
    analyser.fftSize = 128;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        //draw canvas bars
    function draw() {
      drawVisual = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

        
      canvasCtx.fillStyle = 'rgba(' + 0 +',' + 0 + ',' + 0 + ',' + 1 + ')';
      canvasCtx.fillRect(0, 0, WIDTH, funMode);
      var barWidth = (WIDTH / bufferLength);
      var barHeight;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        //default color//
        canvasCtx.fillStyle = barColor;

        //default shape//
        canvasCtx.fillRect(x, HEIGHT-barHeight, barWidth, barHeight/4);
        x += barWidth;
      }
    }
  draw();
  }
});

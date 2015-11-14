import SingleOsc from 'single-oscillator';

// Source:
// http://stackoverflow.com/a/5624139/630490
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function linerColorInterpolation( firstColor, secondColor, percentage ) {
   var rgb1 = hexToRgb(firstColor);
   var rgb2 = hexToRgb(secondColor);

   return Math.floor(
   // Red
    Math.floor( ( rgb2.r - rgb1.r ) * percentage + rgb1.r ) * 0x010000 +
   // Green
    Math.floor( ( rgb2.g - rgb1.g ) * percentage + rgb1.g ) * 0x000100 +
   // Blue
    Math.floor( ( rgb2.b - rgb1.b ) * percentage + rgb1.b ) * 0x000001 
   ).toString(16);
}

function genMinorScale(startNote) {
   var scale = [];
   scale.push(startNote);
   scale.push(startNote + 2);
   scale.push(startNote + 3);
   scale.push(startNote + 5);
   scale.push(startNote + 7);
   scale.push(startNote + 8);
   scale.push(startNote + 10);
   return scale;
}
function genEnigmaticScale(startNote) {
   var scale = [];
   scale.push(startNote);
   scale.push(startNote + 1);
   scale.push(startNote + 4);
   scale.push(startNote + 7);
   scale.push(startNote + 9);
   scale.push(startNote + 11);
   return scale;
}
function noteToFreq(note) {
   return Math.pow( 2, ( note - 49  ) / 12  ) * 440;
}

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

ctx.translate(canvas.width / 2, canvas.height / 2);

var audio = new window.AudioContext();

var masterGain = audio.createGain();
masterGain.connect(audio.destination);
masterGain.gain.value = 0.0;

var osc = new SingleOsc({
   context: audio,
   attackTime: 0.1,
   sustainTime: 0.1,
   releaseTime: 0.075,
   maxValue: 1,

   // Osc
   wave: 'sine',
});

osc.connect(masterGain);

var rotation = 0;
var sideLength = Math.min( canvas.width, canvas.height ) / 2;

var rate = 0.1;

var colors = [
   '#00aa23',
   '#37aaf0',
   '#24905b',
   '#bcdef2',
   '#90234c',
];

var bMinor = genMinorScale(51).reverse()
   .concat(genMinorScale(51-12).reverse());
var gEnig = genEnigmaticScale(47);
gEnig = gEnig.concat(gEnig.slice().reverse());

var startTime = audio.currentTime + 1;

var theScale = bMinor;

for ( let j = 0; j < 3; j ++ ){
   for ( let i = 0; i < theScale.length; i++ ) {
      window.setTimeout( function(time) {
         osc.play(noteToFreq(theScale[
            ( ( 1+i ) * ( 2+j ) ) % theScale.length
         ]), time);
      }, ( 1000 * startTime ) - 150, startTime);

      // Draw rectangle
      var amount = Math.PI * 23 /43;
      //Math.PI * 23 / 43;
      window.setTimeout( (rotateBy) => {
         var scale = 0.930;
         ctx.scale(scale, scale);
         ctx.rotate(rotateBy);
         // ctx.rotate(Math.pow( -1 , ( j % 2 ) ) * rotateBy);

         // Increment further
         rotation += rotateBy;

         ctx.fillStyle = '#' + linerColorInterpolation(
            '#F44645', '#32003D',
            (
               ( j * theScale.length + i ) /
                  ( 3 / 2 * theScale.length )
            ) % 1
         );

         ctx.fillRect(-sideLength / 2, -sideLength / 2, sideLength, sideLength);
      }, 1000* startTime, amount);

      startTime += rate;
   }
}

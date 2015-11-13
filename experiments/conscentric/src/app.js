import SingleOsc from 'single-oscillator';

function noteToFreq(note) {
   return Math.pow( 2, ( note - 49  ) / 12  ) * 440;
}

var audio = new window.AudioContext();

var masterGain = audio.createGain();
masterGain.connect(audio.destination);
masterGain.gain.value = 0.7;

var osc = new SingleOsc({
   context: audio,
   attackTime: 0.05,
   sustainTime: 0.1,
   releaseTime: 0.075,
   maxValue: 1,

   // Osc
   wave: 'sine',
});

var startTime = audio.currentTime + 1;
osc.connect(masterGain);

for ( let j = 0; j < 10; j ++ ){
   for ( let i = 0; i < 10; i++ ) {
      osc.play(noteToFreq(49 + 3*i), startTime);
      startTime += 0.05;
   }
}

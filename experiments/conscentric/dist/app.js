(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();Object.defineProperty(exports, "__esModule", { value: true });var _envelope = require('./envelope');var _envelope2 = _interopRequireDefault(_envelope);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var 

AmplitudeEnvelope = (function () {
   function AmplitudeEnvelope(context, options) {_classCallCheck(this, AmplitudeEnvelope);
      var self = this;

      self.context = context;

      // ----- options -----
      self.options = options || {};

      // Timing
      self.currentTimeSource = options.currentTimeSource || self.context;
      self.startTime = options.startTime;
      self.attackTime = options.attackTime;
      self.sustainTime = options.sustainTime;
      self.releaseTime = options.releaseTime;

      self.maxValue = options.maxValue;

      // Create Gain Node and first Envelope
      self.gainNode = self.context.createGain();
      self.gainNode.gain.value = 0;}_createClass(AmplitudeEnvelope, [{ key: 'currentTime', value: function currentTime() 


      {
         if (this.currentTimeSource && typeof this.currentTimeSource.currentTime === 'function') {
            return this.currentTimeSource.currentTime();} else 
         {
            return this.currentTimeSource.currentTime;}} }, { key: 'trigger', value: function trigger() 


      {
         var self = this;

         self.riseEnvelope = new _envelope2.default(self.context, self.maxValue, { 
            startTime: self.startTime, 
            transitionTime: self.attackTime });

         self.riseEnvelope.connect(self.gainNode.gain);
         self.riseEnvelope.trigger();

         // Schedule release envelope
         setTimeout(function () {
            var envelope = new _envelope2.default(self.context, 0, { 
               startTime: self.startTime + self.sustainTime * 1000, 
               transitionTime: self.releaseTime });

            envelope.connect(self.gainNode.gain);
            envelope.trigger();}, 
         (self.startTime - self.currentTime()) * 1000 + self.attackTime * 1000 + self.sustainTime * 1000 - 100);} }]);return AmplitudeEnvelope;})();exports.default = AmplitudeEnvelope;

},{"./envelope":2}],2:[function(require,module,exports){
'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();Object.defineProperty(exports, "__esModule", { value: true });function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var EnvelopeEventGenerator = (function () {
   function EnvelopeEventGenerator(context, endValue, options) {_classCallCheck(this, EnvelopeEventGenerator);
      var self = this;
      options = options || {};

      if (!context) {
         throw new Error('AudioContext is required');}

      if (typeof endValue === 'undefined') {
         throw new Error('An endValue is required');}


      // Required values
      self.context = context;
      self.endValue = endValue;

      // Optional values
      self.startTime = self.context.currentTime;
      self.transitionTime = options.transitionTime || 0.1;}_createClass(EnvelopeEventGenerator, [{ key: 'trigger', value: function trigger() 

      {
         this.param.cancelScheduledValues(this.startTime);
         this.param.setValueAtTime(this.param.value, this.startTime);
         this.param.linearRampToValueAtTime(this.endValue, this.startTime + this.transitionTime);} }, { key: 'connect', value: function connect(

      param) {
         this.param = param;} }]);return EnvelopeEventGenerator;})();exports.default = EnvelopeEventGenerator;

},{}],3:[function(require,module,exports){
'use strict';var _createClass = (function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};})();Object.defineProperty(exports, "__esModule", { value: true });var _amplitudeEnvelope = require('./amplitude-envelope');var _amplitudeEnvelope2 = _interopRequireDefault(_amplitudeEnvelope);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var 

SingleOsc = (function () {
    function SingleOsc(options) {_classCallCheck(this, SingleOsc);
        options = options || {};

        this.context = options.context;
        this.currentTimeSource = options.currentTimeSource || this.context;

        // Timing params
        this.startTime = options.startTime;
        this.attackTime = options.attackTime;
        this.sustainTime = options.sustainTime;
        this.releaseTime = options.releaseTime;

        // Non-timing envelop param
        this.maxValue = options.maxValue;

        // Oscillator param
        this.wave = options.wave || 'sawtooth';

        this.notes = {};

        // Master gain node
        this.destinationNode = this.context.createGain();
        this.destinationNode.gain.value = 1;}_createClass(SingleOsc, [{ key: 'play', value: function play(


        freq, time) {
            var self = this;

            var attackTime = self.attackTime;
            var sustainTime = self.sustainTime;
            var releaseTime = self.releaseTime;

            // Setup envelope
            var envelope = new _amplitudeEnvelope2.default(self.context, { 
                currentTimeSource: self.currentTimeSource, 
                maxValue: self.maxValue, 

                // timing
                startTime: time, 
                attackTime: attackTime, 
                sustainTime: sustainTime, 
                releaseTime: releaseTime });


            var osc = self.context.createOscillator();
            osc.type = self.wave;

            osc.connect(envelope.gainNode);
            envelope.gainNode.connect(self.destinationNode);

            // Setup oscillator
            osc.frequency.value = freq || 440;

            envelope.trigger();

            var id = Date.now() + freq + time;

            osc.start(time);

            // Schedule stop
            osc.stop(time + attackTime + sustainTime + releaseTime);
            osc.onend = function noteEnd() {
                // onended clean up
                // note: this doesnt have to be fired only when stop() is fired since
                // it is called only when stop succeeds
                osc.disconnect();
                console.log('null', id);
                self.notes[id] = null;};} }, { key: 'currentTime', value: function currentTime() 


        {
            if (this.currentTimeSource && typeof this.currentTimeSource.currentTime === 'function') {
                return this.currentTimeSource.currentTime();} else 
            {
                return this.currentTimeSource.currentTime;}} }, { key: 'connect', value: function connect(


        node) {
            this.destinationNode.connect(node);} }]);return SingleOsc;})();exports.default = SingleOsc;
},{"./amplitude-envelope":1}],4:[function(require,module,exports){
'use strict';

var _singleOscillator = require('single-oscillator');

var _singleOscillator2 = _interopRequireDefault(_singleOscillator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Source:
// http://stackoverflow.com/a/5624139/630490
function hexToRgb(hex) {
   // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
   var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
   hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
   });

   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
   } : null;
}
function linerColorInterpolation(firstColor, secondColor, percentage) {
   var rgb1 = hexToRgb(firstColor);
   var rgb2 = hexToRgb(secondColor);

   return Math.floor(
   // Red
   Math.floor((rgb2.r - rgb1.r) * percentage + rgb1.r) * 0x010000 +
   // Green
   Math.floor((rgb2.g - rgb1.g) * percentage + rgb1.g) * 0x000100 +
   // Blue
   Math.floor((rgb2.b - rgb1.b) * percentage + rgb1.b) * 0x000001).toString(16);
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
   return Math.pow(2, (note - 49) / 12) * 440;
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

var osc = new _singleOscillator2.default({
   context: audio,
   attackTime: 0.1,
   sustainTime: 0.1,
   releaseTime: 0.075,
   maxValue: 1,

   // Osc
   wave: 'sine'
});

osc.connect(masterGain);

var rotation = 0;
var sideLength = Math.min(canvas.width, canvas.height) / 2;

var rate = 0.1;

var colors = ['#00aa23', '#37aaf0', '#24905b', '#bcdef2', '#90234c'];

var bMinor = genMinorScale(51).reverse().concat(genMinorScale(51 - 12).reverse());
var gEnig = genEnigmaticScale(47);
gEnig = gEnig.concat(gEnig.slice().reverse());

var startTime = audio.currentTime + 1;

var theScale = bMinor;

var _loop = function _loop(j) {
   var _loop2 = function _loop2(i) {
      window.setTimeout(function (time) {
         osc.play(noteToFreq(theScale[(1 + i) * (2 + j) % theScale.length]), time);
      }, 1000 * startTime - 150, startTime);

      // Draw rectangle
      amount = Math.PI * 23 / 43;
      //Math.PI * 23 / 43;

      window.setTimeout(function (rotateBy) {
         var scale = 0.930;
         ctx.scale(scale, scale);
         ctx.rotate(rotateBy);
         // ctx.rotate(Math.pow( -1 , ( j % 2 ) ) * rotateBy);

         // Increment further
         rotation += rotateBy;

         ctx.fillStyle = '#' + linerColorInterpolation('#F44645', '#32003D', (j * theScale.length + i) / (3 / 2 * theScale.length) % 1);

         ctx.fillRect(-sideLength / 2, -sideLength / 2, sideLength, sideLength);
      }, 1000 * startTime, amount);

      startTime += rate;
   };

   for (var i = 0; i < theScale.length; i++) {
      _loop2(i);
   }
};

for (var j = 0; j < 3; j++) {
   var amount;

   _loop(j);
}

},{"single-oscillator":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L2FtcGxpdHVkZS1lbnZlbG9wZS5qcyIsIi4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL2Rpc3QvZW52ZWxvcGUuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L2luZGV4LmpzIiwic3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQyxJQUFJLFlBQVksR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksV0FBVyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxVQUFVLEdBQUcsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU3N0IsaUJBQWlCLEdBQUcsQ0FBQyxZQUFZO0FBQzlCLFlBQVMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNwRixVQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTzs7O0FBQUMsQUFHdkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRTs7O0FBQUMsQUFHN0IsVUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ25FLFVBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNuQyxVQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDckMsVUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQzs7QUFFdkMsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUTs7O0FBQUMsQUFHakMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFDLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsV0FBVzs7O0FBR2hIO0FBQ0csYUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRTtBQUNyRixtQkFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNoRDtBQUNHLG1CQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsT0FBTzs7O0FBRy9GO0FBQ0csYUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixhQUFJLENBQUMsWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDckUscUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUN6QiwwQkFBYyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDOztBQUV0QyxhQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLGFBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFOzs7QUFBQyxBQUc1QixtQkFBVSxDQUFDLFlBQVk7QUFDcEIsZ0JBQUksUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRTtBQUNwRCx3QkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJO0FBQ25ELDZCQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7O0FBRXZDLG9CQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsb0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLFVBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUEsR0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8saUJBQWlCLENBQUMsQ0FBQyxDQUFBLEVBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLGlCQUFpQixDQUFDOzs7QUNsRHhMLFlBQVksQ0FBQyxJQUFJLFlBQVksR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksV0FBVyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLHNCQUFzQixHQUFHLENBQUMsWUFBWTtBQUM5eUIsWUFBUyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUN4RyxVQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsYUFBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWCxlQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQzs7QUFFaEQsVUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLEVBQUU7QUFDbEMsZUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7Ozs7QUFBQSxBQUkvQyxVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVE7OztBQUFDLEFBR3pCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDMUMsVUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxPQUFPOztBQUVwSTtBQUNHLGFBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELGFBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1RCxhQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLE9BQU87O0FBRXpJLFdBQUssRUFBRTtBQUNKLGFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLHNCQUFzQixDQUFDLENBQUMsQ0FBQSxFQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQzs7O0FDMUI5RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDN0VBLFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRTs7QUFFbkIsT0FBSSxjQUFjLEdBQUcsa0NBQWtDLENBQUM7QUFDeEQsTUFBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25ELGFBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDOztBQUVILE9BQUksTUFBTSxHQUFHLDJDQUEyQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRSxVQUFPLE1BQU0sR0FBRztBQUNaLE9BQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUMxQixPQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDMUIsT0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQzdCLEdBQUcsSUFBSSxDQUFDO0NBQ1o7QUFDRCxTQUFTLHVCQUF1QixDQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFHO0FBQ3JFLE9BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoQyxPQUFJLElBQUksR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRWpDLFVBQU8sSUFBSSxDQUFDLEtBQUs7O0FBRWhCLE9BQUksQ0FBQyxLQUFLLENBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUEsR0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBRSxHQUFHLFFBQVE7O0FBRWxFLE9BQUksQ0FBQyxLQUFLLENBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUEsR0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBRSxHQUFHLFFBQVE7O0FBRWxFLE9BQUksQ0FBQyxLQUFLLENBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUEsR0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBRSxHQUFHLFFBQVEsQ0FDbEUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDakI7O0FBRUQsU0FBUyxhQUFhLENBQUMsU0FBUyxFQUFFO0FBQy9CLE9BQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEIsUUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUIsUUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUIsUUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUIsUUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUIsUUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUIsUUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDM0IsVUFBTyxLQUFLLENBQUM7Q0FDZjtBQUNELFNBQVMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO0FBQ25DLE9BQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEIsUUFBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDMUIsUUFBSyxDQUFDLElB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cEIsTUFBTTs7U0FUTixDQUFDO0NBaUNWIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jzt2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHtmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7dmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7ZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO2lmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO319cmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO2lmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO3JldHVybiBDb25zdHJ1Y3Rvcjt9O30pKCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO3ZhciBfZW52ZWxvcGUgPSByZXF1aXJlKCcuL2VudmVsb3BlJyk7dmFyIF9lbnZlbG9wZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9lbnZlbG9wZSk7ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtyZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTt9ZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge2lmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTt9fXZhciBcblxuQW1wbGl0dWRlRW52ZWxvcGUgPSAoZnVuY3Rpb24gKCkge1xuICAgZnVuY3Rpb24gQW1wbGl0dWRlRW52ZWxvcGUoY29udGV4dCwgb3B0aW9ucykge19jbGFzc0NhbGxDaGVjayh0aGlzLCBBbXBsaXR1ZGVFbnZlbG9wZSk7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICAgIC8vIC0tLS0tIG9wdGlvbnMgLS0tLS1cbiAgICAgIHNlbGYub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIC8vIFRpbWluZ1xuICAgICAgc2VsZi5jdXJyZW50VGltZVNvdXJjZSA9IG9wdGlvbnMuY3VycmVudFRpbWVTb3VyY2UgfHwgc2VsZi5jb250ZXh0O1xuICAgICAgc2VsZi5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICAgIHNlbGYuYXR0YWNrVGltZSA9IG9wdGlvbnMuYXR0YWNrVGltZTtcbiAgICAgIHNlbGYuc3VzdGFpblRpbWUgPSBvcHRpb25zLnN1c3RhaW5UaW1lO1xuICAgICAgc2VsZi5yZWxlYXNlVGltZSA9IG9wdGlvbnMucmVsZWFzZVRpbWU7XG5cbiAgICAgIHNlbGYubWF4VmFsdWUgPSBvcHRpb25zLm1heFZhbHVlO1xuXG4gICAgICAvLyBDcmVhdGUgR2FpbiBOb2RlIGFuZCBmaXJzdCBFbnZlbG9wZVxuICAgICAgc2VsZi5nYWluTm9kZSA9IHNlbGYuY29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgICBzZWxmLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwO31fY3JlYXRlQ2xhc3MoQW1wbGl0dWRlRW52ZWxvcGUsIFt7IGtleTogJ2N1cnJlbnRUaW1lJywgdmFsdWU6IGZ1bmN0aW9uIGN1cnJlbnRUaW1lKCkgXG5cblxuICAgICAge1xuICAgICAgICAgaWYgKHRoaXMuY3VycmVudFRpbWVTb3VyY2UgJiYgdHlwZW9mIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lKCk7fSBlbHNlIFxuICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWU7fX0gfSwgeyBrZXk6ICd0cmlnZ2VyJywgdmFsdWU6IGZ1bmN0aW9uIHRyaWdnZXIoKSBcblxuXG4gICAgICB7XG4gICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgIHNlbGYucmlzZUVudmVsb3BlID0gbmV3IF9lbnZlbG9wZTIuZGVmYXVsdChzZWxmLmNvbnRleHQsIHNlbGYubWF4VmFsdWUsIHsgXG4gICAgICAgICAgICBzdGFydFRpbWU6IHNlbGYuc3RhcnRUaW1lLCBcbiAgICAgICAgICAgIHRyYW5zaXRpb25UaW1lOiBzZWxmLmF0dGFja1RpbWUgfSk7XG5cbiAgICAgICAgIHNlbGYucmlzZUVudmVsb3BlLmNvbm5lY3Qoc2VsZi5nYWluTm9kZS5nYWluKTtcbiAgICAgICAgIHNlbGYucmlzZUVudmVsb3BlLnRyaWdnZXIoKTtcblxuICAgICAgICAgLy8gU2NoZWR1bGUgcmVsZWFzZSBlbnZlbG9wZVxuICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZW52ZWxvcGUgPSBuZXcgX2VudmVsb3BlMi5kZWZhdWx0KHNlbGYuY29udGV4dCwgMCwgeyBcbiAgICAgICAgICAgICAgIHN0YXJ0VGltZTogc2VsZi5zdGFydFRpbWUgKyBzZWxmLnN1c3RhaW5UaW1lICogMTAwMCwgXG4gICAgICAgICAgICAgICB0cmFuc2l0aW9uVGltZTogc2VsZi5yZWxlYXNlVGltZSB9KTtcblxuICAgICAgICAgICAgZW52ZWxvcGUuY29ubmVjdChzZWxmLmdhaW5Ob2RlLmdhaW4pO1xuICAgICAgICAgICAgZW52ZWxvcGUudHJpZ2dlcigpO30sIFxuICAgICAgICAgKHNlbGYuc3RhcnRUaW1lIC0gc2VsZi5jdXJyZW50VGltZSgpKSAqIDEwMDAgKyBzZWxmLmF0dGFja1RpbWUgKiAxMDAwICsgc2VsZi5zdXN0YWluVGltZSAqIDEwMDAgLSAxMDApO30gfV0pO3JldHVybiBBbXBsaXR1ZGVFbnZlbG9wZTt9KSgpO2V4cG9ydHMuZGVmYXVsdCA9IEFtcGxpdHVkZUVudmVsb3BlOyIsIid1c2Ugc3RyaWN0Jzt2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHtmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7dmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7ZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO2lmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO319cmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO2lmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO3JldHVybiBDb25zdHJ1Y3Rvcjt9O30pKCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO2Z1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge3Rocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7fX12YXIgRW52ZWxvcGVFdmVudEdlbmVyYXRvciA9IChmdW5jdGlvbiAoKSB7XG4gICBmdW5jdGlvbiBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yKGNvbnRleHQsIGVuZFZhbHVlLCBvcHRpb25zKSB7X2NsYXNzQ2FsbENoZWNrKHRoaXMsIEVudmVsb3BlRXZlbnRHZW5lcmF0b3IpO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlmICghY29udGV4dCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdWRpb0NvbnRleHQgaXMgcmVxdWlyZWQnKTt9XG5cbiAgICAgIGlmICh0eXBlb2YgZW5kVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGVuZFZhbHVlIGlzIHJlcXVpcmVkJyk7fVxuXG5cbiAgICAgIC8vIFJlcXVpcmVkIHZhbHVlc1xuICAgICAgc2VsZi5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgIHNlbGYuZW5kVmFsdWUgPSBlbmRWYWx1ZTtcblxuICAgICAgLy8gT3B0aW9uYWwgdmFsdWVzXG4gICAgICBzZWxmLnN0YXJ0VGltZSA9IHNlbGYuY29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgIHNlbGYudHJhbnNpdGlvblRpbWUgPSBvcHRpb25zLnRyYW5zaXRpb25UaW1lIHx8IDAuMTt9X2NyZWF0ZUNsYXNzKEVudmVsb3BlRXZlbnRHZW5lcmF0b3IsIFt7IGtleTogJ3RyaWdnZXInLCB2YWx1ZTogZnVuY3Rpb24gdHJpZ2dlcigpIFxuXG4gICAgICB7XG4gICAgICAgICB0aGlzLnBhcmFtLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyh0aGlzLnN0YXJ0VGltZSk7XG4gICAgICAgICB0aGlzLnBhcmFtLnNldFZhbHVlQXRUaW1lKHRoaXMucGFyYW0udmFsdWUsIHRoaXMuc3RhcnRUaW1lKTtcbiAgICAgICAgIHRoaXMucGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5lbmRWYWx1ZSwgdGhpcy5zdGFydFRpbWUgKyB0aGlzLnRyYW5zaXRpb25UaW1lKTt9IH0sIHsga2V5OiAnY29ubmVjdCcsIHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0KFxuXG4gICAgICBwYXJhbSkge1xuICAgICAgICAgdGhpcy5wYXJhbSA9IHBhcmFtO30gfV0pO3JldHVybiBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yO30pKCk7ZXhwb3J0cy5kZWZhdWx0ID0gRW52ZWxvcGVFdmVudEdlbmVyYXRvcjsiLCIndXNlIHN0cmljdCc7dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7ZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7Zm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge3ZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07ZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO2Rlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTt9fXJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7aWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtyZXR1cm4gQ29uc3RydWN0b3I7fTt9KSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTt2YXIgX2FtcGxpdHVkZUVudmVsb3BlID0gcmVxdWlyZSgnLi9hbXBsaXR1ZGUtZW52ZWxvcGUnKTt2YXIgX2FtcGxpdHVkZUVudmVsb3BlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FtcGxpdHVkZUVudmVsb3BlKTtmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge3JldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9O31mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7aWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHt0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO319dmFyIFxuXG5TaW5nbGVPc2MgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNpbmdsZU9zYyhvcHRpb25zKSB7X2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNpbmdsZU9zYyk7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHRoaXMuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZVNvdXJjZSA9IG9wdGlvbnMuY3VycmVudFRpbWVTb3VyY2UgfHwgdGhpcy5jb250ZXh0O1xuXG4gICAgICAgIC8vIFRpbWluZyBwYXJhbXNcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICAgICAgdGhpcy5hdHRhY2tUaW1lID0gb3B0aW9ucy5hdHRhY2tUaW1lO1xuICAgICAgICB0aGlzLnN1c3RhaW5UaW1lID0gb3B0aW9ucy5zdXN0YWluVGltZTtcbiAgICAgICAgdGhpcy5yZWxlYXNlVGltZSA9IG9wdGlvbnMucmVsZWFzZVRpbWU7XG5cbiAgICAgICAgLy8gTm9uLXRpbWluZyBlbnZlbG9wIHBhcmFtXG4gICAgICAgIHRoaXMubWF4VmFsdWUgPSBvcHRpb25zLm1heFZhbHVlO1xuXG4gICAgICAgIC8vIE9zY2lsbGF0b3IgcGFyYW1cbiAgICAgICAgdGhpcy53YXZlID0gb3B0aW9ucy53YXZlIHx8ICdzYXd0b290aCc7XG5cbiAgICAgICAgdGhpcy5ub3RlcyA9IHt9O1xuXG4gICAgICAgIC8vIE1hc3RlciBnYWluIG5vZGVcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk5vZGUgPSB0aGlzLmNvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uTm9kZS5nYWluLnZhbHVlID0gMTt9X2NyZWF0ZUNsYXNzKFNpbmdsZU9zYywgW3sga2V5OiAncGxheScsIHZhbHVlOiBmdW5jdGlvbiBwbGF5KFxuXG5cbiAgICAgICAgZnJlcSwgdGltZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgYXR0YWNrVGltZSA9IHNlbGYuYXR0YWNrVGltZTtcbiAgICAgICAgICAgIHZhciBzdXN0YWluVGltZSA9IHNlbGYuc3VzdGFpblRpbWU7XG4gICAgICAgICAgICB2YXIgcmVsZWFzZVRpbWUgPSBzZWxmLnJlbGVhc2VUaW1lO1xuXG4gICAgICAgICAgICAvLyBTZXR1cCBlbnZlbG9wZVxuICAgICAgICAgICAgdmFyIGVudmVsb3BlID0gbmV3IF9hbXBsaXR1ZGVFbnZlbG9wZTIuZGVmYXVsdChzZWxmLmNvbnRleHQsIHsgXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWVTb3VyY2U6IHNlbGYuY3VycmVudFRpbWVTb3VyY2UsIFxuICAgICAgICAgICAgICAgIG1heFZhbHVlOiBzZWxmLm1heFZhbHVlLCBcblxuICAgICAgICAgICAgICAgIC8vIHRpbWluZ1xuICAgICAgICAgICAgICAgIHN0YXJ0VGltZTogdGltZSwgXG4gICAgICAgICAgICAgICAgYXR0YWNrVGltZTogYXR0YWNrVGltZSwgXG4gICAgICAgICAgICAgICAgc3VzdGFpblRpbWU6IHN1c3RhaW5UaW1lLCBcbiAgICAgICAgICAgICAgICByZWxlYXNlVGltZTogcmVsZWFzZVRpbWUgfSk7XG5cblxuICAgICAgICAgICAgdmFyIG9zYyA9IHNlbGYuY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgICAgICAgICBvc2MudHlwZSA9IHNlbGYud2F2ZTtcblxuICAgICAgICAgICAgb3NjLmNvbm5lY3QoZW52ZWxvcGUuZ2Fpbk5vZGUpO1xuICAgICAgICAgICAgZW52ZWxvcGUuZ2Fpbk5vZGUuY29ubmVjdChzZWxmLmRlc3RpbmF0aW9uTm9kZSk7XG5cbiAgICAgICAgICAgIC8vIFNldHVwIG9zY2lsbGF0b3JcbiAgICAgICAgICAgIG9zYy5mcmVxdWVuY3kudmFsdWUgPSBmcmVxIHx8IDQ0MDtcblxuICAgICAgICAgICAgZW52ZWxvcGUudHJpZ2dlcigpO1xuXG4gICAgICAgICAgICB2YXIgaWQgPSBEYXRlLm5vdygpICsgZnJlcSArIHRpbWU7XG5cbiAgICAgICAgICAgIG9zYy5zdGFydCh0aW1lKTtcblxuICAgICAgICAgICAgLy8gU2NoZWR1bGUgc3RvcFxuICAgICAgICAgICAgb3NjLnN0b3AodGltZSArIGF0dGFja1RpbWUgKyBzdXN0YWluVGltZSArIHJlbGVhc2VUaW1lKTtcbiAgICAgICAgICAgIG9zYy5vbmVuZCA9IGZ1bmN0aW9uIG5vdGVFbmQoKSB7XG4gICAgICAgICAgICAgICAgLy8gb25lbmRlZCBjbGVhbiB1cFxuICAgICAgICAgICAgICAgIC8vIG5vdGU6IHRoaXMgZG9lc250IGhhdmUgdG8gYmUgZmlyZWQgb25seSB3aGVuIHN0b3AoKSBpcyBmaXJlZCBzaW5jZVxuICAgICAgICAgICAgICAgIC8vIGl0IGlzIGNhbGxlZCBvbmx5IHdoZW4gc3RvcCBzdWNjZWVkc1xuICAgICAgICAgICAgICAgIG9zYy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ251bGwnLCBpZCk7XG4gICAgICAgICAgICAgICAgc2VsZi5ub3Rlc1tpZF0gPSBudWxsO307fSB9LCB7IGtleTogJ2N1cnJlbnRUaW1lJywgdmFsdWU6IGZ1bmN0aW9uIGN1cnJlbnRUaW1lKCkgXG5cblxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VGltZVNvdXJjZSAmJiB0eXBlb2YgdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lKCk7fSBlbHNlIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lO319IH0sIHsga2V5OiAnY29ubmVjdCcsIHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0KFxuXG5cbiAgICAgICAgbm9kZSkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk5vZGUuY29ubmVjdChub2RlKTt9IH1dKTtyZXR1cm4gU2luZ2xlT3NjO30pKCk7ZXhwb3J0cy5kZWZhdWx0ID0gU2luZ2xlT3NjOyIsImltcG9ydCBTaW5nbGVPc2MgZnJvbSAnc2luZ2xlLW9zY2lsbGF0b3InO1xuXG4vLyBTb3VyY2U6XG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81NjI0MTM5LzYzMDQ5MFxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4KSB7XG4gICAgLy8gRXhwYW5kIHNob3J0aGFuZCBmb3JtIChlLmcuIFwiMDNGXCIpIHRvIGZ1bGwgZm9ybSAoZS5nLiBcIjAwMzNGRlwiKVxuICAgIHZhciBzaG9ydGhhbmRSZWdleCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XG4gICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRoYW5kUmVnZXgsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIHtcbiAgICAgICAgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcbiAgICB9KTtcblxuICAgIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXG4gICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgfSA6IG51bGw7XG59XG5mdW5jdGlvbiBsaW5lckNvbG9ySW50ZXJwb2xhdGlvbiggZmlyc3RDb2xvciwgc2Vjb25kQ29sb3IsIHBlcmNlbnRhZ2UgKSB7XG4gICB2YXIgcmdiMSA9IGhleFRvUmdiKGZpcnN0Q29sb3IpO1xuICAgdmFyIHJnYjIgPSBoZXhUb1JnYihzZWNvbmRDb2xvcik7XG5cbiAgIHJldHVybiBNYXRoLmZsb29yKFxuICAgLy8gUmVkXG4gICAgTWF0aC5mbG9vciggKCByZ2IyLnIgLSByZ2IxLnIgKSAqIHBlcmNlbnRhZ2UgKyByZ2IxLnIgKSAqIDB4MDEwMDAwICtcbiAgIC8vIEdyZWVuXG4gICAgTWF0aC5mbG9vciggKCByZ2IyLmcgLSByZ2IxLmcgKSAqIHBlcmNlbnRhZ2UgKyByZ2IxLmcgKSAqIDB4MDAwMTAwICtcbiAgIC8vIEJsdWVcbiAgICBNYXRoLmZsb29yKCAoIHJnYjIuYiAtIHJnYjEuYiApICogcGVyY2VudGFnZSArIHJnYjEuYiApICogMHgwMDAwMDEgXG4gICApLnRvU3RyaW5nKDE2KTtcbn1cblxuZnVuY3Rpb24gZ2VuTWlub3JTY2FsZShzdGFydE5vdGUpIHtcbiAgIHZhciBzY2FsZSA9IFtdO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyAyKTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgMyk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDUpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyA3KTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgOCk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDEwKTtcbiAgIHJldHVybiBzY2FsZTtcbn1cbmZ1bmN0aW9uIGdlbkVuaWdtYXRpY1NjYWxlKHN0YXJ0Tm90ZSkge1xuICAgdmFyIHNjYWxlID0gW107XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDEpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyA0KTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgNyk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDkpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyAxMSk7XG4gICByZXR1cm4gc2NhbGU7XG59XG5mdW5jdGlvbiBub3RlVG9GcmVxKG5vdGUpIHtcbiAgIHJldHVybiBNYXRoLnBvdyggMiwgKCBub3RlIC0gNDkgICkgLyAxMiAgKSAqIDQ0MDtcbn1cblxudmFyIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xudmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5jdHgudHJhbnNsYXRlKGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyKTtcblxudmFyIGF1ZGlvID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcblxudmFyIG1hc3RlckdhaW4gPSBhdWRpby5jcmVhdGVHYWluKCk7XG5tYXN0ZXJHYWluLmNvbm5lY3QoYXVkaW8uZGVzdGluYXRpb24pO1xubWFzdGVyR2Fpbi5nYWluLnZhbHVlID0gMC4wO1xuXG52YXIgb3NjID0gbmV3IFNpbmdsZU9zYyh7XG4gICBjb250ZXh0OiBhdWRpbyxcbiAgIGF0dGFja1RpbWU6IDAuMSxcbiAgIHN1c3RhaW5UaW1lOiAwLjEsXG4gICByZWxlYXNlVGltZTogMC4wNzUsXG4gICBtYXhWYWx1ZTogMSxcblxuICAgLy8gT3NjXG4gICB3YXZlOiAnc2luZScsXG59KTtcblxub3NjLmNvbm5lY3QobWFzdGVyR2Fpbik7XG5cbnZhciByb3RhdGlvbiA9IDA7XG52YXIgc2lkZUxlbmd0aCA9IE1hdGgubWluKCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKSAvIDI7XG5cbnZhciByYXRlID0gMC4xO1xuXG52YXIgY29sb3JzID0gW1xuICAgJyMwMGFhMjMnLFxuICAgJyMzN2FhZjAnLFxuICAgJyMyNDkwNWInLFxuICAgJyNiY2RlZjInLFxuICAgJyM5MDIzNGMnLFxuXTtcblxudmFyIGJNaW5vciA9IGdlbk1pbm9yU2NhbGUoNTEpLnJldmVyc2UoKVxuICAgLmNvbmNhdChnZW5NaW5vclNjYWxlKDUxLTEyKS5yZXZlcnNlKCkpO1xudmFyIGdFbmlnID0gZ2VuRW5pZ21hdGljU2NhbGUoNDcpO1xuZ0VuaWcgPSBnRW5pZy5jb25jYXQoZ0VuaWcuc2xpY2UoKS5yZXZlcnNlKCkpO1xuXG52YXIgc3RhcnRUaW1lID0gYXVkaW8uY3VycmVudFRpbWUgKyAxO1xuXG52YXIgdGhlU2NhbGUgPSBiTWlub3I7XG5cbmZvciAoIGxldCBqID0gMDsgaiA8IDM7IGogKysgKXtcbiAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoZVNjYWxlLmxlbmd0aDsgaSsrICkge1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoIGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgIG9zYy5wbGF5KG5vdGVUb0ZyZXEodGhlU2NhbGVbXG4gICAgICAgICAgICAoICggMStpICkgKiAoIDIraiApICkgJSB0aGVTY2FsZS5sZW5ndGhcbiAgICAgICAgIF0pLCB0aW1lKTtcbiAgICAgIH0sICggMTAwMCAqIHN0YXJ0VGltZSApIC0gMTUwLCBzdGFydFRpbWUpO1xuXG4gICAgICAvLyBEcmF3IHJlY3RhbmdsZVxuICAgICAgdmFyIGFtb3VudCA9IE1hdGguUEkgKiAyMyAvNDM7XG4gICAgICAvL01hdGguUEkgKiAyMyAvIDQzO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoIChyb3RhdGVCeSkgPT4ge1xuICAgICAgICAgdmFyIHNjYWxlID0gMC45MzA7XG4gICAgICAgICBjdHguc2NhbGUoc2NhbGUsIHNjYWxlKTtcbiAgICAgICAgIGN0eC5yb3RhdGUocm90YXRlQnkpO1xuICAgICAgICAgLy8gY3R4LnJvdGF0ZShNYXRoLnBvdyggLTEgLCAoIGogJSAyICkgKSAqIHJvdGF0ZUJ5KTtcblxuICAgICAgICAgLy8gSW5jcmVtZW50IGZ1cnRoZXJcbiAgICAgICAgIHJvdGF0aW9uICs9IHJvdGF0ZUJ5O1xuXG4gICAgICAgICBjdHguZmlsbFN0eWxlID0gJyMnICsgbGluZXJDb2xvckludGVycG9sYXRpb24oXG4gICAgICAgICAgICAnI0Y0NDY0NScsICcjMzIwMDNEJyxcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICggaiAqIHRoZVNjYWxlLmxlbmd0aCArIGkgKSAvXG4gICAgICAgICAgICAgICAgICAoIDMgLyAyICogdGhlU2NhbGUubGVuZ3RoIClcbiAgICAgICAgICAgICkgJSAxXG4gICAgICAgICApO1xuXG4gICAgICAgICBjdHguZmlsbFJlY3QoLXNpZGVMZW5ndGggLyAyLCAtc2lkZUxlbmd0aCAvIDIsIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgpO1xuICAgICAgfSwgMTAwMCogc3RhcnRUaW1lLCBhbW91bnQpO1xuXG4gICAgICBzdGFydFRpbWUgKz0gcmF0ZTtcbiAgIH1cbn1cbiJdfQ==

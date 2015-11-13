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

function noteToFreq(note) {
   return Math.pow(2, (note - 49) / 12) * 440;
}

var audio = new window.AudioContext();

var masterGain = audio.createGain();
masterGain.connect(audio.destination);
masterGain.gain.value = 0.7;

var osc = new _singleOscillator2.default({
   context: audio,
   attackTime: 0.05,
   sustainTime: 0.1,
   releaseTime: 0.075,
   maxValue: 1,

   // Osc
   wave: 'sine'
});

var startTime = audio.currentTime + 1;
osc.connect(masterGain);

for (var j = 0; j < 10; j++) {
   for (var i = 0; i < 10; i++) {
      osc.play(noteToFreq(49 + 3 * i), startTime);
      startTime += 0.05;
   }
}

},{"single-oscillator":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L2FtcGxpdHVkZS1lbnZlbG9wZS5qcyIsIi4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL2Rpc3QvZW52ZWxvcGUuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L2luZGV4LmpzIiwic3JjL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQyxJQUFJLFlBQVksR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksV0FBVyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxVQUFVLEdBQUcsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU3N0IsaUJBQWlCLEdBQUcsQ0FBQyxZQUFZO0FBQzlCLFlBQVMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNwRixVQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTzs7O0FBQUMsQUFHdkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRTs7O0FBQUMsQUFHN0IsVUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ25FLFVBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNuQyxVQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDckMsVUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQzs7QUFFdkMsVUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUTs7O0FBQUMsQUFHakMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFDLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsV0FBVzs7O0FBR2hIO0FBQ0csYUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRTtBQUNyRixtQkFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUNoRDtBQUNHLG1CQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsT0FBTzs7O0FBRy9GO0FBQ0csYUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixhQUFJLENBQUMsWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDckUscUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUN6QiwwQkFBYyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDOztBQUV0QyxhQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLGFBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFOzs7QUFBQyxBQUc1QixtQkFBVSxDQUFDLFlBQVk7QUFDcEIsZ0JBQUksUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRTtBQUNwRCx3QkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJO0FBQ25ELDZCQUFjLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7O0FBRXZDLG9CQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsb0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLFVBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUEsR0FBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8saUJBQWlCLENBQUMsQ0FBQyxDQUFBLEVBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLGlCQUFpQixDQUFDOzs7QUNsRHhMLFlBQVksQ0FBQyxJQUFJLFlBQVksR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLFVBQVUsRUFBRSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksV0FBVyxFQUFFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLEVBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLHNCQUFzQixHQUFHLENBQUMsWUFBWTtBQUM5eUIsWUFBUyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUN4RyxVQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsYUFBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWCxlQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQzs7QUFFaEQsVUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLEVBQUU7QUFDbEMsZUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7Ozs7QUFBQSxBQUkvQyxVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVE7OztBQUFDLEFBR3pCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDMUMsVUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxPQUFPOztBQUVwSTtBQUNHLGFBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELGFBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1RCxhQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLE9BQU87O0FBRXpJLFdBQUssRUFBRTtBQUNKLGFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLHNCQUFzQixDQUFDLENBQUMsQ0FBQSxFQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQzs7O0FDMUI5RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQy9FQSxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDdkIsVUFBTyxJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsRUFBRSxDQUFFLElBQUksR0FBRyxFQUFFLENBQUEsR0FBTSxFQUFFLENBQUcsR0FBRyxHQUFHLENBQUM7Q0FDbkQ7O0FBRUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7O0FBRXRDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNwQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7O0FBRTVCLElBQUksR0FBRyxHQUFHLCtCQUFjO0FBQ3JCLFVBQU8sRUFBRSxLQUFLO0FBQ2QsYUFBVSxFQUFFLElBQUk7QUFDaEIsY0FBVyxFQUFFLEdBQUc7QUFDaEIsY0FBVyxFQUFFLEtBQUs7QUFDbEIsV0FBUSxFQUFFLENBQUM7OztBQUdYLE9BQUksRUFBRSxNQUFNO0NBQ2QsQ0FBQyxDQUFDOztBQUVILElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXhCLEtBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFHLEVBQUU7QUFDNUIsUUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRztBQUM1QixTQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLGVBQVMsSUFBSSxJQUFJLENBQUM7SUFDcEI7Q0FDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7ZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7Zm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge3ZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07ZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO2Rlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTt9fXJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7aWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtyZXR1cm4gQ29uc3RydWN0b3I7fTt9KSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTt2YXIgX2VudmVsb3BlID0gcmVxdWlyZSgnLi9lbnZlbG9wZScpO3ZhciBfZW52ZWxvcGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZW52ZWxvcGUpO2Z1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7cmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07fWZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge3Rocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7fX12YXIgXG5cbkFtcGxpdHVkZUVudmVsb3BlID0gKGZ1bmN0aW9uICgpIHtcbiAgIGZ1bmN0aW9uIEFtcGxpdHVkZUVudmVsb3BlKGNvbnRleHQsIG9wdGlvbnMpIHtfY2xhc3NDYWxsQ2hlY2sodGhpcywgQW1wbGl0dWRlRW52ZWxvcGUpO1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxmLmNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgICAvLyAtLS0tLSBvcHRpb25zIC0tLS0tXG4gICAgICBzZWxmLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAvLyBUaW1pbmdcbiAgICAgIHNlbGYuY3VycmVudFRpbWVTb3VyY2UgPSBvcHRpb25zLmN1cnJlbnRUaW1lU291cmNlIHx8IHNlbGYuY29udGV4dDtcbiAgICAgIHNlbGYuc3RhcnRUaW1lID0gb3B0aW9ucy5zdGFydFRpbWU7XG4gICAgICBzZWxmLmF0dGFja1RpbWUgPSBvcHRpb25zLmF0dGFja1RpbWU7XG4gICAgICBzZWxmLnN1c3RhaW5UaW1lID0gb3B0aW9ucy5zdXN0YWluVGltZTtcbiAgICAgIHNlbGYucmVsZWFzZVRpbWUgPSBvcHRpb25zLnJlbGVhc2VUaW1lO1xuXG4gICAgICBzZWxmLm1heFZhbHVlID0gb3B0aW9ucy5tYXhWYWx1ZTtcblxuICAgICAgLy8gQ3JlYXRlIEdhaW4gTm9kZSBhbmQgZmlyc3QgRW52ZWxvcGVcbiAgICAgIHNlbGYuZ2Fpbk5vZGUgPSBzZWxmLmNvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgICAgc2VsZi5nYWluTm9kZS5nYWluLnZhbHVlID0gMDt9X2NyZWF0ZUNsYXNzKEFtcGxpdHVkZUVudmVsb3BlLCBbeyBrZXk6ICdjdXJyZW50VGltZScsIHZhbHVlOiBmdW5jdGlvbiBjdXJyZW50VGltZSgpIFxuXG5cbiAgICAgIHtcbiAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRUaW1lU291cmNlICYmIHR5cGVvZiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSgpO30gZWxzZSBcbiAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lO319IH0sIHsga2V5OiAndHJpZ2dlcicsIHZhbHVlOiBmdW5jdGlvbiB0cmlnZ2VyKCkgXG5cblxuICAgICAge1xuICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICBzZWxmLnJpc2VFbnZlbG9wZSA9IG5ldyBfZW52ZWxvcGUyLmRlZmF1bHQoc2VsZi5jb250ZXh0LCBzZWxmLm1heFZhbHVlLCB7IFxuICAgICAgICAgICAgc3RhcnRUaW1lOiBzZWxmLnN0YXJ0VGltZSwgXG4gICAgICAgICAgICB0cmFuc2l0aW9uVGltZTogc2VsZi5hdHRhY2tUaW1lIH0pO1xuXG4gICAgICAgICBzZWxmLnJpc2VFbnZlbG9wZS5jb25uZWN0KHNlbGYuZ2Fpbk5vZGUuZ2Fpbik7XG4gICAgICAgICBzZWxmLnJpc2VFbnZlbG9wZS50cmlnZ2VyKCk7XG5cbiAgICAgICAgIC8vIFNjaGVkdWxlIHJlbGVhc2UgZW52ZWxvcGVcbiAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVudmVsb3BlID0gbmV3IF9lbnZlbG9wZTIuZGVmYXVsdChzZWxmLmNvbnRleHQsIDAsIHsgXG4gICAgICAgICAgICAgICBzdGFydFRpbWU6IHNlbGYuc3RhcnRUaW1lICsgc2VsZi5zdXN0YWluVGltZSAqIDEwMDAsIFxuICAgICAgICAgICAgICAgdHJhbnNpdGlvblRpbWU6IHNlbGYucmVsZWFzZVRpbWUgfSk7XG5cbiAgICAgICAgICAgIGVudmVsb3BlLmNvbm5lY3Qoc2VsZi5nYWluTm9kZS5nYWluKTtcbiAgICAgICAgICAgIGVudmVsb3BlLnRyaWdnZXIoKTt9LCBcbiAgICAgICAgIChzZWxmLnN0YXJ0VGltZSAtIHNlbGYuY3VycmVudFRpbWUoKSkgKiAxMDAwICsgc2VsZi5hdHRhY2tUaW1lICogMTAwMCArIHNlbGYuc3VzdGFpblRpbWUgKiAxMDAwIC0gMTAwKTt9IH1dKTtyZXR1cm4gQW1wbGl0dWRlRW52ZWxvcGU7fSkoKTtleHBvcnRzLmRlZmF1bHQgPSBBbXBsaXR1ZGVFbnZlbG9wZTsiLCIndXNlIHN0cmljdCc7dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7ZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7Zm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge3ZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07ZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO2Rlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTt9fXJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7aWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtyZXR1cm4gQ29uc3RydWN0b3I7fTt9KSgpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7aWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHt0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO319dmFyIEVudmVsb3BlRXZlbnRHZW5lcmF0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgZnVuY3Rpb24gRW52ZWxvcGVFdmVudEdlbmVyYXRvcihjb250ZXh0LCBlbmRWYWx1ZSwgb3B0aW9ucykge19jbGFzc0NhbGxDaGVjayh0aGlzLCBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXVkaW9Db250ZXh0IGlzIHJlcXVpcmVkJyk7fVxuXG4gICAgICBpZiAodHlwZW9mIGVuZFZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBlbmRWYWx1ZSBpcyByZXF1aXJlZCcpO31cblxuXG4gICAgICAvLyBSZXF1aXJlZCB2YWx1ZXNcbiAgICAgIHNlbGYuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICBzZWxmLmVuZFZhbHVlID0gZW5kVmFsdWU7XG5cbiAgICAgIC8vIE9wdGlvbmFsIHZhbHVlc1xuICAgICAgc2VsZi5zdGFydFRpbWUgPSBzZWxmLmNvbnRleHQuY3VycmVudFRpbWU7XG4gICAgICBzZWxmLnRyYW5zaXRpb25UaW1lID0gb3B0aW9ucy50cmFuc2l0aW9uVGltZSB8fCAwLjE7fV9jcmVhdGVDbGFzcyhFbnZlbG9wZUV2ZW50R2VuZXJhdG9yLCBbeyBrZXk6ICd0cmlnZ2VyJywgdmFsdWU6IGZ1bmN0aW9uIHRyaWdnZXIoKSBcblxuICAgICAge1xuICAgICAgICAgdGhpcy5wYXJhbS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXModGhpcy5zdGFydFRpbWUpO1xuICAgICAgICAgdGhpcy5wYXJhbS5zZXRWYWx1ZUF0VGltZSh0aGlzLnBhcmFtLnZhbHVlLCB0aGlzLnN0YXJ0VGltZSk7XG4gICAgICAgICB0aGlzLnBhcmFtLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZW5kVmFsdWUsIHRoaXMuc3RhcnRUaW1lICsgdGhpcy50cmFuc2l0aW9uVGltZSk7fSB9LCB7IGtleTogJ2Nvbm5lY3QnLCB2YWx1ZTogZnVuY3Rpb24gY29ubmVjdChcblxuICAgICAgcGFyYW0pIHtcbiAgICAgICAgIHRoaXMucGFyYW0gPSBwYXJhbTt9IH1dKTtyZXR1cm4gRW52ZWxvcGVFdmVudEdlbmVyYXRvcjt9KSgpO2V4cG9ydHMuZGVmYXVsdCA9IEVudmVsb3BlRXZlbnRHZW5lcmF0b3I7IiwiJ3VzZSBzdHJpY3QnO3ZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkge2Z1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge2ZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHt2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO2Rlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7aWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7fX1yZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge2lmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7aWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7cmV0dXJuIENvbnN0cnVjdG9yO307fSkoKTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7dmFyIF9hbXBsaXR1ZGVFbnZlbG9wZSA9IHJlcXVpcmUoJy4vYW1wbGl0dWRlLWVudmVsb3BlJyk7dmFyIF9hbXBsaXR1ZGVFbnZlbG9wZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hbXBsaXR1ZGVFbnZlbG9wZSk7ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtyZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTt9ZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge2lmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTt9fXZhciBcblxuU2luZ2xlT3NjID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTaW5nbGVPc2Mob3B0aW9ucykge19jbGFzc0NhbGxDaGVjayh0aGlzLCBTaW5nbGVPc2MpO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQ7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWVTb3VyY2UgPSBvcHRpb25zLmN1cnJlbnRUaW1lU291cmNlIHx8IHRoaXMuY29udGV4dDtcblxuICAgICAgICAvLyBUaW1pbmcgcGFyYW1zXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gb3B0aW9ucy5zdGFydFRpbWU7XG4gICAgICAgIHRoaXMuYXR0YWNrVGltZSA9IG9wdGlvbnMuYXR0YWNrVGltZTtcbiAgICAgICAgdGhpcy5zdXN0YWluVGltZSA9IG9wdGlvbnMuc3VzdGFpblRpbWU7XG4gICAgICAgIHRoaXMucmVsZWFzZVRpbWUgPSBvcHRpb25zLnJlbGVhc2VUaW1lO1xuXG4gICAgICAgIC8vIE5vbi10aW1pbmcgZW52ZWxvcCBwYXJhbVxuICAgICAgICB0aGlzLm1heFZhbHVlID0gb3B0aW9ucy5tYXhWYWx1ZTtcblxuICAgICAgICAvLyBPc2NpbGxhdG9yIHBhcmFtXG4gICAgICAgIHRoaXMud2F2ZSA9IG9wdGlvbnMud2F2ZSB8fCAnc2F3dG9vdGgnO1xuXG4gICAgICAgIHRoaXMubm90ZXMgPSB7fTtcblxuICAgICAgICAvLyBNYXN0ZXIgZ2FpbiBub2RlXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25Ob2RlID0gdGhpcy5jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbk5vZGUuZ2Fpbi52YWx1ZSA9IDE7fV9jcmVhdGVDbGFzcyhTaW5nbGVPc2MsIFt7IGtleTogJ3BsYXknLCB2YWx1ZTogZnVuY3Rpb24gcGxheShcblxuXG4gICAgICAgIGZyZXEsIHRpbWUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgdmFyIGF0dGFja1RpbWUgPSBzZWxmLmF0dGFja1RpbWU7XG4gICAgICAgICAgICB2YXIgc3VzdGFpblRpbWUgPSBzZWxmLnN1c3RhaW5UaW1lO1xuICAgICAgICAgICAgdmFyIHJlbGVhc2VUaW1lID0gc2VsZi5yZWxlYXNlVGltZTtcblxuICAgICAgICAgICAgLy8gU2V0dXAgZW52ZWxvcGVcbiAgICAgICAgICAgIHZhciBlbnZlbG9wZSA9IG5ldyBfYW1wbGl0dWRlRW52ZWxvcGUyLmRlZmF1bHQoc2VsZi5jb250ZXh0LCB7IFxuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lU291cmNlOiBzZWxmLmN1cnJlbnRUaW1lU291cmNlLCBcbiAgICAgICAgICAgICAgICBtYXhWYWx1ZTogc2VsZi5tYXhWYWx1ZSwgXG5cbiAgICAgICAgICAgICAgICAvLyB0aW1pbmdcbiAgICAgICAgICAgICAgICBzdGFydFRpbWU6IHRpbWUsIFxuICAgICAgICAgICAgICAgIGF0dGFja1RpbWU6IGF0dGFja1RpbWUsIFxuICAgICAgICAgICAgICAgIHN1c3RhaW5UaW1lOiBzdXN0YWluVGltZSwgXG4gICAgICAgICAgICAgICAgcmVsZWFzZVRpbWU6IHJlbGVhc2VUaW1lIH0pO1xuXG5cbiAgICAgICAgICAgIHZhciBvc2MgPSBzZWxmLmNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgICAgICAgb3NjLnR5cGUgPSBzZWxmLndhdmU7XG5cbiAgICAgICAgICAgIG9zYy5jb25uZWN0KGVudmVsb3BlLmdhaW5Ob2RlKTtcbiAgICAgICAgICAgIGVudmVsb3BlLmdhaW5Ob2RlLmNvbm5lY3Qoc2VsZi5kZXN0aW5hdGlvbk5vZGUpO1xuXG4gICAgICAgICAgICAvLyBTZXR1cCBvc2NpbGxhdG9yXG4gICAgICAgICAgICBvc2MuZnJlcXVlbmN5LnZhbHVlID0gZnJlcSB8fCA0NDA7XG5cbiAgICAgICAgICAgIGVudmVsb3BlLnRyaWdnZXIoKTtcblxuICAgICAgICAgICAgdmFyIGlkID0gRGF0ZS5ub3coKSArIGZyZXEgKyB0aW1lO1xuXG4gICAgICAgICAgICBvc2Muc3RhcnQodGltZSk7XG5cbiAgICAgICAgICAgIC8vIFNjaGVkdWxlIHN0b3BcbiAgICAgICAgICAgIG9zYy5zdG9wKHRpbWUgKyBhdHRhY2tUaW1lICsgc3VzdGFpblRpbWUgKyByZWxlYXNlVGltZSk7XG4gICAgICAgICAgICBvc2Mub25lbmQgPSBmdW5jdGlvbiBub3RlRW5kKCkge1xuICAgICAgICAgICAgICAgIC8vIG9uZW5kZWQgY2xlYW4gdXBcbiAgICAgICAgICAgICAgICAvLyBub3RlOiB0aGlzIGRvZXNudCBoYXZlIHRvIGJlIGZpcmVkIG9ubHkgd2hlbiBzdG9wKCkgaXMgZmlyZWQgc2luY2VcbiAgICAgICAgICAgICAgICAvLyBpdCBpcyBjYWxsZWQgb25seSB3aGVuIHN0b3Agc3VjY2VlZHNcbiAgICAgICAgICAgICAgICBvc2MuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdudWxsJywgaWQpO1xuICAgICAgICAgICAgICAgIHNlbGYubm90ZXNbaWRdID0gbnVsbDt9O30gfSwgeyBrZXk6ICdjdXJyZW50VGltZScsIHZhbHVlOiBmdW5jdGlvbiBjdXJyZW50VGltZSgpIFxuXG5cbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFRpbWVTb3VyY2UgJiYgdHlwZW9mIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSgpO30gZWxzZSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZTt9fSB9LCB7IGtleTogJ2Nvbm5lY3QnLCB2YWx1ZTogZnVuY3Rpb24gY29ubmVjdChcblxuXG4gICAgICAgIG5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb25Ob2RlLmNvbm5lY3Qobm9kZSk7fSB9XSk7cmV0dXJuIFNpbmdsZU9zYzt9KSgpO2V4cG9ydHMuZGVmYXVsdCA9IFNpbmdsZU9zYzsiLCJpbXBvcnQgU2luZ2xlT3NjIGZyb20gJ3NpbmdsZS1vc2NpbGxhdG9yJztcblxuZnVuY3Rpb24gbm90ZVRvRnJlcShub3RlKSB7XG4gICByZXR1cm4gTWF0aC5wb3coIDIsICggbm90ZSAtIDQ5ICApIC8gMTIgICkgKiA0NDA7XG59XG5cbnZhciBhdWRpbyA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG5cbnZhciBtYXN0ZXJHYWluID0gYXVkaW8uY3JlYXRlR2FpbigpO1xubWFzdGVyR2Fpbi5jb25uZWN0KGF1ZGlvLmRlc3RpbmF0aW9uKTtcbm1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IDAuNztcblxudmFyIG9zYyA9IG5ldyBTaW5nbGVPc2Moe1xuICAgY29udGV4dDogYXVkaW8sXG4gICBhdHRhY2tUaW1lOiAwLjA1LFxuICAgc3VzdGFpblRpbWU6IDAuMSxcbiAgIHJlbGVhc2VUaW1lOiAwLjA3NSxcbiAgIG1heFZhbHVlOiAxLFxuXG4gICAvLyBPc2NcbiAgIHdhdmU6ICdzaW5lJyxcbn0pO1xuXG52YXIgc3RhcnRUaW1lID0gYXVkaW8uY3VycmVudFRpbWUgKyAxO1xub3NjLmNvbm5lY3QobWFzdGVyR2Fpbik7XG5cbmZvciAoIGxldCBqID0gMDsgaiA8IDEwOyBqICsrICl7XG4gICBmb3IgKCBsZXQgaSA9IDA7IGkgPCAxMDsgaSsrICkge1xuICAgICAgb3NjLnBsYXkobm90ZVRvRnJlcSg0OSArIDMqaSksIHN0YXJ0VGltZSk7XG4gICAgICBzdGFydFRpbWUgKz0gMC4wNTtcbiAgIH1cbn1cbiJdfQ==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.amplitudeEnv = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _dereq_('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":2}],2:[function(_dereq_,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _dereq_('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":3}],3:[function(_dereq_,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],4:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = _dereq_('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('envelope-event');

var EnvelopeEventGenerator = function () {
  function EnvelopeEventGenerator(context, startValue, endValue, options) {
    _classCallCheck(this, EnvelopeEventGenerator);

    options = options || {};

    if (!context) {
      throw new Error('AudioContext is required');
    }
    if (typeof startValue === 'undefined') {
      throw new Error('An startValue is required');
    }
    if (typeof endValue === 'undefined') {
      throw new Error('An endValue is required');
    }

    // Required values
    this.context = context;
    this.startValue = startValue;
    this.endValue = endValue;

    // Optional values
    this.startTime = options.startTime || this.context.currentTime;
    this.transitionTime = options.transitionTime || 0.1;

    this.curveType = options.curveType;
  }

  _createClass(EnvelopeEventGenerator, [{
    key: 'getEqualPowerCurve',
    value: function getEqualPowerCurve(scale, offset) {
      scale = scale || 1;
      offset = offset || 0;

      var curveLength = this.context.sampleRate;
      var curve = new Float32Array(curveLength);

      for (var i = 0; i < curveLength; i++) {
        curve[i] = scale * Math.cos(Math.PI * (i / curveLength + 1) / 4) + offset;
      }

      return curve;
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      this.param.cancelScheduledValues(this.startTime);
      this.param.setValueAtTime(this.startValue, this.startTime);
      switch (this.curveType) {
        case 'equalPowerFadeIn':
          var scale = Math.abs(this.endValue - this.startValue);
          var offset = this.startValue;

          this.param.setValueCurveAtTime(this.getEqualPowerCurve(scale, offset).reverse(), this.startTime, this.transitionTime);
          break;
        case 'equalPowerFadeOut':
          var scale = Math.abs(this.startValue - this.endValue);
          var offset = this.endValue;

          this.param.setValueCurveAtTime(this.getEqualPowerCurve(scale, offset), this.startTime, this.transitionTime);
          break;
        case 'linear':
        default:
          this.param.linearRampToValueAtTime(this.endValue, this.startTime + this.transitionTime);
          break;
      }

      debug('new env');
      debug('current time', this.context.currentTime);
      debug('startTime', this.startTime, 'transitionTime', this.transitionTime, 'startValu', this.startValue, 'endValue', this.endValue);
    }
  }, {
    key: 'connect',
    value: function connect(param) {
      this.param = param;
    }
  }]);

  return EnvelopeEventGenerator;
}();

exports.default = EnvelopeEventGenerator;

},{"debug":1}],5:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _envelope = _dereq_('./envelope.js');

var _envelope2 = _interopRequireDefault(_envelope);

var _debug = _dereq_('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('amplitude-envelope');

var AmplitudeEnvelope = function () {
  function AmplitudeEnvelope(context, options) {
    _classCallCheck(this, AmplitudeEnvelope);

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

    // Curve
    self.attackCurveType = options.attackCurveType || 'linear';
    self.releaseCurveType = options.releaseCurveType || 'linear';

    // Create Gain Node and first Envelope
    self.gainNode = self.context.createGain();
    self.gainNode.gain.value = 0;
  }

  _createClass(AmplitudeEnvelope, [{
    key: 'currentTime',
    value: function currentTime() {
      if (this.currentTimeSource && typeof this.currentTimeSource.currentTime === 'function') {
        return this.currentTimeSource.currentTime();
      } else {
        return this.currentTimeSource.currentTime;
      }
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      var self = this;

      self.riseEnvelope = new _envelope2.default(self.context, 0, self.maxValue, {
        startTime: self.startTime,
        transitionTime: self.attackTime,
        curveType: self.attackCurveType
      });
      self.riseEnvelope.connect(self.gainNode.gain);
      self.riseEnvelope.trigger();

      debug('amp env');
      debug('startTime', self.startTime, 'attackTime', self.attackTime, 'sustainTime', self.sustainTime, 'releaseTime', self.releaseTime);

      // Schedule release envelope
      var envelope = new _envelope2.default(self.context, self.maxValue, 0, {
        startTime: self.startTime + self.attackTime + self.sustainTime,
        transitionTime: self.releaseTime,
        curveType: self.releaseCurveType
      });
      envelope.connect(self.gainNode.gain);
      envelope.trigger();
    }
  }]);

  return AmplitudeEnvelope;
}();

exports.default = AmplitudeEnvelope;

},{"./envelope.js":4,"debug":1}]},{},[5])(5)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.singleOsc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.amplitudeEnv = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _dereq_('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":2}],2:[function(_dereq_,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _dereq_('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":3}],3:[function(_dereq_,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],4:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = _dereq_('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('envelope-event');

var EnvelopeEventGenerator = function () {
  function EnvelopeEventGenerator(context, startValue, endValue, options) {
    _classCallCheck(this, EnvelopeEventGenerator);

    options = options || {};

    if (!context) {
      throw new Error('AudioContext is required');
    }
    if (typeof startValue === 'undefined') {
      throw new Error('An startValue is required');
    }
    if (typeof endValue === 'undefined') {
      throw new Error('An endValue is required');
    }

    // Required values
    this.context = context;
    this.startValue = startValue;
    this.endValue = endValue;

    // Optional values
    this.startTime = options.startTime || this.context.currentTime;
    this.transitionTime = options.transitionTime || 0.1;

    this.curveType = options.curveType;
  }

  _createClass(EnvelopeEventGenerator, [{
    key: 'getEqualPowerCurve',
    value: function getEqualPowerCurve(scale, offset) {
      scale = scale || 1;
      offset = offset || 0;

      var curveLength = this.context.sampleRate;
      var curve = new Float32Array(curveLength);

      for (var i = 0; i < curveLength; i++) {
        curve[i] = scale * Math.cos(Math.PI * (i / curveLength + 1) / 4) + offset;
      }

      return curve;
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      this.param.cancelScheduledValues(this.startTime);
      this.param.setValueAtTime(this.startValue, this.startTime);
      switch (this.curveType) {
        case 'equalPowerFadeIn':
          var scale = Math.abs(this.endValue - this.startValue);
          var offset = this.startValue;

          this.param.setValueCurveAtTime(this.getEqualPowerCurve(scale, offset).reverse(), this.startTime, this.transitionTime);
          break;
        case 'equalPowerFadeOut':
          var scale = Math.abs(this.startValue - this.endValue);
          var offset = this.endValue;

          this.param.setValueCurveAtTime(this.getEqualPowerCurve(scale, offset), this.startTime, this.transitionTime);
          break;
        case 'linear':
        default:
          this.param.linearRampToValueAtTime(this.endValue, this.startTime + this.transitionTime);
          break;
      }

      debug('new env');
      debug('current time', this.context.currentTime);
      debug('startTime', this.startTime, 'transitionTime', this.transitionTime, 'startValu', this.startValue, 'endValue', this.endValue);
    }
  }, {
    key: 'connect',
    value: function connect(param) {
      this.param = param;
    }
  }]);

  return EnvelopeEventGenerator;
}();

exports.default = EnvelopeEventGenerator;

},{"debug":1}],5:[function(_dereq_,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _envelope = _dereq_('./envelope.js');

var _envelope2 = _interopRequireDefault(_envelope);

var _debug = _dereq_('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('amplitude-envelope');

var AmplitudeEnvelope = function () {
  function AmplitudeEnvelope(context, options) {
    _classCallCheck(this, AmplitudeEnvelope);

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

    // Curve
    self.attackCurveType = options.attackCurveType || 'linear';
    self.releaseCurveType = options.releaseCurveType || 'linear';

    // Create Gain Node and first Envelope
    self.gainNode = self.context.createGain();
    self.gainNode.gain.value = 0;
  }

  _createClass(AmplitudeEnvelope, [{
    key: 'currentTime',
    value: function currentTime() {
      if (this.currentTimeSource && typeof this.currentTimeSource.currentTime === 'function') {
        return this.currentTimeSource.currentTime();
      } else {
        return this.currentTimeSource.currentTime;
      }
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      var self = this;

      self.riseEnvelope = new _envelope2.default(self.context, 0, self.maxValue, {
        startTime: self.startTime,
        transitionTime: self.attackTime,
        curveType: self.attackCurveType
      });
      self.riseEnvelope.connect(self.gainNode.gain);
      self.riseEnvelope.trigger();

      debug('amp env');
      debug('startTime', self.startTime, 'attackTime', self.attackTime, 'sustainTime', self.sustainTime, 'releaseTime', self.releaseTime);

      // Schedule release envelope
      var envelope = new _envelope2.default(self.context, self.maxValue, 0, {
        startTime: self.startTime + self.attackTime + self.sustainTime,
        transitionTime: self.releaseTime,
        curveType: self.releaseCurveType
      });
      envelope.connect(self.gainNode.gain);
      envelope.trigger();
    }
  }]);

  return AmplitudeEnvelope;
}();

exports.default = AmplitudeEnvelope;

},{"./envelope.js":4,"debug":1}]},{},[5])(5)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _amplitudeEnv = require('amplitude-env');

var _amplitudeEnv2 = _interopRequireDefault(_amplitudeEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SingleOsc = function () {
  function SingleOsc(options) {
    _classCallCheck(this, SingleOsc);

    options = options || {};

    this.context = options.context;
    this.currentTimeSource = options.currentTimeSource || this.context;

    // Timing params
    this.startTime = options.startTime;
    this.attackTime = options.attackTime;
    this.sustainTime = options.sustainTime;
    this.releaseTime = options.releaseTime;

    // Curves
    this.attackCurveType = options.attackCurveType || 'linear';
    this.releaseCurveType = options.releaseCurveType || 'linear';

    // Non-timing envelop param
    this.maxValue = options.maxValue;

    // Oscillator param
    this.wave = options.wave || 'sawtooth';

    // Master gain node
    this.destinationNode = this.context.createGain();
    this.destinationNode.gain.value = 1;
  }

  _createClass(SingleOsc, [{
    key: 'play',
    value: function play(freq, time) {
      var self = this;

      var attackTime = self.attackTime;
      var sustainTime = self.sustainTime;
      var releaseTime = self.releaseTime;

      // Setup envelope
      var envelope = new _amplitudeEnv2.default(self.context, {
        currentTimeSource: self.currentTimeSource,
        maxValue: self.maxValue,

        // timing
        startTime: time,
        attackTime: attackTime,
        sustainTime: sustainTime,
        releaseTime: releaseTime,

        // curves
        attackCurveType: self.attackCurveType,
        releaseCurveType: self.releaseCurveType
      });

      var osc = self.context.createOscillator();
      osc.type = self.wave;

      osc.connect(envelope.gainNode);
      envelope.gainNode.connect(self.destinationNode);

      // Setup oscillator
      osc.frequency.value = freq || 440;

      envelope.trigger();

      osc.start(time);

      // Schedule stop
      osc.stop(time + attackTime + sustainTime + releaseTime);
      osc.onend = function noteEnd() {
        // onended clean up
        // note: this doesnt have to be fired only when stop() is fired since
        // it is called only when stop succeeds
        osc.disconnect();
      };
    }
  }, {
    key: 'currentTime',
    value: function currentTime() {
      if (this.currentTimeSource && typeof this.currentTimeSource.currentTime === 'function') {
        return this.currentTimeSource.currentTime();
      } else {
        return this.currentTimeSource.currentTime;
      }
    }
  }, {
    key: 'connect',
    value: function connect(node) {
      this.destinationNode.connect(node);
    }
  }]);

  return SingleOsc;
}();

exports.default = SingleOsc;

},{"amplitude-env":1}]},{},[2])(2)
});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"amplitude-env":1}],3:[function(require,module,exports){
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
ctx.rotate(Math.PI * Math.random());

var audio = new window.AudioContext();

var masterGain = audio.createGain();
masterGain.connect(audio.destination);
masterGain.gain.value = 0.5;

var osc = new _singleOscillator2.default({
   context: audio,
   attackTime: 0.1,
   sustainTime: 0.1,
   releaseTime: 0.075,
   maxValue: 1,

   // Osc
   wave: 'triangle'
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

},{"single-oscillator":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9kZWJ1Zy9icm93c2VyLmpzIiwiLi4vLi4vLi4vLi4vc2luZ2xlLW9zY2lsbGF0b3Ivbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9ub2RlX21vZHVsZXMvZGVidWcvZGVidWcuanMiLCIuLi8uLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIi4uLy4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL25vZGVfbW9kdWxlcy9hbXBsaXR1ZGUtZW52L2Rpc3Qvc3JjL2VudmVsb3BlLmpzIiwiLi4vLi4vLi4vLi4vc2luZ2xlLW9zY2lsbGF0b3Ivbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9zcmMvaW5kZXguanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjaWxsYXRvci9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi4vLi4vLi4vc2luZ2xlLW9zY2lsbGF0b3IvZGlzdC9ub2RlX21vZHVsZXMvc2luZ2xlLW9zY2lsbGF0b3IvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2RlYnVnL2Jyb3dzZXIuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjaWxsYXRvci9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9ub2RlX21vZHVsZXMvZGVidWcvZGVidWcuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjaWxsYXRvci9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9ub2RlX21vZHVsZXMvbXMvaW5kZXguanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjaWxsYXRvci9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9zcmMvZW52ZWxvcGUuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjaWxsYXRvci9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9zcmMvaW5kZXguanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L3NyYy9pbmRleC5qcyIsInNyYy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lXG4gICAgICAgICAgICAgICAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lLnN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgID8gY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgICAgICAgICAgICAgICAgIDogbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuICAnbGlnaHRzZWFncmVlbicsXG4gICdmb3Jlc3RncmVlbicsXG4gICdnb2xkZW5yb2QnLFxuICAnZG9kZ2VyYmx1ZScsXG4gICdkYXJrb3JjaGlkJyxcbiAgJ2NyaW1zb24nXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gaXMgd2Via2l0PyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjQ1OTYwNi8zNzY3NzNcbiAgcmV0dXJuICgnV2Via2l0QXBwZWFyYW5jZScgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKSB8fFxuICAgIC8vIGlzIGZpcmVidWc/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5ODEyMC8zNzY3NzNcbiAgICAod2luZG93LmNvbnNvbGUgJiYgKGNvbnNvbGUuZmlyZWJ1ZyB8fCAoY29uc29sZS5leGNlcHRpb24gJiYgY29uc29sZS50YWJsZSkpKSB8fFxuICAgIC8vIGlzIGZpcmVmb3ggPj0gdjMxP1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvVG9vbHMvV2ViX0NvbnNvbGUjU3R5bGluZ19tZXNzYWdlc1xuICAgIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSk7XG59XG5cbi8qKlxuICogTWFwICVqIHRvIGBKU09OLnN0cmluZ2lmeSgpYCwgc2luY2Ugbm8gV2ViIEluc3BlY3RvcnMgZG8gdGhhdCBieSBkZWZhdWx0LlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycy5qID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodik7XG59O1xuXG5cbi8qKlxuICogQ29sb3JpemUgbG9nIGFyZ3VtZW50cyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QXJncygpIHtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciB1c2VDb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblxuICBhcmdzWzBdID0gKHVzZUNvbG9ycyA/ICclYycgOiAnJylcbiAgICArIHRoaXMubmFtZXNwYWNlXG4gICAgKyAodXNlQ29sb3JzID8gJyAlYycgOiAnICcpXG4gICAgKyBhcmdzWzBdXG4gICAgKyAodXNlQ29sb3JzID8gJyVjICcgOiAnICcpXG4gICAgKyAnKycgKyBleHBvcnRzLmh1bWFuaXplKHRoaXMuZGlmZik7XG5cbiAgaWYgKCF1c2VDb2xvcnMpIHJldHVybiBhcmdzO1xuXG4gIHZhciBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcbiAgYXJncyA9IFthcmdzWzBdLCBjLCAnY29sb3I6IGluaGVyaXQnXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgMSkpO1xuXG4gIC8vIHRoZSBmaW5hbCBcIiVjXCIgaXMgc29tZXdoYXQgdHJpY2t5LCBiZWNhdXNlIHRoZXJlIGNvdWxkIGJlIG90aGVyXG4gIC8vIGFyZ3VtZW50cyBwYXNzZWQgZWl0aGVyIGJlZm9yZSBvciBhZnRlciB0aGUgJWMsIHNvIHdlIG5lZWQgdG9cbiAgLy8gZmlndXJlIG91dCB0aGUgY29ycmVjdCBpbmRleCB0byBpbnNlcnQgdGhlIENTUyBpbnRvXG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsYXN0QyA9IDA7XG4gIGFyZ3NbMF0ucmVwbGFjZSgvJVthLXolXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIGlmICgnJSUnID09PSBtYXRjaCkgcmV0dXJuO1xuICAgIGluZGV4Kys7XG4gICAgaWYgKCclYycgPT09IG1hdGNoKSB7XG4gICAgICAvLyB3ZSBvbmx5IGFyZSBpbnRlcmVzdGVkIGluIHRoZSAqbGFzdCogJWNcbiAgICAgIC8vICh0aGUgdXNlciBtYXkgaGF2ZSBwcm92aWRlZCB0aGVpciBvd24pXG4gICAgICBsYXN0QyA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgYXJncy5zcGxpY2UobGFzdEMsIDAsIGMpO1xuICByZXR1cm4gYXJncztcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmxvZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUubG9nYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4gIC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gIHJldHVybiAnb2JqZWN0JyA9PT0gdHlwZW9mIGNvbnNvbGVcbiAgICAmJiBjb25zb2xlLmxvZ1xuICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge31cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICB2YXIgcjtcbiAgdHJ5IHtcbiAgICByID0gZXhwb3J0cy5zdG9yYWdlLmRlYnVnO1xuICB9IGNhdGNoKGUpIHt9XG4gIHJldHVybiByO1xufVxuXG4vKipcbiAqIEVuYWJsZSBuYW1lc3BhY2VzIGxpc3RlZCBpbiBgbG9jYWxTdG9yYWdlLmRlYnVnYCBpbml0aWFsbHkuXG4gKi9cblxuZXhwb3J0cy5lbmFibGUobG9hZCgpKTtcblxuLyoqXG4gKiBMb2NhbHN0b3JhZ2UgYXR0ZW1wdHMgdG8gcmV0dXJuIHRoZSBsb2NhbHN0b3JhZ2UuXG4gKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBzYWZhcmkgdGhyb3dzXG4gKiB3aGVuIGEgdXNlciBkaXNhYmxlcyBjb29raWVzL2xvY2Fsc3RvcmFnZVxuICogYW5kIHlvdSBhdHRlbXB0IHRvIGFjY2VzcyBpdC5cbiAqXG4gKiBAcmV0dXJuIHtMb2NhbFN0b3JhZ2V9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2NhbHN0b3JhZ2UoKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgfSBjYXRjaCAoZSkge31cbn1cbiIsIlxuLyoqXG4gKiBUaGlzIGlzIHRoZSBjb21tb24gbG9naWMgZm9yIGJvdGggdGhlIE5vZGUuanMgYW5kIHdlYiBicm93c2VyXG4gKiBpbXBsZW1lbnRhdGlvbnMgb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBkZWJ1ZztcbmV4cG9ydHMuY29lcmNlID0gY29lcmNlO1xuZXhwb3J0cy5kaXNhYmxlID0gZGlzYWJsZTtcbmV4cG9ydHMuZW5hYmxlID0gZW5hYmxlO1xuZXhwb3J0cy5lbmFibGVkID0gZW5hYmxlZDtcbmV4cG9ydHMuaHVtYW5pemUgPSByZXF1aXJlKCdtcycpO1xuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuICovXG5cbmV4cG9ydHMubmFtZXMgPSBbXTtcbmV4cG9ydHMuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG4gKlxuICogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXJjYXNlZCBsZXR0ZXIsIGkuZS4gXCJuXCIuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzID0ge307XG5cbi8qKlxuICogUHJldmlvdXNseSBhc3NpZ25lZCBjb2xvci5cbiAqL1xuXG52YXIgcHJldkNvbG9yID0gMDtcblxuLyoqXG4gKiBQcmV2aW91cyBsb2cgdGltZXN0YW1wLlxuICovXG5cbnZhciBwcmV2VGltZTtcblxuLyoqXG4gKiBTZWxlY3QgYSBjb2xvci5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZWxlY3RDb2xvcigpIHtcbiAgcmV0dXJuIGV4cG9ydHMuY29sb3JzW3ByZXZDb2xvcisrICUgZXhwb3J0cy5jb2xvcnMubGVuZ3RoXTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBkZWJ1Z2dlciB3aXRoIHRoZSBnaXZlbiBgbmFtZXNwYWNlYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVidWcobmFtZXNwYWNlKSB7XG5cbiAgLy8gZGVmaW5lIHRoZSBgZGlzYWJsZWRgIHZlcnNpb25cbiAgZnVuY3Rpb24gZGlzYWJsZWQoKSB7XG4gIH1cbiAgZGlzYWJsZWQuZW5hYmxlZCA9IGZhbHNlO1xuXG4gIC8vIGRlZmluZSB0aGUgYGVuYWJsZWRgIHZlcnNpb25cbiAgZnVuY3Rpb24gZW5hYmxlZCgpIHtcblxuICAgIHZhciBzZWxmID0gZW5hYmxlZDtcblxuICAgIC8vIHNldCBgZGlmZmAgdGltZXN0YW1wXG4gICAgdmFyIGN1cnIgPSArbmV3IERhdGUoKTtcbiAgICB2YXIgbXMgPSBjdXJyIC0gKHByZXZUaW1lIHx8IGN1cnIpO1xuICAgIHNlbGYuZGlmZiA9IG1zO1xuICAgIHNlbGYucHJldiA9IHByZXZUaW1lO1xuICAgIHNlbGYuY3VyciA9IGN1cnI7XG4gICAgcHJldlRpbWUgPSBjdXJyO1xuXG4gICAgLy8gYWRkIHRoZSBgY29sb3JgIGlmIG5vdCBzZXRcbiAgICBpZiAobnVsbCA9PSBzZWxmLnVzZUNvbG9ycykgc2VsZi51c2VDb2xvcnMgPSBleHBvcnRzLnVzZUNvbG9ycygpO1xuICAgIGlmIChudWxsID09IHNlbGYuY29sb3IgJiYgc2VsZi51c2VDb2xvcnMpIHNlbGYuY29sb3IgPSBzZWxlY3RDb2xvcigpO1xuXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgYXJnc1swXSA9IGV4cG9ydHMuY29lcmNlKGFyZ3NbMF0pO1xuXG4gICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgLy8gYW55dGhpbmcgZWxzZSBsZXQncyBpbnNwZWN0IHdpdGggJW9cbiAgICAgIGFyZ3MgPSBbJyVvJ10uY29uY2F0KGFyZ3MpO1xuICAgIH1cblxuICAgIC8vIGFwcGx5IGFueSBgZm9ybWF0dGVyc2AgdHJhbnNmb3JtYXRpb25zXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICBhcmdzWzBdID0gYXJnc1swXS5yZXBsYWNlKC8lKFthLXolXSkvZywgZnVuY3Rpb24obWF0Y2gsIGZvcm1hdCkge1xuICAgICAgLy8gaWYgd2UgZW5jb3VudGVyIGFuIGVzY2FwZWQgJSB0aGVuIGRvbid0IGluY3JlYXNlIHRoZSBhcnJheSBpbmRleFxuICAgICAgaWYgKG1hdGNoID09PSAnJSUnKSByZXR1cm4gbWF0Y2g7XG4gICAgICBpbmRleCsrO1xuICAgICAgdmFyIGZvcm1hdHRlciA9IGV4cG9ydHMuZm9ybWF0dGVyc1tmb3JtYXRdO1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBmb3JtYXR0ZXIpIHtcbiAgICAgICAgdmFyIHZhbCA9IGFyZ3NbaW5kZXhdO1xuICAgICAgICBtYXRjaCA9IGZvcm1hdHRlci5jYWxsKHNlbGYsIHZhbCk7XG5cbiAgICAgICAgLy8gbm93IHdlIG5lZWQgdG8gcmVtb3ZlIGBhcmdzW2luZGV4XWAgc2luY2UgaXQncyBpbmxpbmVkIGluIHRoZSBgZm9ybWF0YFxuICAgICAgICBhcmdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGluZGV4LS07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG5cbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGV4cG9ydHMuZm9ybWF0QXJncykge1xuICAgICAgYXJncyA9IGV4cG9ydHMuZm9ybWF0QXJncy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gICAgdmFyIGxvZ0ZuID0gZW5hYmxlZC5sb2cgfHwgZXhwb3J0cy5sb2cgfHwgY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbiAgICBsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgfVxuICBlbmFibGVkLmVuYWJsZWQgPSB0cnVlO1xuXG4gIHZhciBmbiA9IGV4cG9ydHMuZW5hYmxlZChuYW1lc3BhY2UpID8gZW5hYmxlZCA6IGRpc2FibGVkO1xuXG4gIGZuLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcblxuICByZXR1cm4gZm47XG59XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZXNwYWNlcy4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGUobmFtZXNwYWNlcykge1xuICBleHBvcnRzLnNhdmUobmFtZXNwYWNlcyk7XG5cbiAgdmFyIHNwbGl0ID0gKG5hbWVzcGFjZXMgfHwgJycpLnNwbGl0KC9bXFxzLF0rLyk7XG4gIHZhciBsZW4gPSBzcGxpdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmICghc3BsaXRbaV0pIGNvbnRpbnVlOyAvLyBpZ25vcmUgZW1wdHkgc3RyaW5nc1xuICAgIG5hbWVzcGFjZXMgPSBzcGxpdFtpXS5yZXBsYWNlKC9cXCovZywgJy4qPycpO1xuICAgIGlmIChuYW1lc3BhY2VzWzBdID09PSAnLScpIHtcbiAgICAgIGV4cG9ydHMuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMuc3Vic3RyKDEpICsgJyQnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cG9ydHMubmFtZXMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMgKyAnJCcpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlIGRlYnVnIG91dHB1dC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gIGV4cG9ydHMuZW5hYmxlKCcnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGUgbmFtZSBpcyBlbmFibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuICB2YXIgaSwgbGVuO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMubmFtZXNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDb2VyY2UgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4gdmFsLnN0YWNrIHx8IHZhbC5tZXNzYWdlO1xuICByZXR1cm4gdmFsO1xufVxuIiwiLyoqXG4gKiBIZWxwZXJzLlxuICovXG5cbnZhciBzID0gMTAwMDtcbnZhciBtID0gcyAqIDYwO1xudmFyIGggPSBtICogNjA7XG52YXIgZCA9IGggKiAyNDtcbnZhciB5ID0gZCAqIDM2NS4yNTtcblxuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCwgb3B0aW9ucyl7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZhbCkgcmV0dXJuIHBhcnNlKHZhbCk7XG4gIHJldHVybiBvcHRpb25zLmxvbmdcbiAgICA/IGxvbmcodmFsKVxuICAgIDogc2hvcnQodmFsKTtcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGBzdHJgIGFuZCByZXR1cm4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlKHN0cikge1xuICBzdHIgPSAnJyArIHN0cjtcbiAgaWYgKHN0ci5sZW5ndGggPiAxMDAwMCkgcmV0dXJuO1xuICB2YXIgbWF0Y2ggPSAvXigoPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKHN0cik7XG4gIGlmICghbWF0Y2gpIHJldHVybjtcbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ2RheXMnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnZCc6XG4gICAgICByZXR1cm4gbiAqIGQ7XG4gICAgY2FzZSAnaG91cnMnOlxuICAgIGNhc2UgJ2hvdXInOlxuICAgIGNhc2UgJ2hycyc6XG4gICAgY2FzZSAnaHInOlxuICAgIGNhc2UgJ2gnOlxuICAgICAgcmV0dXJuIG4gKiBoO1xuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgY2FzZSAnbWlucyc6XG4gICAgY2FzZSAnbWluJzpcbiAgICBjYXNlICdtJzpcbiAgICAgIHJldHVybiBuICogbTtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdzZWNvbmQnOlxuICAgIGNhc2UgJ3NlY3MnOlxuICAgIGNhc2UgJ3NlYyc6XG4gICAgY2FzZSAncyc6XG4gICAgICByZXR1cm4gbiAqIHM7XG4gICAgY2FzZSAnbWlsbGlzZWNvbmRzJzpcbiAgICBjYXNlICdtaWxsaXNlY29uZCc6XG4gICAgY2FzZSAnbXNlY3MnOlxuICAgIGNhc2UgJ21zZWMnOlxuICAgIGNhc2UgJ21zJzpcbiAgICAgIHJldHVybiBuO1xuICB9XG59XG5cbi8qKlxuICogU2hvcnQgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2hvcnQobXMpIHtcbiAgaWYgKG1zID49IGQpIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gIGlmIChtcyA+PSBoKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGgpICsgJ2gnO1xuICBpZiAobXMgPj0gbSkgcmV0dXJuIE1hdGgucm91bmQobXMgLyBtKSArICdtJztcbiAgaWYgKG1zID49IHMpIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb25nKG1zKSB7XG4gIHJldHVybiBwbHVyYWwobXMsIGQsICdkYXknKVxuICAgIHx8IHBsdXJhbChtcywgaCwgJ2hvdXInKVxuICAgIHx8IHBsdXJhbChtcywgbSwgJ21pbnV0ZScpXG4gICAgfHwgcGx1cmFsKG1zLCBzLCAnc2Vjb25kJylcbiAgICB8fCBtcyArICcgbXMnO1xufVxuXG4vKipcbiAqIFBsdXJhbGl6YXRpb24gaGVscGVyLlxuICovXG5cbmZ1bmN0aW9uIHBsdXJhbChtcywgbiwgbmFtZSkge1xuICBpZiAobXMgPCBuKSByZXR1cm47XG4gIGlmIChtcyA8IG4gKiAxLjUpIHJldHVybiBNYXRoLmZsb29yKG1zIC8gbikgKyAnICcgKyBuYW1lO1xuICByZXR1cm4gTWF0aC5jZWlsKG1zIC8gbikgKyAnICcgKyBuYW1lICsgJ3MnO1xufVxuIiwiaW1wb3J0IGRlYnVnR2VuIGZyb20gJ2RlYnVnJztcblxuY29uc3QgZGVidWcgPSBkZWJ1Z0dlbignZW52ZWxvcGUtZXZlbnQnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW52ZWxvcGVFdmVudEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQsIHN0YXJ0VmFsdWUsIGVuZFZhbHVlLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBpZiAoICFjb250ZXh0ICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdWRpb0NvbnRleHQgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2Ygc3RhcnRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIHN0YXJ0VmFsdWUgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2YgZW5kVmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBlbmRWYWx1ZSBpcyByZXF1aXJlZCcpO1xuICAgIH1cblxuICAgIC8vIFJlcXVpcmVkIHZhbHVlc1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5zdGFydFZhbHVlID0gc3RhcnRWYWx1ZTtcbiAgICB0aGlzLmVuZFZhbHVlID0gZW5kVmFsdWU7XG5cbiAgICAvLyBPcHRpb25hbCB2YWx1ZXNcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lIHx8IHRoaXMuY29udGV4dC5jdXJyZW50VGltZTtcbiAgICB0aGlzLnRyYW5zaXRpb25UaW1lID0gb3B0aW9ucy50cmFuc2l0aW9uVGltZSB8fCAwLjE7XG5cbiAgICB0aGlzLmN1cnZlVHlwZSA9IG9wdGlvbnMuY3VydmVUeXBlO1xuICB9XG5cbiAgZ2V0RXF1YWxQb3dlckN1cnZlKHNjYWxlLCBvZmZzZXQpIHtcbiAgICBzY2FsZSA9IHNjYWxlIHx8IDE7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG5cbiAgICB2YXIgY3VydmVMZW5ndGggPSB0aGlzLmNvbnRleHQuc2FtcGxlUmF0ZTtcbiAgICB2YXIgY3VydmUgPSBuZXcgRmxvYXQzMkFycmF5KGN1cnZlTGVuZ3RoKTtcblxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGN1cnZlTGVuZ3RoOyBpKysgKSB7XG4gICAgICBjdXJ2ZVtpXSA9IHNjYWxlICogTWF0aC5jb3MoTWF0aC5QSSAqICggaS9jdXJ2ZUxlbmd0aCArIDEgKSAvIDQpICsgb2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiBjdXJ2ZTtcbiAgfVxuXG4gIHRyaWdnZXIoKSB7XG4gICAgdGhpcy5wYXJhbS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXModGhpcy5zdGFydFRpbWUpO1xuICAgIHRoaXMucGFyYW0uc2V0VmFsdWVBdFRpbWUodGhpcy5zdGFydFZhbHVlLCB0aGlzLnN0YXJ0VGltZSk7XG4gICAgc3dpdGNoICggdGhpcy5jdXJ2ZVR5cGUgKSB7XG4gICAgICBjYXNlICdlcXVhbFBvd2VyRmFkZUluJzpcbiAgICAgICAgdmFyIHNjYWxlID0gTWF0aC5hYnModGhpcy5lbmRWYWx1ZSAtIHRoaXMuc3RhcnRWYWx1ZSk7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnN0YXJ0VmFsdWU7XG5cbiAgICAgICAgdGhpcy5wYXJhbS5zZXRWYWx1ZUN1cnZlQXRUaW1lKHRoaXMuZ2V0RXF1YWxQb3dlckN1cnZlKHNjYWxlLCBvZmZzZXQpLnJldmVyc2UoKSwgdGhpcy5zdGFydFRpbWUsIHRoaXMudHJhbnNpdGlvblRpbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2VxdWFsUG93ZXJGYWRlT3V0JzpcbiAgICAgICAgdmFyIHNjYWxlID0gTWF0aC5hYnModGhpcy5zdGFydFZhbHVlIC0gdGhpcy5lbmRWYWx1ZSk7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLmVuZFZhbHVlO1xuXG4gICAgICAgIHRoaXMucGFyYW0uc2V0VmFsdWVDdXJ2ZUF0VGltZSh0aGlzLmdldEVxdWFsUG93ZXJDdXJ2ZShzY2FsZSwgb2Zmc2V0KSwgdGhpcy5zdGFydFRpbWUsIHRoaXMudHJhbnNpdGlvblRpbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xpbmVhcic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnBhcmFtLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZW5kVmFsdWUsIHRoaXMuc3RhcnRUaW1lICsgdGhpcy50cmFuc2l0aW9uVGltZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGRlYnVnKCduZXcgZW52Jyk7XG4gICAgZGVidWcoJ2N1cnJlbnQgdGltZScsIHRoaXMuY29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgZGVidWcoJ3N0YXJ0VGltZScsIHRoaXMuc3RhcnRUaW1lLCAndHJhbnNpdGlvblRpbWUnLCB0aGlzLnRyYW5zaXRpb25UaW1lLCAnc3RhcnRWYWx1JywgdGhpcy5zdGFydFZhbHVlLCAnZW5kVmFsdWUnLCB0aGlzLmVuZFZhbHVlKTtcbiAgfVxuXG4gIGNvbm5lY3QocGFyYW0pIHtcbiAgICB0aGlzLnBhcmFtID0gcGFyYW07XG4gIH1cbn1cbiIsImltcG9ydCBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yIGZyb20gJy4vZW52ZWxvcGUuanMnO1xuaW1wb3J0IGRlYnVnR2VuIGZyb20gJ2RlYnVnJztcblxuY29uc3QgZGVidWcgPSBkZWJ1Z0dlbignYW1wbGl0dWRlLWVudmVsb3BlJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFtcGxpdHVkZUVudmVsb3BlIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgb3B0aW9ucyl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5jb250ZXh0ID0gY29udGV4dDtcblxuICAgIC8vIC0tLS0tIG9wdGlvbnMgLS0tLS1cbiAgICBzZWxmLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLy8gVGltaW5nXG4gICAgc2VsZi5jdXJyZW50VGltZVNvdXJjZSA9IG9wdGlvbnMuY3VycmVudFRpbWVTb3VyY2UgfHwgc2VsZi5jb250ZXh0O1xuICAgIHNlbGYuc3RhcnRUaW1lID0gb3B0aW9ucy5zdGFydFRpbWU7XG4gICAgc2VsZi5hdHRhY2tUaW1lID0gb3B0aW9ucy5hdHRhY2tUaW1lO1xuICAgIHNlbGYuc3VzdGFpblRpbWUgPSBvcHRpb25zLnN1c3RhaW5UaW1lO1xuICAgIHNlbGYucmVsZWFzZVRpbWUgPSBvcHRpb25zLnJlbGVhc2VUaW1lO1xuXG4gICAgc2VsZi5tYXhWYWx1ZSA9IG9wdGlvbnMubWF4VmFsdWU7XG5cbiAgICAvLyBDdXJ2ZVxuICAgIHNlbGYuYXR0YWNrQ3VydmVUeXBlID0gb3B0aW9ucy5hdHRhY2tDdXJ2ZVR5cGUgfHwgJ2xpbmVhcic7XG4gICAgc2VsZi5yZWxlYXNlQ3VydmVUeXBlID0gb3B0aW9ucy5yZWxlYXNlQ3VydmVUeXBlIHx8ICdsaW5lYXInO1xuXG4gICAgLy8gQ3JlYXRlIEdhaW4gTm9kZSBhbmQgZmlyc3QgRW52ZWxvcGVcbiAgICBzZWxmLmdhaW5Ob2RlID0gc2VsZi5jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICBzZWxmLmdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwO1xuICB9XG5cbiAgY3VycmVudFRpbWUoKSB7XG4gICAgaWYgKCB0aGlzLmN1cnJlbnRUaW1lU291cmNlICYmIHR5cGVvZiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWU7XG4gICAgfVxuICB9XG4gIHRyaWdnZXIoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5yaXNlRW52ZWxvcGUgPSBuZXcgRW52ZWxvcGVFdmVudEdlbmVyYXRvcihzZWxmLmNvbnRleHQsIDAsIHNlbGYubWF4VmFsdWUsIHtcbiAgICAgIHN0YXJ0VGltZTogc2VsZi5zdGFydFRpbWUsXG4gICAgICB0cmFuc2l0aW9uVGltZTogc2VsZi5hdHRhY2tUaW1lLFxuICAgICAgY3VydmVUeXBlOiBzZWxmLmF0dGFja0N1cnZlVHlwZSxcbiAgICB9KTtcbiAgICBzZWxmLnJpc2VFbnZlbG9wZS5jb25uZWN0KHNlbGYuZ2Fpbk5vZGUuZ2Fpbik7XG4gICAgc2VsZi5yaXNlRW52ZWxvcGUudHJpZ2dlcigpO1xuXG4gICAgZGVidWcoJ2FtcCBlbnYnKTtcbiAgICBkZWJ1Zygnc3RhcnRUaW1lJywgc2VsZi5zdGFydFRpbWUsICdhdHRhY2tUaW1lJywgc2VsZi5hdHRhY2tUaW1lLCAnc3VzdGFpblRpbWUnLCBzZWxmLnN1c3RhaW5UaW1lLCAncmVsZWFzZVRpbWUnLCBzZWxmLnJlbGVhc2VUaW1lKTtcblxuICAgIC8vIFNjaGVkdWxlIHJlbGVhc2UgZW52ZWxvcGVcbiAgICB2YXIgZW52ZWxvcGUgPSBuZXcgRW52ZWxvcGVFdmVudEdlbmVyYXRvcihzZWxmLmNvbnRleHQsIHNlbGYubWF4VmFsdWUsIDAsIHtcbiAgICAgIHN0YXJ0VGltZTogc2VsZi5zdGFydFRpbWUgKyBzZWxmLmF0dGFja1RpbWUgKyBzZWxmLnN1c3RhaW5UaW1lLFxuICAgICAgdHJhbnNpdGlvblRpbWU6IHNlbGYucmVsZWFzZVRpbWUsXG4gICAgICBjdXJ2ZVR5cGU6IHNlbGYucmVsZWFzZUN1cnZlVHlwZSxcbiAgICB9KTtcbiAgICBlbnZlbG9wZS5jb25uZWN0KHNlbGYuZ2Fpbk5vZGUuZ2Fpbik7XG4gICAgZW52ZWxvcGUudHJpZ2dlcigpO1xuICB9XG59XG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9ICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWVcbiAgICAgICAgICAgICAgICYmICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWUuc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgPyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAgICAgICAgICAgICAgICAgOiBsb2NhbHN0b3JhZ2UoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG4gICdsaWdodHNlYWdyZWVuJyxcbiAgJ2ZvcmVzdGdyZWVuJyxcbiAgJ2dvbGRlbnJvZCcsXG4gICdkb2RnZXJibHVlJyxcbiAgJ2RhcmtvcmNoaWQnLFxuICAnY3JpbXNvbidcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICByZXR1cm4gKCdXZWJraXRBcHBlYXJhbmNlJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUpIHx8XG4gICAgLy8gaXMgZmlyZWJ1Zz8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk4MTIwLzM3Njc3M1xuICAgICh3aW5kb3cuY29uc29sZSAmJiAoY29uc29sZS5maXJlYnVnIHx8IChjb25zb2xlLmV4Y2VwdGlvbiAmJiBjb25zb2xlLnRhYmxlKSkpIHx8XG4gICAgLy8gaXMgZmlyZWZveCA+PSB2MzE/XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh2KTtcbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKCkge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuIGFyZ3M7XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzID0gW2FyZ3NbMF0sIGMsICdjb2xvcjogaW5oZXJpdCddLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKSk7XG5cbiAgLy8gdGhlIGZpbmFsIFwiJWNcIiBpcyBzb21ld2hhdCB0cmlja3ksIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb3RoZXJcbiAgLy8gYXJndW1lbnRzIHBhc3NlZCBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoZSAlYywgc28gd2UgbmVlZCB0b1xuICAvLyBmaWd1cmUgb3V0IHRoZSBjb3JyZWN0IGluZGV4IHRvIGluc2VydCB0aGUgQ1NTIGludG9cbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxhc3RDID0gMDtcbiAgYXJnc1swXS5yZXBsYWNlKC8lW2EteiVdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgaWYgKCclJScgPT09IG1hdGNoKSByZXR1cm47XG4gICAgaW5kZXgrKztcbiAgICBpZiAoJyVjJyA9PT0gbWF0Y2gpIHtcbiAgICAgIC8vIHdlIG9ubHkgYXJlIGludGVyZXN0ZWQgaW4gdGhlICpsYXN0KiAlY1xuICAgICAgLy8gKHRoZSB1c2VyIG1heSBoYXZlIHByb3ZpZGVkIHRoZWlyIG93bilcbiAgICAgIGxhc3RDID0gaW5kZXg7XG4gICAgfVxuICB9KTtcblxuICBhcmdzLnNwbGljZShsYXN0QywgMCwgYyk7XG4gIHJldHVybiBhcmdzO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UuZGVidWcgPSBuYW1lc3BhY2VzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHZhciByO1xuICB0cnkge1xuICAgIHIgPSBleHBvcnRzLnN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cbiAgcmV0dXJuIHI7XG59XG5cbi8qKlxuICogRW5hYmxlIG5hbWVzcGFjZXMgbGlzdGVkIGluIGBsb2NhbFN0b3JhZ2UuZGVidWdgIGluaXRpYWxseS5cbiAqL1xuXG5leHBvcnRzLmVuYWJsZShsb2FkKCkpO1xuXG4vKipcbiAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHNhZmFyaSB0aHJvd3NcbiAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gKiBhbmQgeW91IGF0dGVtcHQgdG8gYWNjZXNzIGl0LlxuICpcbiAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvY2Fsc3RvcmFnZSgpe1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGRlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlcmNhc2VkIGxldHRlciwgaS5lLiBcIm5cIi5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMgPSB7fTtcblxuLyoqXG4gKiBQcmV2aW91c2x5IGFzc2lnbmVkIGNvbG9yLlxuICovXG5cbnZhciBwcmV2Q29sb3IgPSAwO1xuXG4vKipcbiAqIFByZXZpb3VzIGxvZyB0aW1lc3RhbXAuXG4gKi9cblxudmFyIHByZXZUaW1lO1xuXG4vKipcbiAqIFNlbGVjdCBhIGNvbG9yLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlbGVjdENvbG9yKCkge1xuICByZXR1cm4gZXhwb3J0cy5jb2xvcnNbcHJldkNvbG9yKysgJSBleHBvcnRzLmNvbG9ycy5sZW5ndGhdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWJ1ZyhuYW1lc3BhY2UpIHtcblxuICAvLyBkZWZpbmUgdGhlIGBkaXNhYmxlZGAgdmVyc2lvblxuICBmdW5jdGlvbiBkaXNhYmxlZCgpIHtcbiAgfVxuICBkaXNhYmxlZC5lbmFibGVkID0gZmFsc2U7XG5cbiAgLy8gZGVmaW5lIHRoZSBgZW5hYmxlZGAgdmVyc2lvblxuICBmdW5jdGlvbiBlbmFibGVkKCkge1xuXG4gICAgdmFyIHNlbGYgPSBlbmFibGVkO1xuXG4gICAgLy8gc2V0IGBkaWZmYCB0aW1lc3RhbXBcbiAgICB2YXIgY3VyciA9ICtuZXcgRGF0ZSgpO1xuICAgIHZhciBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG4gICAgc2VsZi5kaWZmID0gbXM7XG4gICAgc2VsZi5wcmV2ID0gcHJldlRpbWU7XG4gICAgc2VsZi5jdXJyID0gY3VycjtcbiAgICBwcmV2VGltZSA9IGN1cnI7XG5cbiAgICAvLyBhZGQgdGhlIGBjb2xvcmAgaWYgbm90IHNldFxuICAgIGlmIChudWxsID09IHNlbGYudXNlQ29sb3JzKSBzZWxmLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gICAgaWYgKG51bGwgPT0gc2VsZi5jb2xvciAmJiBzZWxmLnVzZUNvbG9ycykgc2VsZi5jb2xvciA9IHNlbGVjdENvbG9yKCk7XG5cbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICBhcmdzWzBdID0gZXhwb3J0cy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlb1xuICAgICAgYXJncyA9IFsnJW8nXS5jb25jYXQoYXJncyk7XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EteiVdKS9nLCBmdW5jdGlvbihtYXRjaCwgZm9ybWF0KSB7XG4gICAgICAvLyBpZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG4gICAgICBpZiAobWF0Y2ggPT09ICclJScpIHJldHVybiBtYXRjaDtcbiAgICAgIGluZGV4Kys7XG4gICAgICB2YXIgZm9ybWF0dGVyID0gZXhwb3J0cy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdHRlcikge1xuICAgICAgICB2YXIgdmFsID0gYXJnc1tpbmRleF07XG4gICAgICAgIG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuICAgICAgICAvLyBub3cgd2UgbmVlZCB0byByZW1vdmUgYGFyZ3NbaW5kZXhdYCBzaW5jZSBpdCdzIGlubGluZWQgaW4gdGhlIGBmb3JtYXRgXG4gICAgICAgIGFyZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaW5kZXgtLTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcblxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5mb3JtYXRBcmdzKSB7XG4gICAgICBhcmdzID0gZXhwb3J0cy5mb3JtYXRBcmdzLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgICB2YXIgbG9nRm4gPSBlbmFibGVkLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG4gIGVuYWJsZWQuZW5hYmxlZCA9IHRydWU7XG5cbiAgdmFyIGZuID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSkgPyBlbmFibGVkIDogZGlzYWJsZWQ7XG5cbiAgZm4ubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuXG4gIHJldHVybiBmbjtcbn1cblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gIGV4cG9ydHMuc2F2ZShuYW1lc3BhY2VzKTtcblxuICB2YXIgc3BsaXQgPSAobmFtZXNwYWNlcyB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgdmFyIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG4iLCIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsLCBvcHRpb25zKXtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgdmFsKSByZXR1cm4gcGFyc2UodmFsKTtcbiAgcmV0dXJuIG9wdGlvbnMubG9uZ1xuICAgID8gbG9uZyh2YWwpXG4gICAgOiBzaG9ydCh2YWwpO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9ICcnICsgc3RyO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMDAwKSByZXR1cm47XG4gIHZhciBtYXRjaCA9IC9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoc3RyKTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgaWYgKG1zID49IGgpIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIGlmIChtcyA+PSBtKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICBpZiAobXMgPj0gcykgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvbmcobXMpIHtcbiAgcmV0dXJuIHBsdXJhbChtcywgZCwgJ2RheScpXG4gICAgfHwgcGx1cmFsKG1zLCBoLCAnaG91cicpXG4gICAgfHwgcGx1cmFsKG1zLCBtLCAnbWludXRlJylcbiAgICB8fCBwbHVyYWwobXMsIHMsICdzZWNvbmQnKVxuICAgIHx8IG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHJldHVybjtcbiAgaWYgKG1zIDwgbiAqIDEuNSkgcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWU7XG4gIHJldHVybiBNYXRoLmNlaWwobXMgLyBuKSArICcgJyArIG5hbWUgKyAncyc7XG59XG4iLCJpbXBvcnQgZGVidWdHZW4gZnJvbSAnZGVidWcnO1xuXG5jb25zdCBkZWJ1ZyA9IGRlYnVnR2VuKCdlbnZlbG9wZS1ldmVudCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgc3RhcnRWYWx1ZSwgZW5kVmFsdWUsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGlmICggIWNvbnRleHQgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F1ZGlvQ29udGV4dCBpcyByZXF1aXJlZCcpO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBzdGFydFZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gc3RhcnRWYWx1ZSBpcyByZXF1aXJlZCcpO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBlbmRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGVuZFZhbHVlIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgLy8gUmVxdWlyZWQgdmFsdWVzXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLnN0YXJ0VmFsdWUgPSBzdGFydFZhbHVlO1xuICAgIHRoaXMuZW5kVmFsdWUgPSBlbmRWYWx1ZTtcblxuICAgIC8vIE9wdGlvbmFsIHZhbHVlc1xuICAgIHRoaXMuc3RhcnRUaW1lID0gb3B0aW9ucy5zdGFydFRpbWUgfHwgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIHRoaXMudHJhbnNpdGlvblRpbWUgPSBvcHRpb25zLnRyYW5zaXRpb25UaW1lIHx8IDAuMTtcblxuICAgIHRoaXMuY3VydmVUeXBlID0gb3B0aW9ucy5jdXJ2ZVR5cGU7XG4gIH1cblxuICBnZXRFcXVhbFBvd2VyQ3VydmUoc2NhbGUsIG9mZnNldCkge1xuICAgIHNjYWxlID0gc2NhbGUgfHwgMTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIHZhciBjdXJ2ZUxlbmd0aCA9IHRoaXMuY29udGV4dC5zYW1wbGVSYXRlO1xuICAgIHZhciBjdXJ2ZSA9IG5ldyBGbG9hdDMyQXJyYXkoY3VydmVMZW5ndGgpO1xuXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgY3VydmVMZW5ndGg7IGkrKyApIHtcbiAgICAgIGN1cnZlW2ldID0gc2NhbGUgKiBNYXRoLmNvcyhNYXRoLlBJICogKCBpL2N1cnZlTGVuZ3RoICsgMSApIC8gNCkgKyBvZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnZlO1xuICB9XG5cbiAgdHJpZ2dlcigpIHtcbiAgICB0aGlzLnBhcmFtLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyh0aGlzLnN0YXJ0VGltZSk7XG4gICAgdGhpcy5wYXJhbS5zZXRWYWx1ZUF0VGltZSh0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuc3RhcnRUaW1lKTtcbiAgICBzd2l0Y2ggKCB0aGlzLmN1cnZlVHlwZSApIHtcbiAgICAgIGNhc2UgJ2VxdWFsUG93ZXJGYWRlSW4nOlxuICAgICAgICB2YXIgc2NhbGUgPSBNYXRoLmFicyh0aGlzLmVuZFZhbHVlIC0gdGhpcy5zdGFydFZhbHVlKTtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuc3RhcnRWYWx1ZTtcblxuICAgICAgICB0aGlzLnBhcmFtLnNldFZhbHVlQ3VydmVBdFRpbWUodGhpcy5nZXRFcXVhbFBvd2VyQ3VydmUoc2NhbGUsIG9mZnNldCkucmV2ZXJzZSgpLCB0aGlzLnN0YXJ0VGltZSwgdGhpcy50cmFuc2l0aW9uVGltZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXF1YWxQb3dlckZhZGVPdXQnOlxuICAgICAgICB2YXIgc2NhbGUgPSBNYXRoLmFicyh0aGlzLnN0YXJ0VmFsdWUgLSB0aGlzLmVuZFZhbHVlKTtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuZW5kVmFsdWU7XG5cbiAgICAgICAgdGhpcy5wYXJhbS5zZXRWYWx1ZUN1cnZlQXRUaW1lKHRoaXMuZ2V0RXF1YWxQb3dlckN1cnZlKHNjYWxlLCBvZmZzZXQpLCB0aGlzLnN0YXJ0VGltZSwgdGhpcy50cmFuc2l0aW9uVGltZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGluZWFyJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5lbmRWYWx1ZSwgdGhpcy5zdGFydFRpbWUgKyB0aGlzLnRyYW5zaXRpb25UaW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZGVidWcoJ25ldyBlbnYnKTtcbiAgICBkZWJ1ZygnY3VycmVudCB0aW1lJywgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcbiAgICBkZWJ1Zygnc3RhcnRUaW1lJywgdGhpcy5zdGFydFRpbWUsICd0cmFuc2l0aW9uVGltZScsIHRoaXMudHJhbnNpdGlvblRpbWUsICdzdGFydFZhbHUnLCB0aGlzLnN0YXJ0VmFsdWUsICdlbmRWYWx1ZScsIHRoaXMuZW5kVmFsdWUpO1xuICB9XG5cbiAgY29ubmVjdChwYXJhbSkge1xuICAgIHRoaXMucGFyYW0gPSBwYXJhbTtcbiAgfVxufVxuIiwiaW1wb3J0IEVudmVsb3BlRXZlbnRHZW5lcmF0b3IgZnJvbSAnLi9lbnZlbG9wZS5qcyc7XG5pbXBvcnQgZGVidWdHZW4gZnJvbSAnZGVidWcnO1xuXG5jb25zdCBkZWJ1ZyA9IGRlYnVnR2VuKCdhbXBsaXR1ZGUtZW52ZWxvcGUnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW1wbGl0dWRlRW52ZWxvcGUge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgLy8gLS0tLS0gb3B0aW9ucyAtLS0tLVxuICAgIHNlbGYub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvLyBUaW1pbmdcbiAgICBzZWxmLmN1cnJlbnRUaW1lU291cmNlID0gb3B0aW9ucy5jdXJyZW50VGltZVNvdXJjZSB8fCBzZWxmLmNvbnRleHQ7XG4gICAgc2VsZi5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICBzZWxmLmF0dGFja1RpbWUgPSBvcHRpb25zLmF0dGFja1RpbWU7XG4gICAgc2VsZi5zdXN0YWluVGltZSA9IG9wdGlvbnMuc3VzdGFpblRpbWU7XG4gICAgc2VsZi5yZWxlYXNlVGltZSA9IG9wdGlvbnMucmVsZWFzZVRpbWU7XG5cbiAgICBzZWxmLm1heFZhbHVlID0gb3B0aW9ucy5tYXhWYWx1ZTtcblxuICAgIC8vIEN1cnZlXG4gICAgc2VsZi5hdHRhY2tDdXJ2ZVR5cGUgPSBvcHRpb25zLmF0dGFja0N1cnZlVHlwZSB8fCAnbGluZWFyJztcbiAgICBzZWxmLnJlbGVhc2VDdXJ2ZVR5cGUgPSBvcHRpb25zLnJlbGVhc2VDdXJ2ZVR5cGUgfHwgJ2xpbmVhcic7XG5cbiAgICAvLyBDcmVhdGUgR2FpbiBOb2RlIGFuZCBmaXJzdCBFbnZlbG9wZVxuICAgIHNlbGYuZ2Fpbk5vZGUgPSBzZWxmLmNvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHNlbGYuZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDA7XG4gIH1cblxuICBjdXJyZW50VGltZSgpIHtcbiAgICBpZiAoIHRoaXMuY3VycmVudFRpbWVTb3VyY2UgJiYgdHlwZW9mIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWUgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZTtcbiAgICB9XG4gIH1cbiAgdHJpZ2dlcigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnJpc2VFbnZlbG9wZSA9IG5ldyBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yKHNlbGYuY29udGV4dCwgMCwgc2VsZi5tYXhWYWx1ZSwge1xuICAgICAgc3RhcnRUaW1lOiBzZWxmLnN0YXJ0VGltZSxcbiAgICAgIHRyYW5zaXRpb25UaW1lOiBzZWxmLmF0dGFja1RpbWUsXG4gICAgICBjdXJ2ZVR5cGU6IHNlbGYuYXR0YWNrQ3VydmVUeXBlLFxuICAgIH0pO1xuICAgIHNlbGYucmlzZUVudmVsb3BlLmNvbm5lY3Qoc2VsZi5nYWluTm9kZS5nYWluKTtcbiAgICBzZWxmLnJpc2VFbnZlbG9wZS50cmlnZ2VyKCk7XG5cbiAgICBkZWJ1ZygnYW1wIGVudicpO1xuICAgIGRlYnVnKCdzdGFydFRpbWUnLCBzZWxmLnN0YXJ0VGltZSwgJ2F0dGFja1RpbWUnLCBzZWxmLmF0dGFja1RpbWUsICdzdXN0YWluVGltZScsIHNlbGYuc3VzdGFpblRpbWUsICdyZWxlYXNlVGltZScsIHNlbGYucmVsZWFzZVRpbWUpO1xuXG4gICAgLy8gU2NoZWR1bGUgcmVsZWFzZSBlbnZlbG9wZVxuICAgIHZhciBlbnZlbG9wZSA9IG5ldyBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yKHNlbGYuY29udGV4dCwgc2VsZi5tYXhWYWx1ZSwgMCwge1xuICAgICAgc3RhcnRUaW1lOiBzZWxmLnN0YXJ0VGltZSArIHNlbGYuYXR0YWNrVGltZSArIHNlbGYuc3VzdGFpblRpbWUsXG4gICAgICB0cmFuc2l0aW9uVGltZTogc2VsZi5yZWxlYXNlVGltZSxcbiAgICAgIGN1cnZlVHlwZTogc2VsZi5yZWxlYXNlQ3VydmVUeXBlLFxuICAgIH0pO1xuICAgIGVudmVsb3BlLmNvbm5lY3Qoc2VsZi5nYWluTm9kZS5nYWluKTtcbiAgICBlbnZlbG9wZS50cmlnZ2VyKCk7XG4gIH1cbn1cbiIsImltcG9ydCBBbXBsaXR1ZGVFbnZlbG9wZSBmcm9tICdhbXBsaXR1ZGUtZW52JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2luZ2xlT3NjIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMuY29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcbiAgICB0aGlzLmN1cnJlbnRUaW1lU291cmNlID0gb3B0aW9ucy5jdXJyZW50VGltZVNvdXJjZSB8fCB0aGlzLmNvbnRleHQ7XG5cbiAgICAvLyBUaW1pbmcgcGFyYW1zXG4gICAgdGhpcy5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICB0aGlzLmF0dGFja1RpbWUgPSBvcHRpb25zLmF0dGFja1RpbWU7XG4gICAgdGhpcy5zdXN0YWluVGltZSA9IG9wdGlvbnMuc3VzdGFpblRpbWU7XG4gICAgdGhpcy5yZWxlYXNlVGltZSA9IG9wdGlvbnMucmVsZWFzZVRpbWU7XG5cbiAgICAvLyBDdXJ2ZXNcbiAgICB0aGlzLmF0dGFja0N1cnZlVHlwZSA9IG9wdGlvbnMuYXR0YWNrQ3VydmVUeXBlIHx8ICdsaW5lYXInO1xuICAgIHRoaXMucmVsZWFzZUN1cnZlVHlwZSA9IG9wdGlvbnMucmVsZWFzZUN1cnZlVHlwZSB8fCAnbGluZWFyJztcblxuICAgIC8vIE5vbi10aW1pbmcgZW52ZWxvcCBwYXJhbVxuICAgIHRoaXMubWF4VmFsdWUgPSBvcHRpb25zLm1heFZhbHVlO1xuXG4gICAgLy8gT3NjaWxsYXRvciBwYXJhbVxuICAgIHRoaXMud2F2ZSA9IG9wdGlvbnMud2F2ZSB8fCAnc2F3dG9vdGgnO1xuXG4gICAgLy8gTWFzdGVyIGdhaW4gbm9kZVxuICAgIHRoaXMuZGVzdGluYXRpb25Ob2RlID0gdGhpcy5jb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uTm9kZS5nYWluLnZhbHVlID0gMTtcbiAgfVxuXG4gIHBsYXkoZnJlcSwgdGltZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBhdHRhY2tUaW1lID0gc2VsZi5hdHRhY2tUaW1lO1xuICAgIHZhciBzdXN0YWluVGltZSA9IHNlbGYuc3VzdGFpblRpbWU7XG4gICAgdmFyIHJlbGVhc2VUaW1lID0gc2VsZi5yZWxlYXNlVGltZTtcblxuICAgIC8vIFNldHVwIGVudmVsb3BlXG4gICAgdmFyIGVudmVsb3BlID0gbmV3IEFtcGxpdHVkZUVudmVsb3BlKHNlbGYuY29udGV4dCwge1xuICAgICAgY3VycmVudFRpbWVTb3VyY2U6IHNlbGYuY3VycmVudFRpbWVTb3VyY2UsXG4gICAgICBtYXhWYWx1ZTogc2VsZi5tYXhWYWx1ZSxcblxuICAgICAgLy8gdGltaW5nXG4gICAgICBzdGFydFRpbWU6IHRpbWUsXG4gICAgICBhdHRhY2tUaW1lOiBhdHRhY2tUaW1lLFxuICAgICAgc3VzdGFpblRpbWU6IHN1c3RhaW5UaW1lLFxuICAgICAgcmVsZWFzZVRpbWU6IHJlbGVhc2VUaW1lLFxuXG4gICAgICAvLyBjdXJ2ZXNcbiAgICAgIGF0dGFja0N1cnZlVHlwZTogc2VsZi5hdHRhY2tDdXJ2ZVR5cGUsXG4gICAgICByZWxlYXNlQ3VydmVUeXBlOiBzZWxmLnJlbGVhc2VDdXJ2ZVR5cGUsXG4gICAgfSk7XG5cbiAgICB2YXIgb3NjID0gc2VsZi5jb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICBvc2MudHlwZSA9IHNlbGYud2F2ZTtcblxuICAgIG9zYy5jb25uZWN0KGVudmVsb3BlLmdhaW5Ob2RlKTtcbiAgICBlbnZlbG9wZS5nYWluTm9kZS5jb25uZWN0KHNlbGYuZGVzdGluYXRpb25Ob2RlKTtcblxuICAgIC8vIFNldHVwIG9zY2lsbGF0b3JcbiAgICBvc2MuZnJlcXVlbmN5LnZhbHVlID0gZnJlcSB8fCA0NDA7XG5cbiAgICBlbnZlbG9wZS50cmlnZ2VyKCk7XG5cbiAgICBvc2Muc3RhcnQodGltZSk7XG5cbiAgICAvLyBTY2hlZHVsZSBzdG9wXG4gICAgb3NjLnN0b3AodGltZSArIGF0dGFja1RpbWUgKyBzdXN0YWluVGltZSArIHJlbGVhc2VUaW1lKTtcbiAgICBvc2Mub25lbmQgPSBmdW5jdGlvbiBub3RlRW5kKCkge1xuICAgICAgLy8gb25lbmRlZCBjbGVhbiB1cFxuICAgICAgLy8gbm90ZTogdGhpcyBkb2VzbnQgaGF2ZSB0byBiZSBmaXJlZCBvbmx5IHdoZW4gc3RvcCgpIGlzIGZpcmVkIHNpbmNlXG4gICAgICAvLyBpdCBpcyBjYWxsZWQgb25seSB3aGVuIHN0b3Agc3VjY2VlZHNcbiAgICAgIG9zYy5kaXNjb25uZWN0KCk7XG4gICAgfTtcbiAgfVxuICBjdXJyZW50VGltZSgpIHtcbiAgICBpZiAoIHRoaXMuY3VycmVudFRpbWVTb3VyY2UgJiYgdHlwZW9mIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWUgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZTtcbiAgICB9XG4gIH1cbiAgY29ubmVjdChub2RlKSB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbk5vZGUuY29ubmVjdChub2RlKTtcbiAgfVxufVxuIiwiaW1wb3J0IFNpbmdsZU9zYyBmcm9tICdzaW5nbGUtb3NjaWxsYXRvcic7XG5cbi8vIFNvdXJjZTpcbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU2MjQxMzkvNjMwNDkwXG5mdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcbiAgICAvLyBFeHBhbmQgc2hvcnRoYW5kIGZvcm0gKGUuZy4gXCIwM0ZcIikgdG8gZnVsbCBmb3JtIChlLmcuIFwiMDAzM0ZGXCIpXG4gICAgdmFyIHNob3J0aGFuZFJlZ2V4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaTtcbiAgICBoZXggPSBoZXgucmVwbGFjZShzaG9ydGhhbmRSZWdleCwgZnVuY3Rpb24obSwgciwgZywgYikge1xuICAgICAgICByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiO1xuICAgIH0pO1xuXG4gICAgdmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgIHJldHVybiByZXN1bHQgPyB7XG4gICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxuICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcbiAgICB9IDogbnVsbDtcbn1cbmZ1bmN0aW9uIGxpbmVyQ29sb3JJbnRlcnBvbGF0aW9uKCBmaXJzdENvbG9yLCBzZWNvbmRDb2xvciwgcGVyY2VudGFnZSApIHtcbiAgIHZhciByZ2IxID0gaGV4VG9SZ2IoZmlyc3RDb2xvcik7XG4gICB2YXIgcmdiMiA9IGhleFRvUmdiKHNlY29uZENvbG9yKTtcblxuICAgcmV0dXJuIE1hdGguZmxvb3IoXG4gICAvLyBSZWRcbiAgICBNYXRoLmZsb29yKCAoIHJnYjIuciAtIHJnYjEuciApICogcGVyY2VudGFnZSArIHJnYjEuciApICogMHgwMTAwMDAgK1xuICAgLy8gR3JlZW5cbiAgICBNYXRoLmZsb29yKCAoIHJnYjIuZyAtIHJnYjEuZyApICogcGVyY2VudGFnZSArIHJnYjEuZyApICogMHgwMDAxMDAgK1xuICAgLy8gQmx1ZVxuICAgIE1hdGguZmxvb3IoICggcmdiMi5iIC0gcmdiMS5iICkgKiBwZXJjZW50YWdlICsgcmdiMS5iICkgKiAweDAwMDAwMSBcbiAgICkudG9TdHJpbmcoMTYpO1xufVxuXG5mdW5jdGlvbiBnZW5NaW5vclNjYWxlKHN0YXJ0Tm90ZSkge1xuICAgdmFyIHNjYWxlID0gW107XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDIpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyAzKTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgNSk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDcpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyA4KTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgMTApO1xuICAgcmV0dXJuIHNjYWxlO1xufVxuZnVuY3Rpb24gZ2VuRW5pZ21hdGljU2NhbGUoc3RhcnROb3RlKSB7XG4gICB2YXIgc2NhbGUgPSBbXTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlKTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgMSk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDQpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyA3KTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgOSk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDExKTtcbiAgIHJldHVybiBzY2FsZTtcbn1cbmZ1bmN0aW9uIG5vdGVUb0ZyZXEobm90ZSkge1xuICAgcmV0dXJuIE1hdGgucG93KCAyLCAoIG5vdGUgLSA0OSAgKSAvIDEyICApICogNDQwO1xufVxuXG52YXIgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmN0eC50cmFuc2xhdGUoY2FudmFzLndpZHRoIC8gMiwgY2FudmFzLmhlaWdodCAvIDIpO1xuY3R4LnJvdGF0ZShNYXRoLlBJICogTWF0aC5yYW5kb20oKSk7XG5cbnZhciBhdWRpbyA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG5cbnZhciBtYXN0ZXJHYWluID0gYXVkaW8uY3JlYXRlR2FpbigpO1xubWFzdGVyR2Fpbi5jb25uZWN0KGF1ZGlvLmRlc3RpbmF0aW9uKTtcbm1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IDAuNTtcblxuXG52YXIgb3NjID0gbmV3IFNpbmdsZU9zYyh7XG4gICBjb250ZXh0OiBhdWRpbyxcbiAgIGF0dGFja1RpbWU6IDAuMSxcbiAgIHN1c3RhaW5UaW1lOiAwLjEsXG4gICByZWxlYXNlVGltZTogMC4wNzUsXG4gICBtYXhWYWx1ZTogMSxcblxuICAgLy8gT3NjXG4gICB3YXZlOiAndHJpYW5nbGUnLFxufSk7XG5cbm9zYy5jb25uZWN0KG1hc3RlckdhaW4pO1xuXG52YXIgcm90YXRpb24gPSAwO1xudmFyIHNpZGVMZW5ndGggPSBNYXRoLm1pbiggY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICkgLyAyO1xuXG52YXIgcmF0ZSA9IDAuMTtcblxudmFyIGNvbG9ycyA9IFtcbiAgICcjMDBhYTIzJyxcbiAgICcjMzdhYWYwJyxcbiAgICcjMjQ5MDViJyxcbiAgICcjYmNkZWYyJyxcbiAgICcjOTAyMzRjJyxcbl07XG5cbnZhciBiTWlub3IgPSBnZW5NaW5vclNjYWxlKDUxKS5yZXZlcnNlKClcbiAgIC5jb25jYXQoZ2VuTWlub3JTY2FsZSg1MS0xMikucmV2ZXJzZSgpKTtcbnZhciBnRW5pZyA9IGdlbkVuaWdtYXRpY1NjYWxlKDQ3KTtcbmdFbmlnID0gZ0VuaWcuY29uY2F0KGdFbmlnLnNsaWNlKCkucmV2ZXJzZSgpKTtcblxudmFyIHN0YXJ0VGltZSA9IGF1ZGlvLmN1cnJlbnRUaW1lICsgMTtcblxudmFyIHRoZVNjYWxlID0gYk1pbm9yO1xuXG5mb3IgKCBsZXQgaiA9IDA7IGogPCAzOyBqICsrICl7XG4gICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGVTY2FsZS5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbih0aW1lKSB7XG4gICAgICAgICBvc2MucGxheShub3RlVG9GcmVxKHRoZVNjYWxlW1xuICAgICAgICAgICAgKCAoIDEraSApICogKCAyK2ogKSApICUgdGhlU2NhbGUubGVuZ3RoXG4gICAgICAgICBdKSwgdGltZSk7XG4gICAgICB9LCAoIDEwMDAgKiBzdGFydFRpbWUgKSAtIDE1MCwgc3RhcnRUaW1lKTtcblxuICAgICAgLy8gRHJhdyByZWN0YW5nbGVcbiAgICAgIHZhciBhbW91bnQgPSBNYXRoLlBJICogMjMgLzQzO1xuICAgICAgLy9NYXRoLlBJICogMjMgLyA0MztcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCAocm90YXRlQnkpID0+IHtcbiAgICAgICAgIHZhciBzY2FsZSA9IDAuOTMwO1xuICAgICAgICAgY3R4LnNjYWxlKHNjYWxlLCBzY2FsZSk7XG4gICAgICAgICBjdHgucm90YXRlKHJvdGF0ZUJ5KTtcbiAgICAgICAgIC8vIGN0eC5yb3RhdGUoTWF0aC5wb3coIC0xICwgKCBqICUgMiApICkgKiByb3RhdGVCeSk7XG5cbiAgICAgICAgIC8vIEluY3JlbWVudCBmdXJ0aGVyXG4gICAgICAgICByb3RhdGlvbiArPSByb3RhdGVCeTtcblxuICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjJyArIGxpbmVyQ29sb3JJbnRlcnBvbGF0aW9uKFxuICAgICAgICAgICAgJyNGNDQ2NDUnLCAnIzMyMDAzRCcsXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAoIGogKiB0aGVTY2FsZS5sZW5ndGggKyBpICkgL1xuICAgICAgICAgICAgICAgICAgKCAzIC8gMiAqIHRoZVNjYWxlLmxlbmd0aCApXG4gICAgICAgICAgICApICUgMVxuICAgICAgICAgKTtcblxuICAgICAgICAgY3R4LmZpbGxSZWN0KC1zaWRlTGVuZ3RoIC8gMiwgLXNpZGVMZW5ndGggLyAyLCBzaWRlTGVuZ3RoLCBzaWRlTGVuZ3RoKTtcbiAgICAgIH0sIDEwMDAqIHN0YXJ0VGltZSwgYW1vdW50KTtcblxuICAgICAgc3RhcnRUaW1lICs9IHJhdGU7XG4gICB9XG59XG4iXX0=

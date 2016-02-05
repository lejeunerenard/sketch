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

var _singleOsc = require('single-osc');

var _singleOsc2 = _interopRequireDefault(_singleOsc);

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
masterGain.gain.value = 0.04;

var osc = new _singleOsc2.default({
   context: audio,
   attackTime: 0.05,
   sustainTime: 0.3,
   releaseTime: 0.075,
   maxValue: 1,

   // Osc
   wave: 'sine'
});

osc.connect(masterGain);

var rotation = 0;
var sideLength = Math.min(canvas.width, canvas.height) / 2;

var rate = 0.2;

var bMinor = genMinorScale(51).reverse().concat(genMinorScale(51 - 12).reverse());
var gEnig = genEnigmaticScale(47);
gEnig = gEnig.concat(gEnig.slice().reverse());

var startTime = audio.currentTime + 1;

var theScale = gEnig;

var amount = Math.PI * 23 / 43;
for (var i = 0; i < 100; i++) {
   // Random translation
   var shift = Math.random() * canvas.width / 15;
   ctx.translate(shift, shift);

   var scale = 0.970;
   ctx.scale(scale, scale);
   // ctx.rotate(amount);
   ctx.rotate(Math.pow(-1, 10 * i % 2) * amount);

   // Increment further
   rotation += amount;

   ctx.fillStyle = '#' + linerColorInterpolation('#fff', '#694A9A', i / 20 % 1);

   ctx.fillRect(-sideLength / 2, -sideLength / 2, sideLength, sideLength);
}

// for ( let j = 0; j < 5; j ++ ){
//    for ( let i = 0; i < theScale.length; i++ ) {
//       window.setTimeout( function(time) {
//          osc.play(noteToFreq(theScale[
//             ( ( 1+i ) * ( 1+j ) ) % theScale.length
//          ]), time);
//       }, ( 1000 * startTime ) - 150, startTime);
//
//       // Draw rectangle
//       var amount = Math.PI * 23 /43;
//       //Math.PI * 23 / 43;
//       window.setTimeout( (rotateBy) => {
//          // Random translation
//          var shift = Math.random() * canvas.width / 25;
//          ctx.translate(shift,shift);
//
//          var scale = 0.957;
//          ctx.scale(scale, scale);
//          ctx.rotate(rotateBy);
//          // ctx.rotate(Math.pow( -1 , ( j % 2 ) ) * rotateBy);
//
//          // Increment further
//          rotation += rotateBy;
//
//          ctx.fillStyle = '#' + linerColorInterpolation(
//             '#fff', '#694A9A',
//             (
//                ( j * theScale.length + i ) /
//                   ( 3 / 2 * theScale.length )
//             ) % 1
//          );
//
//          ctx.fillRect(-sideLength / 2, -sideLength / 2, sideLength, sideLength);
//       }, 1000* startTime, amount);
//
//       startTime += rate;
//    }
// }

},{"single-osc":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9kZWJ1Zy9icm93c2VyLmpzIiwiLi4vLi4vLi4vLi4vc2luZ2xlLW9zY2lsbGF0b3Ivbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9ub2RlX21vZHVsZXMvZGVidWcvZGVidWcuanMiLCIuLi8uLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIi4uLy4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL25vZGVfbW9kdWxlcy9hbXBsaXR1ZGUtZW52L2Rpc3Qvc3JjL2VudmVsb3BlLmpzIiwiLi4vLi4vLi4vLi4vc2luZ2xlLW9zY2lsbGF0b3Ivbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9zcmMvaW5kZXguanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjL2Rpc3Qvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL2Rpc3Qvbm9kZV9tb2R1bGVzL3NpbmdsZS1vc2MvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL2Rpc3Qvbm9kZV9tb2R1bGVzL3NpbmdsZS1vc2MvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2RlYnVnL2Jyb3dzZXIuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjL2FtcGxpdHVkZS1lbnYvZGlzdC9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9kZWJ1Zy9kZWJ1Zy5qcyIsIi4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL2Rpc3Qvbm9kZV9tb2R1bGVzL3NpbmdsZS1vc2MvYW1wbGl0dWRlLWVudi9kaXN0L25vZGVfbW9kdWxlcy9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL21zL2luZGV4LmpzIiwiLi4vLi4vLi4vc2luZ2xlLW9zY2lsbGF0b3IvZGlzdC9ub2RlX21vZHVsZXMvc2luZ2xlLW9zYy9hbXBsaXR1ZGUtZW52L2Rpc3Qvbm9kZV9tb2R1bGVzL2FtcGxpdHVkZS1lbnYvZGlzdC9zcmMvZW52ZWxvcGUuanMiLCIuLi8uLi8uLi9zaW5nbGUtb3NjaWxsYXRvci9kaXN0L25vZGVfbW9kdWxlcy9zaW5nbGUtb3NjL2FtcGxpdHVkZS1lbnYvZGlzdC9ub2RlX21vZHVsZXMvYW1wbGl0dWRlLWVudi9kaXN0L3NyYy9pbmRleC5qcyIsIi4uLy4uLy4uL3NpbmdsZS1vc2NpbGxhdG9yL2Rpc3Qvbm9kZV9tb2R1bGVzL3NpbmdsZS1vc2MvZGlzdC9zcmMvaW5kZXguanMiLCJzcmMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RmtCO0FBRzlCLE9BQUksU0FBSixDQUFjLEtBQWQsRUFBb0IsS0FBcEIsRUFIOEI7O0FBSzlCLE9BQUksUUFBUSxLQUFSLENBTDBCO0FBTTlCLE9BQUksS0FBSixDQUFVLEtBQVYsRUFBaUIsS0FBakI7O0FBTjhCLE1BUTlCLENBQUksTUFBSixDQUFXLEtBQUssR0FBTCxDQUFVLENBQUMsQ0FBRCxFQUFPLEVBQUUsR0FBSyxDQUFMLEdBQVcsQ0FBYixDQUFqQixHQUFzQyxNQUF0QyxDQUFYOzs7QUFSOEIsV0FXOUIsSUFBWSxNQUFaLENBWDhCOztBQWE5QixPQUFJLFNBQUosR0FBZ0IsTUFBTSx3QkFDbkIsTUFEbUIsRUFDWCxTQURXLEVBRW5CLENBQ0csR0FDRyxFQURILEdBRUMsQ0FISixDQUZhLENBYmM7O0FBcUI5QixPQUFJLFFBQUosQ0FBYSxDQUFDLFVBQUQsR0FBYyxDQUFkLEVBQWlCLENBQUMsVUFBRCxHQUFjLENBQWQsRUFBaUIsVUFBL0MsRUFBMkQsVUFBM0QsRUFyQjhCO0NBQWpDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9ICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWVcbiAgICAgICAgICAgICAgICYmICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWUuc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgPyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAgICAgICAgICAgICAgICAgOiBsb2NhbHN0b3JhZ2UoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG4gICdsaWdodHNlYWdyZWVuJyxcbiAgJ2ZvcmVzdGdyZWVuJyxcbiAgJ2dvbGRlbnJvZCcsXG4gICdkb2RnZXJibHVlJyxcbiAgJ2RhcmtvcmNoaWQnLFxuICAnY3JpbXNvbidcbl07XG5cbi8qKlxuICogQ3VycmVudGx5IG9ubHkgV2ViS2l0LWJhc2VkIFdlYiBJbnNwZWN0b3JzLCBGaXJlZm94ID49IHYzMSxcbiAqIGFuZCB0aGUgRmlyZWJ1ZyBleHRlbnNpb24gKGFueSBGaXJlZm94IHZlcnNpb24pIGFyZSBrbm93blxuICogdG8gc3VwcG9ydCBcIiVjXCIgQ1NTIGN1c3RvbWl6YXRpb25zLlxuICpcbiAqIFRPRE86IGFkZCBhIGBsb2NhbFN0b3JhZ2VgIHZhcmlhYmxlIHRvIGV4cGxpY2l0bHkgZW5hYmxlL2Rpc2FibGUgY29sb3JzXG4gKi9cblxuZnVuY3Rpb24gdXNlQ29sb3JzKCkge1xuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICByZXR1cm4gKCdXZWJraXRBcHBlYXJhbmNlJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUpIHx8XG4gICAgLy8gaXMgZmlyZWJ1Zz8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzk4MTIwLzM3Njc3M1xuICAgICh3aW5kb3cuY29uc29sZSAmJiAoY29uc29sZS5maXJlYnVnIHx8IChjb25zb2xlLmV4Y2VwdGlvbiAmJiBjb25zb2xlLnRhYmxlKSkpIHx8XG4gICAgLy8gaXMgZmlyZWZveCA+PSB2MzE/XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Ub29scy9XZWJfQ29uc29sZSNTdHlsaW5nX21lc3NhZ2VzXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5tYXRjaCgvZmlyZWZveFxcLyhcXGQrKS8pICYmIHBhcnNlSW50KFJlZ0V4cC4kMSwgMTApID49IDMxKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh2KTtcbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKCkge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuIGFyZ3M7XG5cbiAgdmFyIGMgPSAnY29sb3I6ICcgKyB0aGlzLmNvbG9yO1xuICBhcmdzID0gW2FyZ3NbMF0sIGMsICdjb2xvcjogaW5oZXJpdCddLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKSk7XG5cbiAgLy8gdGhlIGZpbmFsIFwiJWNcIiBpcyBzb21ld2hhdCB0cmlja3ksIGJlY2F1c2UgdGhlcmUgY291bGQgYmUgb3RoZXJcbiAgLy8gYXJndW1lbnRzIHBhc3NlZCBlaXRoZXIgYmVmb3JlIG9yIGFmdGVyIHRoZSAlYywgc28gd2UgbmVlZCB0b1xuICAvLyBmaWd1cmUgb3V0IHRoZSBjb3JyZWN0IGluZGV4IHRvIGluc2VydCB0aGUgQ1NTIGludG9cbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxhc3RDID0gMDtcbiAgYXJnc1swXS5yZXBsYWNlKC8lW2EteiVdL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgaWYgKCclJScgPT09IG1hdGNoKSByZXR1cm47XG4gICAgaW5kZXgrKztcbiAgICBpZiAoJyVjJyA9PT0gbWF0Y2gpIHtcbiAgICAgIC8vIHdlIG9ubHkgYXJlIGludGVyZXN0ZWQgaW4gdGhlICpsYXN0KiAlY1xuICAgICAgLy8gKHRoZSB1c2VyIG1heSBoYXZlIHByb3ZpZGVkIHRoZWlyIG93bilcbiAgICAgIGxhc3RDID0gaW5kZXg7XG4gICAgfVxuICB9KTtcblxuICBhcmdzLnNwbGljZShsYXN0QywgMCwgYyk7XG4gIHJldHVybiBhcmdzO1xufVxuXG4vKipcbiAqIEludm9rZXMgYGNvbnNvbGUubG9nKClgIHdoZW4gYXZhaWxhYmxlLlxuICogTm8tb3Agd2hlbiBgY29uc29sZS5sb2dgIGlzIG5vdCBhIFwiZnVuY3Rpb25cIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgLy8gdGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRTgvOSwgd2hlcmVcbiAgLy8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24gZG9lc24ndCBoYXZlICdhcHBseSdcbiAgcmV0dXJuICdvYmplY3QnID09PSB0eXBlb2YgY29uc29sZVxuICAgICYmIGNvbnNvbGUubG9nXG4gICAgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwoY29uc29sZS5sb2csIGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICB0cnkge1xuICAgIGlmIChudWxsID09IG5hbWVzcGFjZXMpIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5yZW1vdmVJdGVtKCdkZWJ1ZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UuZGVidWcgPSBuYW1lc3BhY2VzO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7fVxufVxuXG4vKipcbiAqIExvYWQgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gcmV0dXJucyB0aGUgcHJldmlvdXNseSBwZXJzaXN0ZWQgZGVidWcgbW9kZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHZhciByO1xuICB0cnkge1xuICAgIHIgPSBleHBvcnRzLnN0b3JhZ2UuZGVidWc7XG4gIH0gY2F0Y2goZSkge31cbiAgcmV0dXJuIHI7XG59XG5cbi8qKlxuICogRW5hYmxlIG5hbWVzcGFjZXMgbGlzdGVkIGluIGBsb2NhbFN0b3JhZ2UuZGVidWdgIGluaXRpYWxseS5cbiAqL1xuXG5leHBvcnRzLmVuYWJsZShsb2FkKCkpO1xuXG4vKipcbiAqIExvY2Fsc3RvcmFnZSBhdHRlbXB0cyB0byByZXR1cm4gdGhlIGxvY2Fsc3RvcmFnZS5cbiAqXG4gKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHNhZmFyaSB0aHJvd3NcbiAqIHdoZW4gYSB1c2VyIGRpc2FibGVzIGNvb2tpZXMvbG9jYWxzdG9yYWdlXG4gKiBhbmQgeW91IGF0dGVtcHQgdG8gYWNjZXNzIGl0LlxuICpcbiAqIEByZXR1cm4ge0xvY2FsU3RvcmFnZX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvY2Fsc3RvcmFnZSgpe1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGRlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogVGhlIGN1cnJlbnRseSBhY3RpdmUgZGVidWcgbW9kZSBuYW1lcywgYW5kIG5hbWVzIHRvIHNraXAuXG4gKi9cblxuZXhwb3J0cy5uYW1lcyA9IFtdO1xuZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4vKipcbiAqIE1hcCBvZiBzcGVjaWFsIFwiJW5cIiBoYW5kbGluZyBmdW5jdGlvbnMsIGZvciB0aGUgZGVidWcgXCJmb3JtYXRcIiBhcmd1bWVudC5cbiAqXG4gKiBWYWxpZCBrZXkgbmFtZXMgYXJlIGEgc2luZ2xlLCBsb3dlcmNhc2VkIGxldHRlciwgaS5lLiBcIm5cIi5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMgPSB7fTtcblxuLyoqXG4gKiBQcmV2aW91c2x5IGFzc2lnbmVkIGNvbG9yLlxuICovXG5cbnZhciBwcmV2Q29sb3IgPSAwO1xuXG4vKipcbiAqIFByZXZpb3VzIGxvZyB0aW1lc3RhbXAuXG4gKi9cblxudmFyIHByZXZUaW1lO1xuXG4vKipcbiAqIFNlbGVjdCBhIGNvbG9yLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlbGVjdENvbG9yKCkge1xuICByZXR1cm4gZXhwb3J0cy5jb2xvcnNbcHJldkNvbG9yKysgJSBleHBvcnRzLmNvbG9ycy5sZW5ndGhdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWJ1ZyhuYW1lc3BhY2UpIHtcblxuICAvLyBkZWZpbmUgdGhlIGBkaXNhYmxlZGAgdmVyc2lvblxuICBmdW5jdGlvbiBkaXNhYmxlZCgpIHtcbiAgfVxuICBkaXNhYmxlZC5lbmFibGVkID0gZmFsc2U7XG5cbiAgLy8gZGVmaW5lIHRoZSBgZW5hYmxlZGAgdmVyc2lvblxuICBmdW5jdGlvbiBlbmFibGVkKCkge1xuXG4gICAgdmFyIHNlbGYgPSBlbmFibGVkO1xuXG4gICAgLy8gc2V0IGBkaWZmYCB0aW1lc3RhbXBcbiAgICB2YXIgY3VyciA9ICtuZXcgRGF0ZSgpO1xuICAgIHZhciBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG4gICAgc2VsZi5kaWZmID0gbXM7XG4gICAgc2VsZi5wcmV2ID0gcHJldlRpbWU7XG4gICAgc2VsZi5jdXJyID0gY3VycjtcbiAgICBwcmV2VGltZSA9IGN1cnI7XG5cbiAgICAvLyBhZGQgdGhlIGBjb2xvcmAgaWYgbm90IHNldFxuICAgIGlmIChudWxsID09IHNlbGYudXNlQ29sb3JzKSBzZWxmLnVzZUNvbG9ycyA9IGV4cG9ydHMudXNlQ29sb3JzKCk7XG4gICAgaWYgKG51bGwgPT0gc2VsZi5jb2xvciAmJiBzZWxmLnVzZUNvbG9ycykgc2VsZi5jb2xvciA9IHNlbGVjdENvbG9yKCk7XG5cbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICBhcmdzWzBdID0gZXhwb3J0cy5jb2VyY2UoYXJnc1swXSk7XG5cbiAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAvLyBhbnl0aGluZyBlbHNlIGxldCdzIGluc3BlY3Qgd2l0aCAlb1xuICAgICAgYXJncyA9IFsnJW8nXS5jb25jYXQoYXJncyk7XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EteiVdKS9nLCBmdW5jdGlvbihtYXRjaCwgZm9ybWF0KSB7XG4gICAgICAvLyBpZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG4gICAgICBpZiAobWF0Y2ggPT09ICclJScpIHJldHVybiBtYXRjaDtcbiAgICAgIGluZGV4Kys7XG4gICAgICB2YXIgZm9ybWF0dGVyID0gZXhwb3J0cy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdHRlcikge1xuICAgICAgICB2YXIgdmFsID0gYXJnc1tpbmRleF07XG4gICAgICAgIG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuICAgICAgICAvLyBub3cgd2UgbmVlZCB0byByZW1vdmUgYGFyZ3NbaW5kZXhdYCBzaW5jZSBpdCdzIGlubGluZWQgaW4gdGhlIGBmb3JtYXRgXG4gICAgICAgIGFyZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaW5kZXgtLTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcblxuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5mb3JtYXRBcmdzKSB7XG4gICAgICBhcmdzID0gZXhwb3J0cy5mb3JtYXRBcmdzLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgICB2YXIgbG9nRm4gPSBlbmFibGVkLmxvZyB8fCBleHBvcnRzLmxvZyB8fCBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuICAgIGxvZ0ZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9XG4gIGVuYWJsZWQuZW5hYmxlZCA9IHRydWU7XG5cbiAgdmFyIGZuID0gZXhwb3J0cy5lbmFibGVkKG5hbWVzcGFjZSkgPyBlbmFibGVkIDogZGlzYWJsZWQ7XG5cbiAgZm4ubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuXG4gIHJldHVybiBmbjtcbn1cblxuLyoqXG4gKiBFbmFibGVzIGEgZGVidWcgbW9kZSBieSBuYW1lc3BhY2VzLiBUaGlzIGNhbiBpbmNsdWRlIG1vZGVzXG4gKiBzZXBhcmF0ZWQgYnkgYSBjb2xvbiBhbmQgd2lsZGNhcmRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZShuYW1lc3BhY2VzKSB7XG4gIGV4cG9ydHMuc2F2ZShuYW1lc3BhY2VzKTtcblxuICB2YXIgc3BsaXQgPSAobmFtZXNwYWNlcyB8fCAnJykuc3BsaXQoL1tcXHMsXSsvKTtcbiAgdmFyIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFzcGxpdFtpXSkgY29udGludWU7IC8vIGlnbm9yZSBlbXB0eSBzdHJpbmdzXG4gICAgbmFtZXNwYWNlcyA9IHNwbGl0W2ldLnJlcGxhY2UoL1xcKi9nLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVzcGFjZXNbMF0gPT09ICctJykge1xuICAgICAgZXhwb3J0cy5za2lwcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcy5zdWJzdHIoMSkgKyAnJCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5uYW1lcy5wdXNoKG5ldyBSZWdFeHAoJ14nICsgbmFtZXNwYWNlcyArICckJykpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpc2FibGUgZGVidWcgb3V0cHV0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGlzYWJsZSgpIHtcbiAgZXhwb3J0cy5lbmFibGUoJycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gbW9kZSBuYW1lIGlzIGVuYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlZChuYW1lKSB7XG4gIHZhciBpLCBsZW47XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMuc2tpcHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IGV4cG9ydHMubmFtZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoZXhwb3J0cy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENvZXJjZSBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY29lcmNlKHZhbCkge1xuICBpZiAodmFsIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWwuc3RhY2sgfHwgdmFsLm1lc3NhZ2U7XG4gIHJldHVybiB2YWw7XG59XG4iLCIvKipcbiAqIEhlbHBlcnMuXG4gKi9cblxudmFyIHMgPSAxMDAwO1xudmFyIG0gPSBzICogNjA7XG52YXIgaCA9IG0gKiA2MDtcbnZhciBkID0gaCAqIDI0O1xudmFyIHkgPSBkICogMzY1LjI1O1xuXG4vKipcbiAqIFBhcnNlIG9yIGZvcm1hdCB0aGUgZ2l2ZW4gYHZhbGAuXG4gKlxuICogT3B0aW9uczpcbiAqXG4gKiAgLSBgbG9uZ2AgdmVyYm9zZSBmb3JtYXR0aW5nIFtmYWxzZV1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsLCBvcHRpb25zKXtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgdmFsKSByZXR1cm4gcGFyc2UodmFsKTtcbiAgcmV0dXJuIG9wdGlvbnMubG9uZ1xuICAgID8gbG9uZyh2YWwpXG4gICAgOiBzaG9ydCh2YWwpO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9ICcnICsgc3RyO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMDAwKSByZXR1cm47XG4gIHZhciBtYXRjaCA9IC9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoc3RyKTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB2YXIgdHlwZSA9IChtYXRjaFsyXSB8fCAnbXMnKS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICd5ZWFycyc6XG4gICAgY2FzZSAneWVhcic6XG4gICAgY2FzZSAneXJzJzpcbiAgICBjYXNlICd5cic6XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gbiAqIHk7XG4gICAgY2FzZSAnZGF5cyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkJzpcbiAgICAgIHJldHVybiBuICogZDtcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnaG91cic6XG4gICAgY2FzZSAnaHJzJzpcbiAgICBjYXNlICdocic6XG4gICAgY2FzZSAnaCc6XG4gICAgICByZXR1cm4gbiAqIGg7XG4gICAgY2FzZSAnbWludXRlcyc6XG4gICAgY2FzZSAnbWludXRlJzpcbiAgICBjYXNlICdtaW5zJzpcbiAgICBjYXNlICdtaW4nOlxuICAgIGNhc2UgJ20nOlxuICAgICAgcmV0dXJuIG4gKiBtO1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgY2FzZSAnc2Vjcyc6XG4gICAgY2FzZSAnc2VjJzpcbiAgICBjYXNlICdzJzpcbiAgICAgIHJldHVybiBuICogcztcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICBjYXNlICdtc2Vjcyc6XG4gICAgY2FzZSAnbXNlYyc6XG4gICAgY2FzZSAnbXMnOlxuICAgICAgcmV0dXJuIG47XG4gIH1cbn1cblxuLyoqXG4gKiBTaG9ydCBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzaG9ydChtcykge1xuICBpZiAobXMgPj0gZCkgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgaWYgKG1zID49IGgpIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIGlmIChtcyA+PSBtKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICBpZiAobXMgPj0gcykgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgcmV0dXJuIG1zICsgJ21zJztcbn1cblxuLyoqXG4gKiBMb25nIGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGxvbmcobXMpIHtcbiAgcmV0dXJuIHBsdXJhbChtcywgZCwgJ2RheScpXG4gICAgfHwgcGx1cmFsKG1zLCBoLCAnaG91cicpXG4gICAgfHwgcGx1cmFsKG1zLCBtLCAnbWludXRlJylcbiAgICB8fCBwbHVyYWwobXMsIHMsICdzZWNvbmQnKVxuICAgIHx8IG1zICsgJyBtcyc7XG59XG5cbi8qKlxuICogUGx1cmFsaXphdGlvbiBoZWxwZXIuXG4gKi9cblxuZnVuY3Rpb24gcGx1cmFsKG1zLCBuLCBuYW1lKSB7XG4gIGlmIChtcyA8IG4pIHJldHVybjtcbiAgaWYgKG1zIDwgbiAqIDEuNSkgcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWU7XG4gIHJldHVybiBNYXRoLmNlaWwobXMgLyBuKSArICcgJyArIG5hbWUgKyAncyc7XG59XG4iLCJpbXBvcnQgZGVidWdHZW4gZnJvbSAnZGVidWcnO1xuXG5jb25zdCBkZWJ1ZyA9IGRlYnVnR2VuKCdlbnZlbG9wZS1ldmVudCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCwgc3RhcnRWYWx1ZSwgZW5kVmFsdWUsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGlmICggIWNvbnRleHQgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F1ZGlvQ29udGV4dCBpcyByZXF1aXJlZCcpO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBzdGFydFZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gc3RhcnRWYWx1ZSBpcyByZXF1aXJlZCcpO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBlbmRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIGVuZFZhbHVlIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgLy8gUmVxdWlyZWQgdmFsdWVzXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLnN0YXJ0VmFsdWUgPSBzdGFydFZhbHVlO1xuICAgIHRoaXMuZW5kVmFsdWUgPSBlbmRWYWx1ZTtcblxuICAgIC8vIE9wdGlvbmFsIHZhbHVlc1xuICAgIHRoaXMuc3RhcnRUaW1lID0gb3B0aW9ucy5zdGFydFRpbWUgfHwgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIHRoaXMudHJhbnNpdGlvblRpbWUgPSBvcHRpb25zLnRyYW5zaXRpb25UaW1lIHx8IDAuMTtcblxuICAgIHRoaXMuY3VydmVUeXBlID0gb3B0aW9ucy5jdXJ2ZVR5cGU7XG4gIH1cblxuICBnZXRFcXVhbFBvd2VyQ3VydmUoc2NhbGUsIG9mZnNldCkge1xuICAgIHNjYWxlID0gc2NhbGUgfHwgMTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblxuICAgIHZhciBjdXJ2ZUxlbmd0aCA9IHRoaXMuY29udGV4dC5zYW1wbGVSYXRlO1xuICAgIHZhciBjdXJ2ZSA9IG5ldyBGbG9hdDMyQXJyYXkoY3VydmVMZW5ndGgpO1xuXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgY3VydmVMZW5ndGg7IGkrKyApIHtcbiAgICAgIGN1cnZlW2ldID0gc2NhbGUgKiBNYXRoLmNvcyhNYXRoLlBJICogKCBpL2N1cnZlTGVuZ3RoICsgMSApIC8gNCkgKyBvZmZzZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnZlO1xuICB9XG5cbiAgdHJpZ2dlcigpIHtcbiAgICB0aGlzLnBhcmFtLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyh0aGlzLnN0YXJ0VGltZSk7XG4gICAgdGhpcy5wYXJhbS5zZXRWYWx1ZUF0VGltZSh0aGlzLnN0YXJ0VmFsdWUsIHRoaXMuc3RhcnRUaW1lKTtcbiAgICBzd2l0Y2ggKCB0aGlzLmN1cnZlVHlwZSApIHtcbiAgICAgIGNhc2UgJ2VxdWFsUG93ZXJGYWRlSW4nOlxuICAgICAgICB2YXIgc2NhbGUgPSBNYXRoLmFicyh0aGlzLmVuZFZhbHVlIC0gdGhpcy5zdGFydFZhbHVlKTtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuc3RhcnRWYWx1ZTtcblxuICAgICAgICB0aGlzLnBhcmFtLnNldFZhbHVlQ3VydmVBdFRpbWUodGhpcy5nZXRFcXVhbFBvd2VyQ3VydmUoc2NhbGUsIG9mZnNldCkucmV2ZXJzZSgpLCB0aGlzLnN0YXJ0VGltZSwgdGhpcy50cmFuc2l0aW9uVGltZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXF1YWxQb3dlckZhZGVPdXQnOlxuICAgICAgICB2YXIgc2NhbGUgPSBNYXRoLmFicyh0aGlzLnN0YXJ0VmFsdWUgLSB0aGlzLmVuZFZhbHVlKTtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuZW5kVmFsdWU7XG5cbiAgICAgICAgdGhpcy5wYXJhbS5zZXRWYWx1ZUN1cnZlQXRUaW1lKHRoaXMuZ2V0RXF1YWxQb3dlckN1cnZlKHNjYWxlLCBvZmZzZXQpLCB0aGlzLnN0YXJ0VGltZSwgdGhpcy50cmFuc2l0aW9uVGltZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGluZWFyJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucGFyYW0ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5lbmRWYWx1ZSwgdGhpcy5zdGFydFRpbWUgKyB0aGlzLnRyYW5zaXRpb25UaW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZGVidWcoJ25ldyBlbnYnKTtcbiAgICBkZWJ1ZygnY3VycmVudCB0aW1lJywgdGhpcy5jb250ZXh0LmN1cnJlbnRUaW1lKTtcbiAgICBkZWJ1Zygnc3RhcnRUaW1lJywgdGhpcy5zdGFydFRpbWUsICd0cmFuc2l0aW9uVGltZScsIHRoaXMudHJhbnNpdGlvblRpbWUsICdzdGFydFZhbHUnLCB0aGlzLnN0YXJ0VmFsdWUsICdlbmRWYWx1ZScsIHRoaXMuZW5kVmFsdWUpO1xuICB9XG5cbiAgY29ubmVjdChwYXJhbSkge1xuICAgIHRoaXMucGFyYW0gPSBwYXJhbTtcbiAgfVxufVxuIiwiaW1wb3J0IEVudmVsb3BlRXZlbnRHZW5lcmF0b3IgZnJvbSAnLi9lbnZlbG9wZS5qcyc7XG5pbXBvcnQgZGVidWdHZW4gZnJvbSAnZGVidWcnO1xuXG5jb25zdCBkZWJ1ZyA9IGRlYnVnR2VuKCdhbXBsaXR1ZGUtZW52ZWxvcGUnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW1wbGl0dWRlRW52ZWxvcGUge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBvcHRpb25zKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgLy8gLS0tLS0gb3B0aW9ucyAtLS0tLVxuICAgIHNlbGYub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAvLyBUaW1pbmdcbiAgICBzZWxmLmN1cnJlbnRUaW1lU291cmNlID0gb3B0aW9ucy5jdXJyZW50VGltZVNvdXJjZSB8fCBzZWxmLmNvbnRleHQ7XG4gICAgc2VsZi5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICBzZWxmLmF0dGFja1RpbWUgPSBvcHRpb25zLmF0dGFja1RpbWU7XG4gICAgc2VsZi5zdXN0YWluVGltZSA9IG9wdGlvbnMuc3VzdGFpblRpbWU7XG4gICAgc2VsZi5yZWxlYXNlVGltZSA9IG9wdGlvbnMucmVsZWFzZVRpbWU7XG5cbiAgICBzZWxmLm1heFZhbHVlID0gb3B0aW9ucy5tYXhWYWx1ZTtcblxuICAgIC8vIEN1cnZlXG4gICAgc2VsZi5hdHRhY2tDdXJ2ZVR5cGUgPSBvcHRpb25zLmF0dGFja0N1cnZlVHlwZSB8fCAnbGluZWFyJztcbiAgICBzZWxmLnJlbGVhc2VDdXJ2ZVR5cGUgPSBvcHRpb25zLnJlbGVhc2VDdXJ2ZVR5cGUgfHwgJ2xpbmVhcic7XG5cbiAgICAvLyBDcmVhdGUgR2FpbiBOb2RlIGFuZCBmaXJzdCBFbnZlbG9wZVxuICAgIHNlbGYuZ2Fpbk5vZGUgPSBzZWxmLmNvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHNlbGYuZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDA7XG4gIH1cblxuICBjdXJyZW50VGltZSgpIHtcbiAgICBpZiAoIHRoaXMuY3VycmVudFRpbWVTb3VyY2UgJiYgdHlwZW9mIHRoaXMuY3VycmVudFRpbWVTb3VyY2UuY3VycmVudFRpbWUgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZTtcbiAgICB9XG4gIH1cbiAgdHJpZ2dlcigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnJpc2VFbnZlbG9wZSA9IG5ldyBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yKHNlbGYuY29udGV4dCwgMCwgc2VsZi5tYXhWYWx1ZSwge1xuICAgICAgc3RhcnRUaW1lOiBzZWxmLnN0YXJ0VGltZSxcbiAgICAgIHRyYW5zaXRpb25UaW1lOiBzZWxmLmF0dGFja1RpbWUsXG4gICAgICBjdXJ2ZVR5cGU6IHNlbGYuYXR0YWNrQ3VydmVUeXBlLFxuICAgIH0pO1xuICAgIHNlbGYucmlzZUVudmVsb3BlLmNvbm5lY3Qoc2VsZi5nYWluTm9kZS5nYWluKTtcbiAgICBzZWxmLnJpc2VFbnZlbG9wZS50cmlnZ2VyKCk7XG5cbiAgICBkZWJ1ZygnYW1wIGVudicpO1xuICAgIGRlYnVnKCdzdGFydFRpbWUnLCBzZWxmLnN0YXJ0VGltZSwgJ2F0dGFja1RpbWUnLCBzZWxmLmF0dGFja1RpbWUsICdzdXN0YWluVGltZScsIHNlbGYuc3VzdGFpblRpbWUsICdyZWxlYXNlVGltZScsIHNlbGYucmVsZWFzZVRpbWUpO1xuXG4gICAgLy8gU2NoZWR1bGUgcmVsZWFzZSBlbnZlbG9wZVxuICAgIHZhciBlbnZlbG9wZSA9IG5ldyBFbnZlbG9wZUV2ZW50R2VuZXJhdG9yKHNlbGYuY29udGV4dCwgc2VsZi5tYXhWYWx1ZSwgMCwge1xuICAgICAgc3RhcnRUaW1lOiBzZWxmLnN0YXJ0VGltZSArIHNlbGYuYXR0YWNrVGltZSArIHNlbGYuc3VzdGFpblRpbWUsXG4gICAgICB0cmFuc2l0aW9uVGltZTogc2VsZi5yZWxlYXNlVGltZSxcbiAgICAgIGN1cnZlVHlwZTogc2VsZi5yZWxlYXNlQ3VydmVUeXBlLFxuICAgIH0pO1xuICAgIGVudmVsb3BlLmNvbm5lY3Qoc2VsZi5nYWluTm9kZS5nYWluKTtcbiAgICBlbnZlbG9wZS50cmlnZ2VyKCk7XG4gIH1cbn1cbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogVGhpcyBpcyB0aGUgd2ViIGJyb3dzZXIgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5zdG9yYWdlID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZVxuICAgICAgICAgICAgICAgJiYgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZS5zdG9yYWdlXG4gICAgICAgICAgICAgICAgICA/IGNocm9tZS5zdG9yYWdlLmxvY2FsXG4gICAgICAgICAgICAgICAgICA6IGxvY2Fsc3RvcmFnZSgpO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFtcbiAgJ2xpZ2h0c2VhZ3JlZW4nLFxuICAnZm9yZXN0Z3JlZW4nLFxuICAnZ29sZGVucm9kJyxcbiAgJ2RvZGdlcmJsdWUnLFxuICAnZGFya29yY2hpZCcsXG4gICdjcmltc29uJ1xuXTtcblxuLyoqXG4gKiBDdXJyZW50bHkgb25seSBXZWJLaXQtYmFzZWQgV2ViIEluc3BlY3RvcnMsIEZpcmVmb3ggPj0gdjMxLFxuICogYW5kIHRoZSBGaXJlYnVnIGV4dGVuc2lvbiAoYW55IEZpcmVmb3ggdmVyc2lvbikgYXJlIGtub3duXG4gKiB0byBzdXBwb3J0IFwiJWNcIiBDU1MgY3VzdG9taXphdGlvbnMuXG4gKlxuICogVE9ETzogYWRkIGEgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGUgdG8gZXhwbGljaXRseSBlbmFibGUvZGlzYWJsZSBjb2xvcnNcbiAqL1xuXG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG4gIC8vIGlzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIHJldHVybiAoJ1dlYmtpdEFwcGVhcmFuY2UnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHdpbmRvdy5jb25zb2xlICYmIChjb25zb2xlLmZpcmVidWcgfHwgKGNvbnNvbGUuZXhjZXB0aW9uICYmIGNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykgJiYgcGFyc2VJbnQoUmVnRXhwLiQxLCAxMCkgPj0gMzEpO1xufVxuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xufTtcblxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgYXJnc1swXSA9ICh1c2VDb2xvcnMgPyAnJWMnIDogJycpXG4gICAgKyB0aGlzLm5hbWVzcGFjZVxuICAgICsgKHVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKVxuICAgICsgYXJnc1swXVxuICAgICsgKHVzZUNvbG9ycyA/ICclYyAnIDogJyAnKVxuICAgICsgJysnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdXNlQ29sb3JzKSByZXR1cm4gYXJncztcblxuICB2YXIgYyA9ICdjb2xvcjogJyArIHRoaXMuY29sb3I7XG4gIGFyZ3MgPSBbYXJnc1swXSwgYywgJ2NvbG9yOiBpbmhlcml0J10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKTtcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16JV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbiAgcmV0dXJuIGFyZ3M7XG59XG5cbi8qKlxuICogSW52b2tlcyBgY29uc29sZS5sb2coKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmxvZ2AgaXMgbm90IGEgXCJmdW5jdGlvblwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbG9nKCkge1xuICAvLyB0aGlzIGhhY2tlcnkgaXMgcmVxdWlyZWQgZm9yIElFOC85LCB3aGVyZVxuICAvLyB0aGUgYGNvbnNvbGUubG9nYCBmdW5jdGlvbiBkb2Vzbid0IGhhdmUgJ2FwcGx5J1xuICByZXR1cm4gJ29iamVjdCcgPT09IHR5cGVvZiBjb25zb2xlXG4gICAgJiYgY29uc29sZS5sb2dcbiAgICAmJiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmxvZywgY29uc29sZSwgYXJndW1lbnRzKTtcbn1cblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG4gIHRyeSB7XG4gICAgaWYgKG51bGwgPT0gbmFtZXNwYWNlcykge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLnJlbW92ZUl0ZW0oJ2RlYnVnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5kZWJ1ZyA9IG5hbWVzcGFjZXM7XG4gICAgfVxuICB9IGNhdGNoKGUpIHt9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgdmFyIHI7XG4gIHRyeSB7XG4gICAgciA9IGV4cG9ydHMuc3RvcmFnZS5kZWJ1ZztcbiAgfSBjYXRjaChlKSB7fVxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG4iLCJcbi8qKlxuICogVGhpcyBpcyB0aGUgY29tbW9uIGxvZ2ljIGZvciBib3RoIHRoZSBOb2RlLmpzIGFuZCB3ZWIgYnJvd3NlclxuICogaW1wbGVtZW50YXRpb25zIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZGVidWc7XG5leHBvcnRzLmNvZXJjZSA9IGNvZXJjZTtcbmV4cG9ydHMuZGlzYWJsZSA9IGRpc2FibGU7XG5leHBvcnRzLmVuYWJsZSA9IGVuYWJsZTtcbmV4cG9ydHMuZW5hYmxlZCA9IGVuYWJsZWQ7XG5leHBvcnRzLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblxuLyoqXG4gKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBkZWJ1ZyBtb2RlIG5hbWVzLCBhbmQgbmFtZXMgdG8gc2tpcC5cbiAqL1xuXG5leHBvcnRzLm5hbWVzID0gW107XG5leHBvcnRzLnNraXBzID0gW107XG5cbi8qKlxuICogTWFwIG9mIHNwZWNpYWwgXCIlblwiIGhhbmRsaW5nIGZ1bmN0aW9ucywgZm9yIHRoZSBkZWJ1ZyBcImZvcm1hdFwiIGFyZ3VtZW50LlxuICpcbiAqIFZhbGlkIGtleSBuYW1lcyBhcmUgYSBzaW5nbGUsIGxvd2VyY2FzZWQgbGV0dGVyLCBpLmUuIFwiblwiLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycyA9IHt9O1xuXG4vKipcbiAqIFByZXZpb3VzbHkgYXNzaWduZWQgY29sb3IuXG4gKi9cblxudmFyIHByZXZDb2xvciA9IDA7XG5cbi8qKlxuICogUHJldmlvdXMgbG9nIHRpbWVzdGFtcC5cbiAqL1xuXG52YXIgcHJldlRpbWU7XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKlxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VsZWN0Q29sb3IoKSB7XG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1twcmV2Q29sb3IrKyAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlYnVnKG5hbWVzcGFjZSkge1xuXG4gIC8vIGRlZmluZSB0aGUgYGRpc2FibGVkYCB2ZXJzaW9uXG4gIGZ1bmN0aW9uIGRpc2FibGVkKCkge1xuICB9XG4gIGRpc2FibGVkLmVuYWJsZWQgPSBmYWxzZTtcblxuICAvLyBkZWZpbmUgdGhlIGBlbmFibGVkYCB2ZXJzaW9uXG4gIGZ1bmN0aW9uIGVuYWJsZWQoKSB7XG5cbiAgICB2YXIgc2VsZiA9IGVuYWJsZWQ7XG5cbiAgICAvLyBzZXQgYGRpZmZgIHRpbWVzdGFtcFxuICAgIHZhciBjdXJyID0gK25ldyBEYXRlKCk7XG4gICAgdmFyIG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcbiAgICBzZWxmLmRpZmYgPSBtcztcbiAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICBzZWxmLmN1cnIgPSBjdXJyO1xuICAgIHByZXZUaW1lID0gY3VycjtcblxuICAgIC8vIGFkZCB0aGUgYGNvbG9yYCBpZiBub3Qgc2V0XG4gICAgaWYgKG51bGwgPT0gc2VsZi51c2VDb2xvcnMpIHNlbGYudXNlQ29sb3JzID0gZXhwb3J0cy51c2VDb2xvcnMoKTtcbiAgICBpZiAobnVsbCA9PSBzZWxmLmNvbG9yICYmIHNlbGYudXNlQ29sb3JzKSBzZWxmLmNvbG9yID0gc2VsZWN0Q29sb3IoKTtcblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIGFyZ3NbMF0gPSBleHBvcnRzLmNvZXJjZShhcmdzWzBdKTtcblxuICAgIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgIC8vIGFueXRoaW5nIGVsc2UgbGV0J3MgaW5zcGVjdCB3aXRoICVvXG4gICAgICBhcmdzID0gWyclbyddLmNvbmNhdChhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16JV0pL2csIGZ1bmN0aW9uKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgIC8vIGlmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgIGlmIChtYXRjaCA9PT0gJyUlJykgcmV0dXJuIG1hdGNoO1xuICAgICAgaW5kZXgrKztcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSBleHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgbWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG4gICAgICAgIC8vIG5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcbiAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBleHBvcnRzLmZvcm1hdEFyZ3MpIHtcbiAgICAgIGFyZ3MgPSBleHBvcnRzLmZvcm1hdEFyZ3MuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICAgIHZhciBsb2dGbiA9IGVuYWJsZWQubG9nIHx8IGV4cG9ydHMubG9nIHx8IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4gICAgbG9nRm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cbiAgZW5hYmxlZC5lbmFibGVkID0gdHJ1ZTtcblxuICB2YXIgZm4gPSBleHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKSA/IGVuYWJsZWQgOiBkaXNhYmxlZDtcblxuICBmbi5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cbiAgcmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcbiAqIHNlcGFyYXRlZCBieSBhIGNvbG9uIGFuZCB3aWxkY2FyZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlKG5hbWVzcGFjZXMpIHtcbiAgZXhwb3J0cy5zYXZlKG5hbWVzcGFjZXMpO1xuXG4gIHZhciBzcGxpdCA9IChuYW1lc3BhY2VzIHx8ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuICB2YXIgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoIXNwbGl0W2ldKSBjb250aW51ZTsgLy8gaWdub3JlIGVtcHR5IHN0cmluZ3NcbiAgICBuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcbiAgICBpZiAobmFtZXNwYWNlc1swXSA9PT0gJy0nKSB7XG4gICAgICBleHBvcnRzLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzLnN1YnN0cigxKSArICckJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkaXNhYmxlKCkge1xuICBleHBvcnRzLmVuYWJsZSgnJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcbiAgdmFyIGksIGxlbjtcbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ29lcmNlIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb2VyY2UodmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHZhbC5zdGFjayB8fCB2YWwubWVzc2FnZTtcbiAgcmV0dXJuIHZhbDtcbn1cbiIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpe1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2YWwpIHJldHVybiBwYXJzZSh2YWwpO1xuICByZXR1cm4gb3B0aW9ucy5sb25nXG4gICAgPyBsb25nKHZhbClcbiAgICA6IHNob3J0KHZhbCk7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgc3RyID0gJycgKyBzdHI7XG4gIGlmIChzdHIubGVuZ3RoID4gMTAwMDApIHJldHVybjtcbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhzdHIpO1xuICBpZiAoIW1hdGNoKSByZXR1cm47XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNob3J0KG1zKSB7XG4gIGlmIChtcyA+PSBkKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICBpZiAobXMgPj0gaCkgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgaWYgKG1zID49IG0pIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIGlmIChtcyA+PSBzKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9uZyhtcykge1xuICByZXR1cm4gcGx1cmFsKG1zLCBkLCAnZGF5JylcbiAgICB8fCBwbHVyYWwobXMsIGgsICdob3VyJylcbiAgICB8fCBwbHVyYWwobXMsIG0sICdtaW51dGUnKVxuICAgIHx8IHBsdXJhbChtcywgcywgJ3NlY29uZCcpXG4gICAgfHwgbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG4sIG5hbWUpIHtcbiAgaWYgKG1zIDwgbikgcmV0dXJuO1xuICBpZiAobXMgPCBuICogMS41KSByZXR1cm4gTWF0aC5mbG9vcihtcyAvIG4pICsgJyAnICsgbmFtZTtcbiAgcmV0dXJuIE1hdGguY2VpbChtcyAvIG4pICsgJyAnICsgbmFtZSArICdzJztcbn1cbiIsImltcG9ydCBkZWJ1Z0dlbiBmcm9tICdkZWJ1Zyc7XG5cbmNvbnN0IGRlYnVnID0gZGVidWdHZW4oJ2VudmVsb3BlLWV2ZW50Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudmVsb3BlRXZlbnRHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBzdGFydFZhbHVlLCBlbmRWYWx1ZSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgaWYgKCAhY29udGV4dCApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXVkaW9Db250ZXh0IGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIHN0YXJ0VmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbiBzdGFydFZhbHVlIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIGVuZFZhbHVlID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQW4gZW5kVmFsdWUgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICAvLyBSZXF1aXJlZCB2YWx1ZXNcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuc3RhcnRWYWx1ZSA9IHN0YXJ0VmFsdWU7XG4gICAgdGhpcy5lbmRWYWx1ZSA9IGVuZFZhbHVlO1xuXG4gICAgLy8gT3B0aW9uYWwgdmFsdWVzXG4gICAgdGhpcy5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZSB8fCB0aGlzLmNvbnRleHQuY3VycmVudFRpbWU7XG4gICAgdGhpcy50cmFuc2l0aW9uVGltZSA9IG9wdGlvbnMudHJhbnNpdGlvblRpbWUgfHwgMC4xO1xuXG4gICAgdGhpcy5jdXJ2ZVR5cGUgPSBvcHRpb25zLmN1cnZlVHlwZTtcbiAgfVxuXG4gIGdldEVxdWFsUG93ZXJDdXJ2ZShzY2FsZSwgb2Zmc2V0KSB7XG4gICAgc2NhbGUgPSBzY2FsZSB8fCAxO1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuXG4gICAgdmFyIGN1cnZlTGVuZ3RoID0gdGhpcy5jb250ZXh0LnNhbXBsZVJhdGU7XG4gICAgdmFyIGN1cnZlID0gbmV3IEZsb2F0MzJBcnJheShjdXJ2ZUxlbmd0aCk7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBjdXJ2ZUxlbmd0aDsgaSsrICkge1xuICAgICAgY3VydmVbaV0gPSBzY2FsZSAqIE1hdGguY29zKE1hdGguUEkgKiAoIGkvY3VydmVMZW5ndGggKyAxICkgLyA0KSArIG9mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VydmU7XG4gIH1cblxuICB0cmlnZ2VyKCkge1xuICAgIHRoaXMucGFyYW0uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHRoaXMuc3RhcnRUaW1lKTtcbiAgICB0aGlzLnBhcmFtLnNldFZhbHVlQXRUaW1lKHRoaXMuc3RhcnRWYWx1ZSwgdGhpcy5zdGFydFRpbWUpO1xuICAgIHN3aXRjaCAoIHRoaXMuY3VydmVUeXBlICkge1xuICAgICAgY2FzZSAnZXF1YWxQb3dlckZhZGVJbic6XG4gICAgICAgIHZhciBzY2FsZSA9IE1hdGguYWJzKHRoaXMuZW5kVmFsdWUgLSB0aGlzLnN0YXJ0VmFsdWUpO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5zdGFydFZhbHVlO1xuXG4gICAgICAgIHRoaXMucGFyYW0uc2V0VmFsdWVDdXJ2ZUF0VGltZSh0aGlzLmdldEVxdWFsUG93ZXJDdXJ2ZShzY2FsZSwgb2Zmc2V0KS5yZXZlcnNlKCksIHRoaXMuc3RhcnRUaW1lLCB0aGlzLnRyYW5zaXRpb25UaW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcXVhbFBvd2VyRmFkZU91dCc6XG4gICAgICAgIHZhciBzY2FsZSA9IE1hdGguYWJzKHRoaXMuc3RhcnRWYWx1ZSAtIHRoaXMuZW5kVmFsdWUpO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5lbmRWYWx1ZTtcblxuICAgICAgICB0aGlzLnBhcmFtLnNldFZhbHVlQ3VydmVBdFRpbWUodGhpcy5nZXRFcXVhbFBvd2VyQ3VydmUoc2NhbGUsIG9mZnNldCksIHRoaXMuc3RhcnRUaW1lLCB0aGlzLnRyYW5zaXRpb25UaW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsaW5lYXInOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5wYXJhbS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSh0aGlzLmVuZFZhbHVlLCB0aGlzLnN0YXJ0VGltZSArIHRoaXMudHJhbnNpdGlvblRpbWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBkZWJ1ZygnbmV3IGVudicpO1xuICAgIGRlYnVnKCdjdXJyZW50IHRpbWUnLCB0aGlzLmNvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIGRlYnVnKCdzdGFydFRpbWUnLCB0aGlzLnN0YXJ0VGltZSwgJ3RyYW5zaXRpb25UaW1lJywgdGhpcy50cmFuc2l0aW9uVGltZSwgJ3N0YXJ0VmFsdScsIHRoaXMuc3RhcnRWYWx1ZSwgJ2VuZFZhbHVlJywgdGhpcy5lbmRWYWx1ZSk7XG4gIH1cblxuICBjb25uZWN0KHBhcmFtKSB7XG4gICAgdGhpcy5wYXJhbSA9IHBhcmFtO1xuICB9XG59XG4iLCJpbXBvcnQgRW52ZWxvcGVFdmVudEdlbmVyYXRvciBmcm9tICcuL2VudmVsb3BlLmpzJztcbmltcG9ydCBkZWJ1Z0dlbiBmcm9tICdkZWJ1Zyc7XG5cbmNvbnN0IGRlYnVnID0gZGVidWdHZW4oJ2FtcGxpdHVkZS1lbnZlbG9wZScpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbXBsaXR1ZGVFbnZlbG9wZSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQsIG9wdGlvbnMpe1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuY29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICAvLyAtLS0tLSBvcHRpb25zIC0tLS0tXG4gICAgc2VsZi5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIC8vIFRpbWluZ1xuICAgIHNlbGYuY3VycmVudFRpbWVTb3VyY2UgPSBvcHRpb25zLmN1cnJlbnRUaW1lU291cmNlIHx8IHNlbGYuY29udGV4dDtcbiAgICBzZWxmLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lO1xuICAgIHNlbGYuYXR0YWNrVGltZSA9IG9wdGlvbnMuYXR0YWNrVGltZTtcbiAgICBzZWxmLnN1c3RhaW5UaW1lID0gb3B0aW9ucy5zdXN0YWluVGltZTtcbiAgICBzZWxmLnJlbGVhc2VUaW1lID0gb3B0aW9ucy5yZWxlYXNlVGltZTtcblxuICAgIHNlbGYubWF4VmFsdWUgPSBvcHRpb25zLm1heFZhbHVlO1xuXG4gICAgLy8gQ3VydmVcbiAgICBzZWxmLmF0dGFja0N1cnZlVHlwZSA9IG9wdGlvbnMuYXR0YWNrQ3VydmVUeXBlIHx8ICdsaW5lYXInO1xuICAgIHNlbGYucmVsZWFzZUN1cnZlVHlwZSA9IG9wdGlvbnMucmVsZWFzZUN1cnZlVHlwZSB8fCAnbGluZWFyJztcblxuICAgIC8vIENyZWF0ZSBHYWluIE5vZGUgYW5kIGZpcnN0IEVudmVsb3BlXG4gICAgc2VsZi5nYWluTm9kZSA9IHNlbGYuY29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgc2VsZi5nYWluTm9kZS5nYWluLnZhbHVlID0gMDtcbiAgfVxuXG4gIGN1cnJlbnRUaW1lKCkge1xuICAgIGlmICggdGhpcy5jdXJyZW50VGltZVNvdXJjZSAmJiB0eXBlb2YgdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lO1xuICAgIH1cbiAgfVxuICB0cmlnZ2VyKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYucmlzZUVudmVsb3BlID0gbmV3IEVudmVsb3BlRXZlbnRHZW5lcmF0b3Ioc2VsZi5jb250ZXh0LCAwLCBzZWxmLm1heFZhbHVlLCB7XG4gICAgICBzdGFydFRpbWU6IHNlbGYuc3RhcnRUaW1lLFxuICAgICAgdHJhbnNpdGlvblRpbWU6IHNlbGYuYXR0YWNrVGltZSxcbiAgICAgIGN1cnZlVHlwZTogc2VsZi5hdHRhY2tDdXJ2ZVR5cGUsXG4gICAgfSk7XG4gICAgc2VsZi5yaXNlRW52ZWxvcGUuY29ubmVjdChzZWxmLmdhaW5Ob2RlLmdhaW4pO1xuICAgIHNlbGYucmlzZUVudmVsb3BlLnRyaWdnZXIoKTtcblxuICAgIGRlYnVnKCdhbXAgZW52Jyk7XG4gICAgZGVidWcoJ3N0YXJ0VGltZScsIHNlbGYuc3RhcnRUaW1lLCAnYXR0YWNrVGltZScsIHNlbGYuYXR0YWNrVGltZSwgJ3N1c3RhaW5UaW1lJywgc2VsZi5zdXN0YWluVGltZSwgJ3JlbGVhc2VUaW1lJywgc2VsZi5yZWxlYXNlVGltZSk7XG5cbiAgICAvLyBTY2hlZHVsZSByZWxlYXNlIGVudmVsb3BlXG4gICAgdmFyIGVudmVsb3BlID0gbmV3IEVudmVsb3BlRXZlbnRHZW5lcmF0b3Ioc2VsZi5jb250ZXh0LCBzZWxmLm1heFZhbHVlLCAwLCB7XG4gICAgICBzdGFydFRpbWU6IHNlbGYuc3RhcnRUaW1lICsgc2VsZi5hdHRhY2tUaW1lICsgc2VsZi5zdXN0YWluVGltZSxcbiAgICAgIHRyYW5zaXRpb25UaW1lOiBzZWxmLnJlbGVhc2VUaW1lLFxuICAgICAgY3VydmVUeXBlOiBzZWxmLnJlbGVhc2VDdXJ2ZVR5cGUsXG4gICAgfSk7XG4gICAgZW52ZWxvcGUuY29ubmVjdChzZWxmLmdhaW5Ob2RlLmdhaW4pO1xuICAgIGVudmVsb3BlLnRyaWdnZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEFtcGxpdHVkZUVudmVsb3BlIGZyb20gJ2FtcGxpdHVkZS1lbnYnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW5nbGVPc2Mge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0O1xuICAgIHRoaXMuY3VycmVudFRpbWVTb3VyY2UgPSBvcHRpb25zLmN1cnJlbnRUaW1lU291cmNlIHx8IHRoaXMuY29udGV4dDtcblxuICAgIC8vIFRpbWluZyBwYXJhbXNcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lO1xuICAgIHRoaXMuYXR0YWNrVGltZSA9IG9wdGlvbnMuYXR0YWNrVGltZTtcbiAgICB0aGlzLnN1c3RhaW5UaW1lID0gb3B0aW9ucy5zdXN0YWluVGltZTtcbiAgICB0aGlzLnJlbGVhc2VUaW1lID0gb3B0aW9ucy5yZWxlYXNlVGltZTtcblxuICAgIC8vIEN1cnZlc1xuICAgIHRoaXMuYXR0YWNrQ3VydmVUeXBlID0gb3B0aW9ucy5hdHRhY2tDdXJ2ZVR5cGUgfHwgJ2xpbmVhcic7XG4gICAgdGhpcy5yZWxlYXNlQ3VydmVUeXBlID0gb3B0aW9ucy5yZWxlYXNlQ3VydmVUeXBlIHx8ICdsaW5lYXInO1xuXG4gICAgLy8gTm9uLXRpbWluZyBlbnZlbG9wIHBhcmFtXG4gICAgdGhpcy5tYXhWYWx1ZSA9IG9wdGlvbnMubWF4VmFsdWU7XG5cbiAgICAvLyBPc2NpbGxhdG9yIHBhcmFtXG4gICAgdGhpcy53YXZlID0gb3B0aW9ucy53YXZlIHx8ICdzYXd0b290aCc7XG5cbiAgICAvLyBNYXN0ZXIgZ2FpbiBub2RlXG4gICAgdGhpcy5kZXN0aW5hdGlvbk5vZGUgPSB0aGlzLmNvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuZGVzdGluYXRpb25Ob2RlLmdhaW4udmFsdWUgPSAxO1xuICB9XG5cbiAgcGxheShmcmVxLCB0aW1lKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGF0dGFja1RpbWUgPSBzZWxmLmF0dGFja1RpbWU7XG4gICAgdmFyIHN1c3RhaW5UaW1lID0gc2VsZi5zdXN0YWluVGltZTtcbiAgICB2YXIgcmVsZWFzZVRpbWUgPSBzZWxmLnJlbGVhc2VUaW1lO1xuXG4gICAgLy8gU2V0dXAgZW52ZWxvcGVcbiAgICB2YXIgZW52ZWxvcGUgPSBuZXcgQW1wbGl0dWRlRW52ZWxvcGUoc2VsZi5jb250ZXh0LCB7XG4gICAgICBjdXJyZW50VGltZVNvdXJjZTogc2VsZi5jdXJyZW50VGltZVNvdXJjZSxcbiAgICAgIG1heFZhbHVlOiBzZWxmLm1heFZhbHVlLFxuXG4gICAgICAvLyB0aW1pbmdcbiAgICAgIHN0YXJ0VGltZTogdGltZSxcbiAgICAgIGF0dGFja1RpbWU6IGF0dGFja1RpbWUsXG4gICAgICBzdXN0YWluVGltZTogc3VzdGFpblRpbWUsXG4gICAgICByZWxlYXNlVGltZTogcmVsZWFzZVRpbWUsXG5cbiAgICAgIC8vIGN1cnZlc1xuICAgICAgYXR0YWNrQ3VydmVUeXBlOiBzZWxmLmF0dGFja0N1cnZlVHlwZSxcbiAgICAgIHJlbGVhc2VDdXJ2ZVR5cGU6IHNlbGYucmVsZWFzZUN1cnZlVHlwZSxcbiAgICB9KTtcblxuICAgIHZhciBvc2MgPSBzZWxmLmNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgIG9zYy50eXBlID0gc2VsZi53YXZlO1xuXG4gICAgb3NjLmNvbm5lY3QoZW52ZWxvcGUuZ2Fpbk5vZGUpO1xuICAgIGVudmVsb3BlLmdhaW5Ob2RlLmNvbm5lY3Qoc2VsZi5kZXN0aW5hdGlvbk5vZGUpO1xuXG4gICAgLy8gU2V0dXAgb3NjaWxsYXRvclxuICAgIG9zYy5mcmVxdWVuY3kudmFsdWUgPSBmcmVxIHx8IDQ0MDtcblxuICAgIGVudmVsb3BlLnRyaWdnZXIoKTtcblxuICAgIG9zYy5zdGFydCh0aW1lKTtcblxuICAgIC8vIFNjaGVkdWxlIHN0b3BcbiAgICBvc2Muc3RvcCh0aW1lICsgYXR0YWNrVGltZSArIHN1c3RhaW5UaW1lICsgcmVsZWFzZVRpbWUpO1xuICAgIG9zYy5vbmVuZCA9IGZ1bmN0aW9uIG5vdGVFbmQoKSB7XG4gICAgICAvLyBvbmVuZGVkIGNsZWFuIHVwXG4gICAgICAvLyBub3RlOiB0aGlzIGRvZXNudCBoYXZlIHRvIGJlIGZpcmVkIG9ubHkgd2hlbiBzdG9wKCkgaXMgZmlyZWQgc2luY2VcbiAgICAgIC8vIGl0IGlzIGNhbGxlZCBvbmx5IHdoZW4gc3RvcCBzdWNjZWVkc1xuICAgICAgb3NjLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuICB9XG4gIGN1cnJlbnRUaW1lKCkge1xuICAgIGlmICggdGhpcy5jdXJyZW50VGltZVNvdXJjZSAmJiB0eXBlb2YgdGhpcy5jdXJyZW50VGltZVNvdXJjZS5jdXJyZW50VGltZSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lU291cmNlLmN1cnJlbnRUaW1lO1xuICAgIH1cbiAgfVxuICBjb25uZWN0KG5vZGUpIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uTm9kZS5jb25uZWN0KG5vZGUpO1xuICB9XG59XG4iLCJpbXBvcnQgU2luZ2xlT3NjIGZyb20gJ3NpbmdsZS1vc2MnO1xuXG4vLyBTb3VyY2U6XG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81NjI0MTM5LzYzMDQ5MFxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4KSB7XG4gICAgLy8gRXhwYW5kIHNob3J0aGFuZCBmb3JtIChlLmcuIFwiMDNGXCIpIHRvIGZ1bGwgZm9ybSAoZS5nLiBcIjAwMzNGRlwiKVxuICAgIHZhciBzaG9ydGhhbmRSZWdleCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XG4gICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRoYW5kUmVnZXgsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIHtcbiAgICAgICAgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcbiAgICB9KTtcblxuICAgIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXG4gICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgfSA6IG51bGw7XG59XG5mdW5jdGlvbiBsaW5lckNvbG9ySW50ZXJwb2xhdGlvbiggZmlyc3RDb2xvciwgc2Vjb25kQ29sb3IsIHBlcmNlbnRhZ2UgKSB7XG4gICB2YXIgcmdiMSA9IGhleFRvUmdiKGZpcnN0Q29sb3IpO1xuICAgdmFyIHJnYjIgPSBoZXhUb1JnYihzZWNvbmRDb2xvcik7XG5cbiAgIHJldHVybiBNYXRoLmZsb29yKFxuICAgLy8gUmVkXG4gICAgTWF0aC5mbG9vciggKCByZ2IyLnIgLSByZ2IxLnIgKSAqIHBlcmNlbnRhZ2UgKyByZ2IxLnIgKSAqIDB4MDEwMDAwICtcbiAgIC8vIEdyZWVuXG4gICAgTWF0aC5mbG9vciggKCByZ2IyLmcgLSByZ2IxLmcgKSAqIHBlcmNlbnRhZ2UgKyByZ2IxLmcgKSAqIDB4MDAwMTAwICtcbiAgIC8vIEJsdWVcbiAgICBNYXRoLmZsb29yKCAoIHJnYjIuYiAtIHJnYjEuYiApICogcGVyY2VudGFnZSArIHJnYjEuYiApICogMHgwMDAwMDEgXG4gICApLnRvU3RyaW5nKDE2KTtcbn1cblxuZnVuY3Rpb24gZ2VuTWlub3JTY2FsZShzdGFydE5vdGUpIHtcbiAgIHZhciBzY2FsZSA9IFtdO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyAyKTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgMyk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDUpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyA3KTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgOCk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDEwKTtcbiAgIHJldHVybiBzY2FsZTtcbn1cbmZ1bmN0aW9uIGdlbkVuaWdtYXRpY1NjYWxlKHN0YXJ0Tm90ZSkge1xuICAgdmFyIHNjYWxlID0gW107XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDEpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyA0KTtcbiAgIHNjYWxlLnB1c2goc3RhcnROb3RlICsgNyk7XG4gICBzY2FsZS5wdXNoKHN0YXJ0Tm90ZSArIDkpO1xuICAgc2NhbGUucHVzaChzdGFydE5vdGUgKyAxMSk7XG4gICByZXR1cm4gc2NhbGU7XG59XG5mdW5jdGlvbiBub3RlVG9GcmVxKG5vdGUpIHtcbiAgIHJldHVybiBNYXRoLnBvdyggMiwgKCBub3RlIC0gNDkgICkgLyAxMiAgKSAqIDQ0MDtcbn1cblxudmFyIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xudmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5jdHgudHJhbnNsYXRlKGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyKTtcblxudmFyIGF1ZGlvID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcblxudmFyIG1hc3RlckdhaW4gPSBhdWRpby5jcmVhdGVHYWluKCk7XG5tYXN0ZXJHYWluLmNvbm5lY3QoYXVkaW8uZGVzdGluYXRpb24pO1xubWFzdGVyR2Fpbi5nYWluLnZhbHVlID0gMC4wNDtcblxudmFyIG9zYyA9IG5ldyBTaW5nbGVPc2Moe1xuICAgY29udGV4dDogYXVkaW8sXG4gICBhdHRhY2tUaW1lOiAwLjA1LFxuICAgc3VzdGFpblRpbWU6IDAuMyxcbiAgIHJlbGVhc2VUaW1lOiAwLjA3NSxcbiAgIG1heFZhbHVlOiAxLFxuXG4gICAvLyBPc2NcbiAgIHdhdmU6ICdzaW5lJyxcbn0pO1xuXG5vc2MuY29ubmVjdChtYXN0ZXJHYWluKTtcblxudmFyIHJvdGF0aW9uID0gMDtcbnZhciBzaWRlTGVuZ3RoID0gTWF0aC5taW4oIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCApIC8gMjtcblxudmFyIHJhdGUgPSAwLjI7XG5cbnZhciBiTWlub3IgPSBnZW5NaW5vclNjYWxlKDUxKS5yZXZlcnNlKClcbiAgIC5jb25jYXQoZ2VuTWlub3JTY2FsZSg1MS0xMikucmV2ZXJzZSgpKTtcbnZhciBnRW5pZyA9IGdlbkVuaWdtYXRpY1NjYWxlKDQ3KTtcbmdFbmlnID0gZ0VuaWcuY29uY2F0KGdFbmlnLnNsaWNlKCkucmV2ZXJzZSgpKTtcblxudmFyIHN0YXJ0VGltZSA9IGF1ZGlvLmN1cnJlbnRUaW1lICsgMTtcblxudmFyIHRoZVNjYWxlID0gZ0VuaWc7XG5cbnZhciBhbW91bnQgPSBNYXRoLlBJICogMjMgLzQzO1xuZm9yICggbGV0IGkgPSAwOyBpIDwgMTAwOyBpICsrICkge1xuICAgLy8gUmFuZG9tIHRyYW5zbGF0aW9uXG4gICB2YXIgc2hpZnQgPSBNYXRoLnJhbmRvbSgpICogY2FudmFzLndpZHRoIC8gMTU7XG4gICBjdHgudHJhbnNsYXRlKHNoaWZ0LHNoaWZ0KTtcblxuICAgdmFyIHNjYWxlID0gMC45NzA7XG4gICBjdHguc2NhbGUoc2NhbGUsIHNjYWxlKTtcbiAgIC8vIGN0eC5yb3RhdGUoYW1vdW50KTtcbiAgIGN0eC5yb3RhdGUoTWF0aC5wb3coIC0xICwgKCAoIDEwICogaSApICUgMiApICkgKiBhbW91bnQpO1xuXG4gICAvLyBJbmNyZW1lbnQgZnVydGhlclxuICAgcm90YXRpb24gKz0gYW1vdW50O1xuXG4gICBjdHguZmlsbFN0eWxlID0gJyMnICsgbGluZXJDb2xvckludGVycG9sYXRpb24oXG4gICAgICAnI2ZmZicsICcjNjk0QTlBJyxcbiAgICAgIChcbiAgICAgICAgIGkgL1xuICAgICAgICAgICAgMjBcbiAgICAgICkgJSAxXG4gICApO1xuXG4gICBjdHguZmlsbFJlY3QoLXNpZGVMZW5ndGggLyAyLCAtc2lkZUxlbmd0aCAvIDIsIHNpZGVMZW5ndGgsIHNpZGVMZW5ndGgpO1xufVxuXG4vLyBmb3IgKCBsZXQgaiA9IDA7IGogPCA1OyBqICsrICl7XG4vLyAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGVTY2FsZS5sZW5ndGg7IGkrKyApIHtcbi8vICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCBmdW5jdGlvbih0aW1lKSB7XG4vLyAgICAgICAgICBvc2MucGxheShub3RlVG9GcmVxKHRoZVNjYWxlW1xuLy8gICAgICAgICAgICAgKCAoIDEraSApICogKCAxK2ogKSApICUgdGhlU2NhbGUubGVuZ3RoXG4vLyAgICAgICAgICBdKSwgdGltZSk7XG4vLyAgICAgICB9LCAoIDEwMDAgKiBzdGFydFRpbWUgKSAtIDE1MCwgc3RhcnRUaW1lKTtcbi8vIFxuLy8gICAgICAgLy8gRHJhdyByZWN0YW5nbGVcbi8vICAgICAgIHZhciBhbW91bnQgPSBNYXRoLlBJICogMjMgLzQzO1xuLy8gICAgICAgLy9NYXRoLlBJICogMjMgLyA0Mztcbi8vICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCAocm90YXRlQnkpID0+IHtcbi8vICAgICAgICAgIC8vIFJhbmRvbSB0cmFuc2xhdGlvblxuLy8gICAgICAgICAgdmFyIHNoaWZ0ID0gTWF0aC5yYW5kb20oKSAqIGNhbnZhcy53aWR0aCAvIDI1O1xuLy8gICAgICAgICAgY3R4LnRyYW5zbGF0ZShzaGlmdCxzaGlmdCk7XG4vLyBcbi8vICAgICAgICAgIHZhciBzY2FsZSA9IDAuOTU3O1xuLy8gICAgICAgICAgY3R4LnNjYWxlKHNjYWxlLCBzY2FsZSk7XG4vLyAgICAgICAgICBjdHgucm90YXRlKHJvdGF0ZUJ5KTtcbi8vICAgICAgICAgIC8vIGN0eC5yb3RhdGUoTWF0aC5wb3coIC0xICwgKCBqICUgMiApICkgKiByb3RhdGVCeSk7XG4vLyBcbi8vICAgICAgICAgIC8vIEluY3JlbWVudCBmdXJ0aGVyXG4vLyAgICAgICAgICByb3RhdGlvbiArPSByb3RhdGVCeTtcbi8vIFxuLy8gICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjJyArIGxpbmVyQ29sb3JJbnRlcnBvbGF0aW9uKFxuLy8gICAgICAgICAgICAgJyNmZmYnLCAnIzY5NEE5QScsXG4vLyAgICAgICAgICAgICAoXG4vLyAgICAgICAgICAgICAgICAoIGogKiB0aGVTY2FsZS5sZW5ndGggKyBpICkgL1xuLy8gICAgICAgICAgICAgICAgICAgKCAzIC8gMiAqIHRoZVNjYWxlLmxlbmd0aCApXG4vLyAgICAgICAgICAgICApICUgMVxuLy8gICAgICAgICAgKTtcbi8vIFxuLy8gICAgICAgICAgY3R4LmZpbGxSZWN0KC1zaWRlTGVuZ3RoIC8gMiwgLXNpZGVMZW5ndGggLyAyLCBzaWRlTGVuZ3RoLCBzaWRlTGVuZ3RoKTtcbi8vICAgICAgIH0sIDEwMDAqIHN0YXJ0VGltZSwgYW1vdW50KTtcbi8vIFxuLy8gICAgICAgc3RhcnRUaW1lICs9IHJhdGU7XG4vLyAgICB9XG4vLyB9XG4iXX0=

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _debug = __webpack_require__(1);

	var _debug2 = _interopRequireDefault(_debug);

	var _fiber = __webpack_require__(4);

	var _fiber2 = _interopRequireDefault(_fiber);

	var _raf = __webpack_require__(5);

	var _raf2 = _interopRequireDefault(_raf);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debugFiber = (0, _debug2.default)('fiber');
	var debugApp = (0, _debug2.default)('app');

	var App = function () {
	  function App(options) {
	    var _this = this;

	    _classCallCheck(this, App);

	    options = options || {};

	    // Setup Canvas
	    this.canvas = document.createElement('canvas');
	    this.ctx = this.canvas.getContext('2d');
	    this.pixelRatio = window.devicePixelRatio || 1;
	    this.ctx.scale(this.pixelRatio, this.pixelRatio);

	    document.body.appendChild(this.canvas);

	    // Fibers
	    this.fibers = [];
	    this.fiberWidth = 0;
	    this.fiberHeight = 0;

	    this.density = options.density || 10;

	    // Events
	    var touchTimeout = undefined;

	    window.addEventListener('resize', this.resize.bind(this));
	    window.addEventListener('touchstart', function (event) {
	      if (event.target !== _this.canvas) {
	        return;
	      }

	      // Double tap
	      if (touchTimeout) {
	        window.clearTimeout(touchTimeout);
	        touchTimeout = null;

	        // Toggle GUI
	        dat.GUI.toggleHide();
	      } else {
	        touchTimeout = window.setTimeout(function () {
	          touchTimeout = null;

	          _this.clear();
	        }, 500);
	      }
	    });

	    // GUI
	    var gui = new dat.GUI();
	    gui.add(this, 'density').min(4);
	  }

	  _createClass(App, [{
	    key: 'clear',
	    value: function clear() {
	      this.fibers = [];

	      this.fiberWidth = this.fiberHeight = 0;
	      this.resize();
	    }
	  }, {
	    key: 'resize',
	    value: function resize() {
	      this.canvas.width = window.innerWidth * this.pixelRatio;
	      this.canvas.height = window.innerHeight * this.pixelRatio;

	      // Add new fibers
	      // Cover new height
	      if (this.canvas.height > this.fiberHeight) {
	        // Skip if there is no known width
	        // This is a slight optimization
	        if (this.fiberWidth) {
	          this.createFibers({
	            x: 0,
	            y: this.fiberHeight
	          }, this.fiberWidth, this.canvas.height - this.fiberHeight);
	        }

	        // Set new height
	        this.fiberHeight = this.canvas.height;
	      }

	      // Cover new width
	      if (this.canvas.width > this.fiberWidth) {
	        this.createFibers({
	          x: this.fiberWidth,
	          y: 0
	        }, this.canvas.width - this.fiberWidth, this.fiberHeight);

	        // Set new height
	        this.fiberWidth = this.canvas.width;
	      }

	      // Draw frame again
	      debugApp('draw scheduled');
	      (0, _raf2.default)(this.draw.bind(this));
	    }
	  }, {
	    key: 'createFibers',
	    value: function createFibers(offset, width, height) {
	      debugApp('create fired params', offset, width, height);

	      var columns = width / this._density;
	      var rows = height / this._density;

	      debugApp('create fired dimensions', columns, rows);
	      for (var i = 0; i < columns; i++) {
	        for (var j = 0; j < rows; j++) {
	          var rotation = Math.random() * 2 * Math.PI;
	          var length = Math.random() * 2 + 3;

	          this.fibers.push(new _fiber2.default({
	            rotation: rotation,
	            length: length,
	            position: {
	              x: offset.x + width * i / columns,
	              y: offset.y + height * j / rows
	            }
	          }));

	          debugFiber('Fiber options', {
	            rotation: rotation,
	            length: length
	          });
	        }
	      }
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var k = this.fibers.length;

	      while (k--) {
	        this.fibers[k].draw(this.ctx);
	      }

	      debugApp('drawn');
	    }
	  }, {
	    key: 'density',
	    get: function get() {
	      return this._density;
	    }

	    // Changing density automatically redraws the entire app
	    ,
	    set: function set(value) {
	      this._density = value;

	      this.clear();
	    }
	  }]);

	  return App;
	}();

	var app = new App({ density: 15 });
	app.draw();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(2);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
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
	exports.humanize = __webpack_require__(3);

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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Fiber = function () {
	  function Fiber(options) {
	    _classCallCheck(this, Fiber);

	    options = options || {};

	    this.length = options.length || 1;
	    this.position = options.position || { x: 0, y: 0 };
	    this.rotation = options.rotation || 0;

	    this.color = options.color || '#000';
	  }

	  _createClass(Fiber, [{
	    key: 'update',
	    value: function update() {}
	  }, {
	    key: 'draw',
	    value: function draw(ctx) {
	      ctx.beginPath();
	      ctx.moveTo(this.position.x, this.position.y);
	      ctx.lineTo(this.position.x + Math.cos(this.rotation) * this.length, this.position.y + Math.sin(this.rotation) * this.length);

	      ctx.strokeStyle = this.color;
	      ctx.stroke();
	    }
	  }]);

	  return Fiber;
	}();

	exports.default = Fiber;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var now = __webpack_require__(6)
	  , global = typeof window === 'undefined' ? {} : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = global['request' + suffix]
	  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]

	for(var i = 0; i < vendors.length && !raf; i++) {
	  raf = global[vendors[i] + 'Request' + suffix]
	  caf = global[vendors[i] + 'Cancel' + suffix]
	      || global[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(global, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(global, arguments)
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);
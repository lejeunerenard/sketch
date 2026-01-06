/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./fiber.js"
/*!******************!*\
  !*** ./fiber.js ***!
  \******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Fiber)\n/* harmony export */ });\nclass Fiber {\n  constructor (options) {\n    options = options || {}\n\n    this.length = options.length || 1\n    this.position = options.position || { x: 0, y: 0 }\n    this.rotation = options.rotation || 0\n\n    this.color = options.color || '#000'\n  }\n\n  update () {\n\n  }\n\n  draw (ctx) {\n    ctx.beginPath()\n    ctx.moveTo(this.position.x, this.position.y)\n    ctx.lineTo(this.position.x + Math.cos(this.rotation) * this.length, this.position.y + Math.sin(this.rotation) * this.length)\n\n    ctx.strokeStyle = this.color\n    ctx.stroke()\n  }\n}\n\n\n//# sourceURL=webpack://towel/./fiber.js?\n}");

/***/ },

/***/ "./index.js"
/*!******************!*\
  !*** ./index.js ***!
  \******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fiber */ \"./fiber.js\");\n/* harmony import */ var raf__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raf */ \"./node_modules/raf/index.js\");\n/* harmony import */ var raf__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(raf__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nlet debugFiber = (...args) => console.log('fiber', ...args)\nlet debugApp = (...args) => console.log('app', ...args)\n\nclass App {\n\n  constructor (options) {\n    options = options || {}\n\n    // Setup Canvas\n    this.canvas = document.createElement('canvas')\n    this.ctx = this.canvas.getContext('2d')\n    this.pixelRatio = window.devicePixelRatio || 1\n    this.ctx.scale(this.pixelRatio, this.pixelRatio)\n\n    document.body.appendChild(this.canvas)\n\n    // Fibers\n    this.fibers = []\n    this.fiberWidth = 0\n    this.fiberHeight = 0\n\n    this.density = options.density || 10\n\n    // Events\n    let touchTimeout\n\n    window.addEventListener('resize', this.resize.bind(this))\n    window.addEventListener('touchstart', (event) => {\n      if (event.target !== this.canvas) {\n        return\n      }\n\n      // Double tap\n      if (touchTimeout) {\n        window.clearTimeout(touchTimeout)\n        touchTimeout = null\n\n        // Toggle GUI\n        dat.GUI.toggleHide()\n      } else {\n        touchTimeout = window.setTimeout(() => {\n          touchTimeout = null\n\n          this.clear()\n        }, 500)\n      }\n    })\n\n    // GUI\n    var gui = new dat.GUI()\n    gui.add(this, 'density').min(4)\n  }\n\n  get density () {\n    return this._density\n  }\n\n  // Changing density automatically redraws the entire app\n  set density (value) {\n    this._density = value\n\n    this.clear()\n  }\n\n  clear () {\n    this.fibers = []\n\n    this.fiberWidth = this.fiberHeight = 0\n    this.resize()\n  }\n\n  resize () {\n    this.canvas.width = window.innerWidth * this.pixelRatio\n    this.canvas.height = window.innerHeight * this.pixelRatio\n\n    // Add new fibers\n    // Cover new height\n    if (this.canvas.height > this.fiberHeight) {\n      // Skip if there is no known width\n      // This is a slight optimization\n      if (this.fiberWidth) {\n        this.createFibers({\n          x: 0,\n          y: this.fiberHeight\n        }, this.fiberWidth, this.canvas.height - this.fiberHeight)\n      }\n\n      // Set new height\n      this.fiberHeight = this.canvas.height\n    }\n\n    // Cover new width\n    if (this.canvas.width > this.fiberWidth) {\n      this.createFibers({\n        x: this.fiberWidth,\n        y: 0\n      }, this.canvas.width - this.fiberWidth, this.fiberHeight)\n\n      // Set new height\n      this.fiberWidth = this.canvas.width\n    }\n\n    // Draw frame again\n    debugApp('draw scheduled')\n    raf__WEBPACK_IMPORTED_MODULE_1___default()(this.draw.bind(this))\n  }\n\n  createFibers (offset, width, height) {\n    debugApp('create fired params', offset, width, height)\n\n    let columns = width / this._density\n    let rows = height / this._density\n\n    debugApp('create fired dimensions', columns, rows)\n    for (let i = 0; i < columns; i++) {\n      for (let j = 0; j < rows; j++) {\n        let rotation = Math.random() * 2 * Math.PI\n        let length = Math.random() * 2 + 3\n\n        this.fibers.push(new _fiber__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n          rotation,\n          length,\n          position: {\n            x: offset.x + width * i / columns,\n            y: offset.y + height * j / rows\n          }\n        }))\n\n        debugFiber('Fiber options', {\n          rotation,\n          length\n        })\n      }\n    }\n  }\n\n  draw () {\n    let k = this.fibers.length\n\n    while (k--) {\n      this.fibers[k].draw(this.ctx)\n    }\n\n    debugApp('drawn')\n  }\n}\n\nlet app = new App({ density: 15 })\napp.draw()\n\n\n//# sourceURL=webpack://towel/./index.js?\n}");

/***/ },

/***/ "./node_modules/performance-now/lib/performance-now.js"
/*!*************************************************************!*\
  !*** ./node_modules/performance-now/lib/performance-now.js ***!
  \*************************************************************/
(module) {

eval("{// Generated by CoffeeScript 1.12.2\n(function() {\n  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;\n\n  if ((typeof performance !== \"undefined\" && performance !== null) && performance.now) {\n    module.exports = function() {\n      return performance.now();\n    };\n  } else if ((typeof process !== \"undefined\" && process !== null) && process.hrtime) {\n    module.exports = function() {\n      return (getNanoSeconds() - nodeLoadTime) / 1e6;\n    };\n    hrtime = process.hrtime;\n    getNanoSeconds = function() {\n      var hr;\n      hr = hrtime();\n      return hr[0] * 1e9 + hr[1];\n    };\n    moduleLoadTime = getNanoSeconds();\n    upTime = process.uptime() * 1e9;\n    nodeLoadTime = moduleLoadTime - upTime;\n  } else if (Date.now) {\n    module.exports = function() {\n      return Date.now() - loadTime;\n    };\n    loadTime = Date.now();\n  } else {\n    module.exports = function() {\n      return new Date().getTime() - loadTime;\n    };\n    loadTime = new Date().getTime();\n  }\n\n}).call(this);\n\n//# sourceMappingURL=performance-now.js.map\n\n\n//# sourceURL=webpack://towel/./node_modules/performance-now/lib/performance-now.js?\n}");

/***/ },

/***/ "./node_modules/raf/index.js"
/*!***********************************!*\
  !*** ./node_modules/raf/index.js ***!
  \***********************************/
(module, __unused_webpack_exports, __webpack_require__) {

eval("{var now = __webpack_require__(/*! performance-now */ \"./node_modules/performance-now/lib/performance-now.js\")\n  , root = typeof window === 'undefined' ? __webpack_require__.g : window\n  , vendors = ['moz', 'webkit']\n  , suffix = 'AnimationFrame'\n  , raf = root['request' + suffix]\n  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]\n\nfor(var i = 0; !raf && i < vendors.length; i++) {\n  raf = root[vendors[i] + 'Request' + suffix]\n  caf = root[vendors[i] + 'Cancel' + suffix]\n      || root[vendors[i] + 'CancelRequest' + suffix]\n}\n\n// Some versions of FF have rAF but not cAF\nif(!raf || !caf) {\n  var last = 0\n    , id = 0\n    , queue = []\n    , frameDuration = 1000 / 60\n\n  raf = function(callback) {\n    if(queue.length === 0) {\n      var _now = now()\n        , next = Math.max(0, frameDuration - (_now - last))\n      last = next + _now\n      setTimeout(function() {\n        var cp = queue.slice(0)\n        // Clear queue here to prevent\n        // callbacks from appending listeners\n        // to the current frame's queue\n        queue.length = 0\n        for(var i = 0; i < cp.length; i++) {\n          if(!cp[i].cancelled) {\n            try{\n              cp[i].callback(last)\n            } catch(e) {\n              setTimeout(function() { throw e }, 0)\n            }\n          }\n        }\n      }, Math.round(next))\n    }\n    queue.push({\n      handle: ++id,\n      callback: callback,\n      cancelled: false\n    })\n    return id\n  }\n\n  caf = function(handle) {\n    for(var i = 0; i < queue.length; i++) {\n      if(queue[i].handle === handle) {\n        queue[i].cancelled = true\n      }\n    }\n  }\n}\n\nmodule.exports = function(fn) {\n  // Wrap in a new function to prevent\n  // `cancel` potentially being assigned\n  // to the native rAF function\n  return raf.call(root, fn)\n}\nmodule.exports.cancel = function() {\n  caf.apply(root, arguments)\n}\nmodule.exports.polyfill = function(object) {\n  if (!object) {\n    object = root;\n  }\n  object.requestAnimationFrame = raf\n  object.cancelAnimationFrame = caf\n}\n\n\n//# sourceURL=webpack://towel/./node_modules/raf/index.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;
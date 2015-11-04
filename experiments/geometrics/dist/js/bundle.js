(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _triangle = require('./triangle');

var _triangle2 = _interopRequireDefault(_triangle);

var App = (function () {
   function App(canvas, sideLength) {
      _classCallCheck(this, App);

      // Canvas stuff
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = window.innerWidth / 2 - window.innerWidth / 2 % sideLength;
      this.canvas.height = window.innerHeight / 2 - window.innerHeight / 2 % sideLength;
      this.width = this.canvas.width;
      this.height = this.canvas.height;

      // Triangle props
      this.sideLength = sideLength;
      this.createTriangles();
   }

   _createClass(App, [{
      key: 'draw',
      value: function draw() {
         // Clear!
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         var i = this.triangles.length;

         while (i--) {
            this.triangles[i].draw(this.ctx);
         }
      }
   }, {
      key: 'run',
      value: function run() {
         var _this = this;

         this.draw();

         /*
          * window.setInterval(() => {
          *    this.createTriangles();
          *    this.draw();
          * }, 100);
          */

         window.addEventListener('resize', function () {
            _this.canvas.width = window.innerWidth / 2 - window.innerWidth / 2 % _this.sideLength;
            _this.canvas.height = window.innerHeight / 2 - window.innerHeight / 2 % _this.sideLength;

            _this.width = _this.canvas.width;
            _this.height = _this.canvas.height;

            _this.createTriangles();

            _this.draw();
         });
      }
   }, {
      key: 'createTriangles',
      value: function createTriangles() {
         // Remove previous triangles
         this.triangles = [];

         var triangleWidth = 0,
             triangleHeight = -this.sideLength;

         var colors = ['556270', '4ECDC4', 'C7F464', 'FF6B6B', 'C44D58'];

         while (triangleHeight < this.height) {
            var toggle = 0;
            while (triangleWidth < this.width) {
               var offset = this.sideLength / 2 * toggle;
               toggle = !toggle;

               var color = this.linerColorInterpolation('472F5F', 'F3819A', triangleWidth / this.width);

               // Create triangle pointing right
               if (Math.random() > 0.5) {
                  this.triangles.push(new _triangle2['default']({
                     x: triangleWidth,
                     y: triangleHeight + offset,
                     sideLength: this.sideLength,
                     fillStyle: '#' + color
                  }));
               }

               // Create triangle pointing left
               if (Math.random() > 0.5) {
                  this.triangles.push(new _triangle2['default']({
                     x: triangleWidth,
                     y: triangleHeight + this.sideLength / 2 + offset,
                     sideLength: this.sideLength,
                     rotate: 180,
                     fillStyle: '#' + color
                  }));
               }

               // H = B/2
               triangleWidth += this.sideLength / 2;
            }

            triangleHeight += this.sideLength;
            triangleWidth = 0;
         }
      }
   }, {
      key: 'linerColorInterpolation',
      value: function linerColorInterpolation(firstColor, secondColor, percentage) {
         var rgb1 = this.hexToRgb(firstColor);
         var rgb2 = this.hexToRgb(secondColor);

         return Math.floor(
         // Red
         Math.floor((rgb2.r - rgb1.r) * percentage + rgb1.r) * 0x010000 +
         // Green
         Math.floor((rgb2.g - rgb1.g) * percentage + rgb1.g) * 0x000100 +
         // Blue
         Math.floor((rgb2.b - rgb1.b) * percentage + rgb1.b) * 0x000001).toString(16);
      }

      // Source:
      // http://stackoverflow.com/a/5624139/630490
   }, {
      key: 'hexToRgb',
      value: function hexToRgb(hex) {
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
   }]);

   return App;
})();

window.app = new App(document.querySelector('#c1'), 123);
window.app2 = new App(document.querySelector('#c2'), 123);
window.app.run();
window.app2.run();

},{"./triangle":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
   value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Triangle = (function () {
   function Triangle(options) {
      _classCallCheck(this, Triangle);

      options = options || {};

      this.sideLength = options.sideLength || 5;
      this.rotate = options.rotate || 0;

      // Colors
      this.fillStyle = options.fillStyle;
      this.strokeStyle = options.strokeStyle;

      if (!this.fillStyle && !this.strokeStyle) {
         this.strokeStyle = '#000';
      }

      // Position is the top left of the triangle
      this.x = options.x;
      this.y = options.y;
   }

   _createClass(Triangle, [{
      key: 'draw',
      value: function draw(ctx) {
         ctx.lineWidth = 1;
         ctx.beginPath();

         // Pointing left
         if (this.rotate) {
            ctx.moveTo(this.getNudged(this.x + this.sideLength / 2), this.getNudged(this.y + this.sideLength));
            ctx.lineTo(this.getNudged(this.x + this.sideLength / 2), this.getNudged(this.y));
            ctx.lineTo(this.getNudged(this.x), this.getNudged(this.y + this.sideLength / 2));
            ctx.lineTo(this.getNudged(this.x + this.sideLength / 2), this.getNudged(this.y + this.sideLength));
            // Pointing Right
         } else {
               ctx.moveTo(this.getNudged(this.x), this.getNudged(this.y));
               ctx.lineTo(this.getNudged(this.x), this.getNudged(this.y + this.sideLength));
               ctx.lineTo(this.getNudged(this.x + this.sideLength / 2), this.getNudged(this.y + this.sideLength / 2));
               ctx.lineTo(this.getNudged(this.x), this.getNudged(this.y));
            }

         ctx.closePath();

         // Color it in
         if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
         }
         if (this.strokeStyle) {
            ctx.strokeStyle = this.strokeStyle;
            ctx.stroke();
         }
      }
   }, {
      key: 'getNudged',
      value: function getNudged(x) {
         if (Math.floor(x) === x) {
            return x + 0.5;
         } else {
            return x;
         }
      }
   }]);

   return Triangle;
})();

exports['default'] = Triangle;
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VhbnplbGxtZXIvc2tldGNoL2V4cGVyaW1lbnRzL2dlb21ldHJpY3Mvc3JjL2FwcC5qcyIsIi9Vc2Vycy9zZWFuemVsbG1lci9za2V0Y2gvZXhwZXJpbWVudHMvZ2VvbWV0cmljcy9zcmMvdHJpYW5nbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7OztJQUUzQixHQUFHO0FBQ0ssWUFEUixHQUFHLENBQ00sTUFBTSxFQUFFLFVBQVUsRUFBRTs0QkFEN0IsR0FBRzs7O0FBR0gsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBSyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBSyxBQUFFLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFJLFVBQVUsQUFBRSxBQUFFLENBQUM7QUFDMUYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUssTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUssQUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBSyxVQUFVLEFBQUUsQUFBRSxDQUFDO0FBQzlGLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDL0IsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7O0FBR2pDLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6Qjs7Z0JBYkUsR0FBRzs7YUFlRixnQkFBRzs7QUFFSixh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QUFDO1VBQ2I7QUFDRCxhQUFLLElBQUksQ0FBQyxXQUFXLEVBQUc7QUFDckIsZUFBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ25DLGVBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztVQUNmO09BQ0g7OzthQUVRLG1CQUFDLENBQUMsRUFBRTtBQUNWLGFBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUc7QUFDeEIsbUJBQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztVQUNqQixNQUFNO0FBQ0osbUJBQU8sQ0FBQyxDQUFDO1VBQ1g7T0FDSDs7O1VBakZpQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVHJpYW5nbGUgZnJvbSAnLi90cmlhbmdsZSc7XG5cbmNsYXNzIEFwcCB7XG4gICBjb25zdHJ1Y3RvcihjYW52YXMsIHNpZGVMZW5ndGgpIHtcbiAgICAgIC8vIENhbnZhcyBzdHVmZlxuICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9ICggd2luZG93LmlubmVyV2lkdGggLyAyIC0gKCAoIHdpbmRvdy5pbm5lcldpZHRoIC8gMikgJSBzaWRlTGVuZ3RoICkgKTtcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9ICggd2luZG93LmlubmVySGVpZ2h0IC8gMiAtICggKCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyICkgJSBzaWRlTGVuZ3RoICkgKTtcbiAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAvLyBUcmlhbmdsZSBwcm9wc1xuICAgICAgdGhpcy5zaWRlTGVuZ3RoID0gc2lkZUxlbmd0aDtcbiAgICAgIHRoaXMuY3JlYXRlVHJpYW5nbGVzKCk7XG4gICB9XG5cbiAgIGRyYXcoKSB7XG4gICAgICAvLyBDbGVhciFcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIGxldCBpID0gdGhpcy50cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoIGkgLS0gKSB7XG4gICAgICAgICB0aGlzLnRyaWFuZ2xlc1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICAgIH1cbiAgIH1cblxuICAgcnVuKCkge1xuICAgICAgdGhpcy5kcmF3KCk7XG5cbiAgICAgIC8qXG4gICAgICAgKiB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICogICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcbiAgICAgICAqICAgIHRoaXMuZHJhdygpO1xuICAgICAgICogfSwgMTAwKTtcbiAgICAgICAqL1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSAoIHdpbmRvdy5pbm5lcldpZHRoIC8gMiAtICggKCB3aW5kb3cuaW5uZXJXaWR0aCAvIDIpICUgdGhpcy5zaWRlTGVuZ3RoICkgKTtcbiAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9ICggd2luZG93LmlubmVySGVpZ2h0IC8gMiAtICggKCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyICkgJSB0aGlzLnNpZGVMZW5ndGggKSApO1xuXG4gICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcblxuICAgICAgICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcblxuICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB9KTtcbiAgIH1cblxuICAgY3JlYXRlVHJpYW5nbGVzKCkge1xuICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIHRyaWFuZ2xlc1xuICAgICAgdGhpcy50cmlhbmdsZXMgPSBbXTtcblxuICAgICAgbGV0IHRyaWFuZ2xlV2lkdGggID0gMCxcbiAgICAgICAgICB0cmlhbmdsZUhlaWdodCA9IC10aGlzLnNpZGVMZW5ndGg7XG5cbiAgICAgIGxldCBjb2xvcnMgPSBbXG4gICAgICAgICAnNTU2MjcwJyxcbiAgICAgICAgICc0RUNEQzQnLFxuICAgICAgICAgJ0M3RjQ2NCcsXG4gICAgICAgICAnRkY2QjZCJyxcbiAgICAgICAgICdDNDRENTgnLFxuICAgICAgXTtcblxuICAgICAgd2hpbGUgKCB0cmlhbmdsZUhlaWdodCA8IHRoaXMuaGVpZ2h0ICkge1xuICAgICAgICAgbGV0IHRvZ2dsZSA9IDA7XG4gICAgICAgICB3aGlsZSAoIHRyaWFuZ2xlV2lkdGggPCB0aGlzLndpZHRoICkge1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMuc2lkZUxlbmd0aCAvIDIgKiB0b2dnbGU7XG4gICAgICAgICAgICB0b2dnbGUgPSAhdG9nZ2xlO1xuXG4gICAgICAgICAgICB2YXIgY29sb3IgPSB0aGlzLmxpbmVyQ29sb3JJbnRlcnBvbGF0aW9uKCc0NzJGNUYnLCAnRjM4MTlBJywgdHJpYW5nbGVXaWR0aCAvIHRoaXMud2lkdGgpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdHJpYW5nbGUgcG9pbnRpbmcgcmlnaHRcbiAgICAgICAgICAgIGlmICggTWF0aC5yYW5kb20oKSA+IDAuNSApIHtcbiAgICAgICAgICAgICAgIHRoaXMudHJpYW5nbGVzLnB1c2gobmV3IFRyaWFuZ2xlKHtcbiAgICAgICAgICAgICAgICAgIHg6IHRyaWFuZ2xlV2lkdGgsXG4gICAgICAgICAgICAgICAgICB5OiB0cmlhbmdsZUhlaWdodCArIG9mZnNldCxcbiAgICAgICAgICAgICAgICAgIHNpZGVMZW5ndGg6IHRoaXMuc2lkZUxlbmd0aCxcbiAgICAgICAgICAgICAgICAgIGZpbGxTdHlsZTogJyMnK2NvbG9yLFxuICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdHJpYW5nbGUgcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgaWYgKCBNYXRoLnJhbmRvbSgpID4gMC41ICkge1xuICAgICAgICAgICAgICAgdGhpcy50cmlhbmdsZXMucHVzaChuZXcgVHJpYW5nbGUoe1xuICAgICAgICAgICAgICAgICAgeDogdHJpYW5nbGVXaWR0aCxcbiAgICAgICAgICAgICAgICAgIHk6IHRyaWFuZ2xlSGVpZ2h0ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyICkgKyBvZmZzZXQsXG4gICAgICAgICAgICAgICAgICBzaWRlTGVuZ3RoOiB0aGlzLnNpZGVMZW5ndGgsXG4gICAgICAgICAgICAgICAgICByb3RhdGU6IDE4MCxcbiAgICAgICAgICAgICAgICAgIGZpbGxTdHlsZTogJyMnK2NvbG9yLFxuICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIID0gQi8yXG4gICAgICAgICAgICB0cmlhbmdsZVdpZHRoICs9IHRoaXMuc2lkZUxlbmd0aCAvIDI7XG4gICAgICAgICB9XG5cbiAgICAgICAgIHRyaWFuZ2xlSGVpZ2h0ICs9IHRoaXMuc2lkZUxlbmd0aDtcbiAgICAgICAgIHRyaWFuZ2xlV2lkdGggPSAwO1xuICAgICAgfVxuICAgfVxuXG4gICBsaW5lckNvbG9ySW50ZXJwb2xhdGlvbiggZmlyc3RDb2xvciwgc2Vjb25kQ29sb3IsIHBlcmNlbnRhZ2UgKSB7XG4gICAgICB2YXIgcmdiMSA9IHRoaXMuaGV4VG9SZ2IoZmlyc3RDb2xvcik7XG4gICAgICB2YXIgcmdiMiA9IHRoaXMuaGV4VG9SZ2Ioc2Vjb25kQ29sb3IpO1xuXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihcbiAgICAgIC8vIFJlZFxuICAgICAgIE1hdGguZmxvb3IoICggcmdiMi5yIC0gcmdiMS5yICkgKiBwZXJjZW50YWdlICsgcmdiMS5yICkgKiAweDAxMDAwMCArXG4gICAgICAvLyBHcmVlblxuICAgICAgIE1hdGguZmxvb3IoICggcmdiMi5nIC0gcmdiMS5nICkgKiBwZXJjZW50YWdlICsgcmdiMS5nICkgKiAweDAwMDEwMCArXG4gICAgICAvLyBCbHVlXG4gICAgICAgTWF0aC5mbG9vciggKCByZ2IyLmIgLSByZ2IxLmIgKSAqIHBlcmNlbnRhZ2UgKyByZ2IxLmIgKSAqIDB4MDAwMDAxIFxuICAgICAgKS50b1N0cmluZygxNik7XG4gICB9XG5cbiAgIC8vIFNvdXJjZTpcbiAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU2MjQxMzkvNjMwNDkwXG4gICBoZXhUb1JnYihoZXgpIHtcbiAgICAgICAvLyBFeHBhbmQgc2hvcnRoYW5kIGZvcm0gKGUuZy4gXCIwM0ZcIikgdG8gZnVsbCBmb3JtIChlLmcuIFwiMDAzM0ZGXCIpXG4gICAgICAgdmFyIHNob3J0aGFuZFJlZ2V4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaTtcbiAgICAgICBoZXggPSBoZXgucmVwbGFjZShzaG9ydGhhbmRSZWdleCwgZnVuY3Rpb24obSwgciwgZywgYikge1xuICAgICAgICAgICByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiO1xuICAgICAgIH0pO1xuXG4gICAgICAgdmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgICAgIHJldHVybiByZXN1bHQgPyB7XG4gICAgICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxuICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcbiAgICAgICB9IDogbnVsbDtcbiAgIH1cbn1cblxud2luZG93LmFwcCA9IG5ldyBBcHAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2MxJyksIDEyMyk7XG53aW5kb3cuYXBwMiA9IG5ldyBBcHAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2MyJyksIDEyMyk7XG53aW5kb3cuYXBwLnJ1bigpO1xud2luZG93LmFwcDIucnVuKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlhbmdsZSB7XG4gICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHRoaXMuc2lkZUxlbmd0aCA9IG9wdGlvbnMuc2lkZUxlbmd0aCB8fCA1O1xuICAgICAgdGhpcy5yb3RhdGUgPSBvcHRpb25zLnJvdGF0ZSB8fCAwO1xuXG4gICAgICAvLyBDb2xvcnNcbiAgICAgIHRoaXMuZmlsbFN0eWxlID0gb3B0aW9ucy5maWxsU3R5bGU7XG4gICAgICB0aGlzLnN0cm9rZVN0eWxlID0gb3B0aW9ucy5zdHJva2VTdHlsZTtcblxuICAgICAgaWYgKCAoICF0aGlzLmZpbGxTdHlsZSApICYmICggIXRoaXMuc3Ryb2tlU3R5bGUgKSApIHtcbiAgICAgICAgIHRoaXMuc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgICB9XG5cbiAgICAgIC8vIFBvc2l0aW9uIGlzIHRoZSB0b3AgbGVmdCBvZiB0aGUgdHJpYW5nbGVcbiAgICAgIHRoaXMueCA9IG9wdGlvbnMueDtcbiAgICAgIHRoaXMueSA9IG9wdGlvbnMueTtcbiAgIH1cblxuICAgZHJhdyhjdHgpIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgICAvLyBQb2ludGluZyBsZWZ0XG4gICAgICBpZiAoIHRoaXMucm90YXRlICkge1xuICAgICAgICAgY3R4Lm1vdmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArIHRoaXMuc2lkZUxlbmd0aCApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIpIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgdGhpcy5zaWRlTGVuZ3RoIClcbiAgICAgICAgICk7XG4gICAgICAvLyBQb2ludGluZyBSaWdodFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGN0eC5tb3ZlVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArIHRoaXMuc2lkZUxlbmd0aCApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArICggdGhpcy5zaWRlTGVuZ3RoIC8gMikgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgLy8gQ29sb3IgaXQgaW5cbiAgICAgIGlmICggdGhpcy5maWxsU3R5bGUgKSB7XG4gICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG4gICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgfVxuICAgICAgaWYgKCB0aGlzLnN0cm9rZVN0eWxlICkge1xuICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VTdHlsZTtcbiAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cbiAgIH1cblxuICAgZ2V0TnVkZ2VkKHgpIHtcbiAgICAgIGlmICggTWF0aC5mbG9vcih4KSA9PT0geCApIHtcbiAgICAgICAgIHJldHVybiB4ICsgMC41O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB4O1xuICAgICAgfVxuICAgfVxufVxuIl19

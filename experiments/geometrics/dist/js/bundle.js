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
      this.canvas.width = 2 * (window.innerWidth / 2 - window.innerWidth / 2 % sideLength);
      this.canvas.height = 2 * (window.innerHeight / 2 - window.innerHeight / 2 % sideLength);
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
            _this.canvas.width = 2 * (window.innerWidth / 2 - window.innerWidth / 2 % _this.sideLength);
            _this.canvas.height = 2 * (window.innerHeight / 2 - window.innerHeight / 2 % _this.sideLength);

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

window.app = new App(document.querySelector('canvas'), 103);
window.app.run();

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VhbnplbGxtZXIvc2tldGNoL2V4cGVyaW1lbnRzL2dlb21ldHJpY3Mvc3JjL2FwcC5qcyIsIi9Vc2Vycy9zZWFuemVsbG1lci9za2V0Y2gvZXhwZXJpbWVudHMvZ2VvbWV0cmljcy9zcmMvdHJpYW5nbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7OztJQUUzQixHQUFHO0FBQ0ssWUFEUixHQUFHLENBQ00sTUFBTSxFQUFFLFVBQVUsRUFBRTs0QkFEN0IsR0FBRzs7O0FBR0gsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUssTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUssQUFBRSxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBSSxVQUFVLENBQUUsQUFBRSxDQUFDO0FBQzlGLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBSyxBQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFLLFVBQVUsQ0FBRSxBQUFFLENBQUM7QUFDbEcsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzs7QUFHakMsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCOztnQkFiRSxHQUFH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QUFHLENBQUMsTUFBTSxFQUFFLENBQUM7VUFDZjtPQUNIOzs7YUFFUSxtQkFBQyxDQUFDLEVBQUU7QUFDVixhQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFHO0FBQ3hCLG1CQUFPLENBQUMsR0FBRyxHQUFHLENBQUM7VUFDakIsTUFBTTtBQUNKLG1CQUFPLENBQUMsQ0FBQztVQUNYO09BQ0g7OztVQWpGaUIsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRyaWFuZ2xlIGZyb20gJy4vdHJpYW5nbGUnO1xuXG5jbGFzcyBBcHAge1xuICAgY29uc3RydWN0b3IoY2FudmFzLCBzaWRlTGVuZ3RoKSB7XG4gICAgICAvLyBDYW52YXMgc3R1ZmZcbiAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSAyICogKCB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSAoICggd2luZG93LmlubmVyV2lkdGggLyAyKSAlIHNpZGVMZW5ndGggKSApO1xuICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gMiAqICggd2luZG93LmlubmVySGVpZ2h0IC8gMiAtICggKCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyICkgJSBzaWRlTGVuZ3RoICkgKTtcbiAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAvLyBUcmlhbmdsZSBwcm9wc1xuICAgICAgdGhpcy5zaWRlTGVuZ3RoID0gc2lkZUxlbmd0aDtcbiAgICAgIHRoaXMuY3JlYXRlVHJpYW5nbGVzKCk7XG4gICB9XG5cbiAgIGRyYXcoKSB7XG4gICAgICAvLyBDbGVhciFcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIGxldCBpID0gdGhpcy50cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoIGkgLS0gKSB7XG4gICAgICAgICB0aGlzLnRyaWFuZ2xlc1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICAgIH1cbiAgIH1cblxuICAgcnVuKCkge1xuICAgICAgdGhpcy5kcmF3KCk7XG5cbiAgICAgIC8qXG4gICAgICAgKiB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICogICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcbiAgICAgICAqICAgIHRoaXMuZHJhdygpO1xuICAgICAgICogfSwgMTAwKTtcbiAgICAgICAqL1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSAyICogKCB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSAoICggd2luZG93LmlubmVyV2lkdGggLyAyKSAlIHRoaXMuc2lkZUxlbmd0aCApICk7XG4gICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSAyICogKCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyIC0gKCAoIHdpbmRvdy5pbm5lckhlaWdodCAvIDIgKSAlIHRoaXMuc2lkZUxlbmd0aCApICk7XG5cbiAgICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAgICB0aGlzLmNyZWF0ZVRyaWFuZ2xlcygpO1xuXG4gICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIH0pO1xuICAgfVxuXG4gICBjcmVhdGVUcmlhbmdsZXMoKSB7XG4gICAgICAvLyBSZW1vdmUgcHJldmlvdXMgdHJpYW5nbGVzXG4gICAgICB0aGlzLnRyaWFuZ2xlcyA9IFtdO1xuXG4gICAgICBsZXQgdHJpYW5nbGVXaWR0aCAgPSAwLFxuICAgICAgICAgIHRyaWFuZ2xlSGVpZ2h0ID0gLXRoaXMuc2lkZUxlbmd0aDtcblxuICAgICAgbGV0IGNvbG9ycyA9IFtcbiAgICAgICAgICc1NTYyNzAnLFxuICAgICAgICAgJzRFQ0RDNCcsXG4gICAgICAgICAnQzdGNDY0JyxcbiAgICAgICAgICdGRjZCNkInLFxuICAgICAgICAgJ0M0NEQ1OCcsXG4gICAgICBdO1xuXG4gICAgICB3aGlsZSAoIHRyaWFuZ2xlSGVpZ2h0IDwgdGhpcy5oZWlnaHQgKSB7XG4gICAgICAgICBsZXQgdG9nZ2xlID0gMDtcbiAgICAgICAgIHdoaWxlICggdHJpYW5nbGVXaWR0aCA8IHRoaXMud2lkdGggKSB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5zaWRlTGVuZ3RoIC8gMiAqIHRvZ2dsZTtcbiAgICAgICAgICAgIHRvZ2dsZSA9ICF0b2dnbGU7XG5cbiAgICAgICAgICAgIHZhciBjb2xvciA9IHRoaXMubGluZXJDb2xvckludGVycG9sYXRpb24oJzQ3MkY1RicsICdGMzgxOUEnLCB0cmlhbmdsZVdpZHRoIC8gdGhpcy53aWR0aCk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0cmlhbmdsZSBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgaWYgKCBNYXRoLnJhbmRvbSgpID4gMC41ICkge1xuICAgICAgICAgICAgICAgdGhpcy50cmlhbmdsZXMucHVzaChuZXcgVHJpYW5nbGUoe1xuICAgICAgICAgICAgICAgICAgeDogdHJpYW5nbGVXaWR0aCxcbiAgICAgICAgICAgICAgICAgIHk6IHRyaWFuZ2xlSGVpZ2h0ICsgb2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgc2lkZUxlbmd0aDogdGhpcy5zaWRlTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgZmlsbFN0eWxlOiAnIycrY29sb3IsXG4gICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0cmlhbmdsZSBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICBpZiAoIE1hdGgucmFuZG9tKCkgPiAwLjUgKSB7XG4gICAgICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBUcmlhbmdsZSh7XG4gICAgICAgICAgICAgICAgICB4OiB0cmlhbmdsZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgeTogdHJpYW5nbGVIZWlnaHQgKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSArIG9mZnNldCxcbiAgICAgICAgICAgICAgICAgIHNpZGVMZW5ndGg6IHRoaXMuc2lkZUxlbmd0aCxcbiAgICAgICAgICAgICAgICAgIHJvdGF0ZTogMTgwLFxuICAgICAgICAgICAgICAgICAgZmlsbFN0eWxlOiAnIycrY29sb3IsXG4gICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEggPSBCLzJcbiAgICAgICAgICAgIHRyaWFuZ2xlV2lkdGggKz0gdGhpcy5zaWRlTGVuZ3RoIC8gMjtcbiAgICAgICAgIH1cblxuICAgICAgICAgdHJpYW5nbGVIZWlnaHQgKz0gdGhpcy5zaWRlTGVuZ3RoO1xuICAgICAgICAgdHJpYW5nbGVXaWR0aCA9IDA7XG4gICAgICB9XG4gICB9XG5cbiAgIGxpbmVyQ29sb3JJbnRlcnBvbGF0aW9uKCBmaXJzdENvbG9yLCBzZWNvbmRDb2xvciwgcGVyY2VudGFnZSApIHtcbiAgICAgIHZhciByZ2IxID0gdGhpcy5oZXhUb1JnYihmaXJzdENvbG9yKTtcbiAgICAgIHZhciByZ2IyID0gdGhpcy5oZXhUb1JnYihzZWNvbmRDb2xvcik7XG5cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKFxuICAgICAgLy8gUmVkXG4gICAgICAgTWF0aC5mbG9vciggKCByZ2IyLnIgLSByZ2IxLnIgKSAqIHBlcmNlbnRhZ2UgKyByZ2IxLnIgKSAqIDB4MDEwMDAwICtcbiAgICAgIC8vIEdyZWVuXG4gICAgICAgTWF0aC5mbG9vciggKCByZ2IyLmcgLSByZ2IxLmcgKSAqIHBlcmNlbnRhZ2UgKyByZ2IxLmcgKSAqIDB4MDAwMTAwICtcbiAgICAgIC8vIEJsdWVcbiAgICAgICBNYXRoLmZsb29yKCAoIHJnYjIuYiAtIHJnYjEuYiApICogcGVyY2VudGFnZSArIHJnYjEuYiApICogMHgwMDAwMDEgXG4gICAgICApLnRvU3RyaW5nKDE2KTtcbiAgIH1cblxuICAgLy8gU291cmNlOlxuICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTYyNDEzOS82MzA0OTBcbiAgIGhleFRvUmdiKGhleCkge1xuICAgICAgIC8vIEV4cGFuZCBzaG9ydGhhbmQgZm9ybSAoZS5nLiBcIjAzRlwiKSB0byBmdWxsIGZvcm0gKGUuZy4gXCIwMDMzRkZcIilcbiAgICAgICB2YXIgc2hvcnRoYW5kUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pO1xuICAgICAgIGhleCA9IGhleC5yZXBsYWNlKHNob3J0aGFuZFJlZ2V4LCBmdW5jdGlvbihtLCByLCBnLCBiKSB7XG4gICAgICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XG4gICAgICAgfSk7XG5cbiAgICAgICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XG4gICAgICAgcmV0dXJuIHJlc3VsdCA/IHtcbiAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxuICAgICAgICAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxuICAgICAgIH0gOiBudWxsO1xuICAgfVxufVxuXG53aW5kb3cuYXBwID0gbmV3IEFwcChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKSwgMTAzKTtcbndpbmRvdy5hcHAucnVuKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlhbmdsZSB7XG4gICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHRoaXMuc2lkZUxlbmd0aCA9IG9wdGlvbnMuc2lkZUxlbmd0aCB8fCA1O1xuICAgICAgdGhpcy5yb3RhdGUgPSBvcHRpb25zLnJvdGF0ZSB8fCAwO1xuXG4gICAgICAvLyBDb2xvcnNcbiAgICAgIHRoaXMuZmlsbFN0eWxlID0gb3B0aW9ucy5maWxsU3R5bGU7XG4gICAgICB0aGlzLnN0cm9rZVN0eWxlID0gb3B0aW9ucy5zdHJva2VTdHlsZTtcblxuICAgICAgaWYgKCAoICF0aGlzLmZpbGxTdHlsZSApICYmICggIXRoaXMuc3Ryb2tlU3R5bGUgKSApIHtcbiAgICAgICAgIHRoaXMuc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgICB9XG5cbiAgICAgIC8vIFBvc2l0aW9uIGlzIHRoZSB0b3AgbGVmdCBvZiB0aGUgdHJpYW5nbGVcbiAgICAgIHRoaXMueCA9IG9wdGlvbnMueDtcbiAgICAgIHRoaXMueSA9IG9wdGlvbnMueTtcbiAgIH1cblxuICAgZHJhdyhjdHgpIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgICAvLyBQb2ludGluZyBsZWZ0XG4gICAgICBpZiAoIHRoaXMucm90YXRlICkge1xuICAgICAgICAgY3R4Lm1vdmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArIHRoaXMuc2lkZUxlbmd0aCApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIpIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgdGhpcy5zaWRlTGVuZ3RoIClcbiAgICAgICAgICk7XG4gICAgICAvLyBQb2ludGluZyBSaWdodFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGN0eC5tb3ZlVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArIHRoaXMuc2lkZUxlbmd0aCApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArICggdGhpcy5zaWRlTGVuZ3RoIC8gMikgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgLy8gQ29sb3IgaXQgaW5cbiAgICAgIGlmICggdGhpcy5maWxsU3R5bGUgKSB7XG4gICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG4gICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgfVxuICAgICAgaWYgKCB0aGlzLnN0cm9rZVN0eWxlICkge1xuICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VTdHlsZTtcbiAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cbiAgIH1cblxuICAgZ2V0TnVkZ2VkKHgpIHtcbiAgICAgIGlmICggTWF0aC5mbG9vcih4KSA9PT0geCApIHtcbiAgICAgICAgIHJldHVybiB4ICsgMC41O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB4O1xuICAgICAgfVxuICAgfVxufVxuIl19

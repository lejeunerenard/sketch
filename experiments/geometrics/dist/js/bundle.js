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
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
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
            _this.width = window.innerWidth;
            _this.height = window.innerHeight;

            _this.canvas.width = _this.width;
            _this.canvas.height = _this.height;

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

               var color = this.linerColorInterpolation(colors[1], colors[3], triangleWidth / this.width);
               console.log('color', color);

               // Create triangle pointing right
               this.triangles.push(new _triangle2['default']({
                  x: triangleWidth,
                  y: triangleHeight + offset,
                  sideLength: this.sideLength,
                  fillStyle: '#' + color
               }));

               // Create triangle pointing left
               this.triangles.push(new _triangle2['default']({
                  x: triangleWidth,
                  y: triangleHeight + this.sideLength / 2 + offset,
                  sideLength: this.sideLength,
                  rotate: 180,
                  fillStyle: '#' + color
               }));

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

window.app = new App(document.querySelector('canvas'), 43);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VhbnplbGxtZXIvc2tldGNoL2V4cGVyaW1lbnRzL2dlb21ldHJpY3Mvc3JjL2FwcC5qcyIsIi9Vc2Vycy9zZWFuemVsbG1lci9za2V0Y2gvZXhwZXJpbWVudHMvZ2VvbWV0cmljcy9zcmMvdHJpYW5nbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7OztJQUUzQixHQUFHO0FBQ0ssWUFEUixHQUFHLENBQ00sTUFBTSxFQUFFLFVBQVUsRUFBRTs0QkFEN0IsR0FBRzs7O0FBR0gsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDeEMsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzs7QUFHakMsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCOztnQkFiRSxHQUFHOzthQWVGLGdCQUFHOztBQUVKLGFBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxhQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsZ0JBQVEsQ0FBQyxFQUFHLEVBQUc7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1VBQ25DO09BQ0g7OzthQUVFLGVBQUc7OztBQUNILGFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FBU1osZUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFNO0FBQ3JDLGtCQUFLLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQy9CLGtCQUFLLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDOztBQUVqQyxrQkFBSyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQUssS0FBSyxDQUFDO0FBQy9CLGtCQUFLLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBSyxNQUFNLENBQUM7O0FBRWpDLGtCQUFLLGVBQWUsRUFBRSxDQUFDOztBQUV2QixrQkFBSyxJQUFJLEVBQUUsQ0FBQztVQUNkLENBQUMsQ0FBQztPQUNMOzs7YUFFYywyQkFBRzs7QUFFZixhQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsYUFBSSxhQUFhLEdBQUksQ0FBQzthQUNsQixjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOztBQUV0QyxhQUFJLE1BQU0sR0FBRyxDQUNWLFFBQVEsRUFDUixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRLENBQ1YsQ0FBQzs7QUFFRixnQkFBUSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRztBQUNwQyxnQkFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsbUJBQVEsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUc7QUFDbEMsbUJBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUMxQyxxQkFBTSxHQUFHLENBQUMsTUFBTSxDQUFDOztBQUVqQixtQkFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRixzQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7OztBQUc1QixtQkFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQWE7QUFDOUIsbUJBQUMsRUFBRSxhQUFhO0FBQ2hCLG1CQUFDLEVBQUUsY0FBYyxHQUFHLE1BQU07QUFDMUIsNEJBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMzQiwyQkFBUyxFQUFFLEdBQUcsR0FBQyxLQUFLO2dCQUN0QixDQUFDLENBQUMsQ0FBQzs7O0FBR0osbUJBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDBCQUFhO0FBQzlCLG1CQUFDLEVBQUUsYUFBYTtBQUNoQixtQkFBQyxFQUFFLGNBQWMsR0FBSyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQUFBRSxHQUFHLE1BQU07QUFDcEQsNEJBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMzQix3QkFBTSxFQUFFLEdBQUc7QUFDWCwyQkFBUyxFQUFFLEdBQUcsR0FBQyxLQUFLO2dCQUN0QixDQUFDLENBQUMsQ0FBQzs7O0FBR0osNEJBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzthQUN2Qzs7QUFFRCwwQkFBYyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDbEMseUJBQWEsR0FBRyxDQUFDLENBQUM7VUFDcEI7T0FDSDs7O2FBRXNCLGlDQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFHO0FBQzVELGFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckMsYUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFdEMsZ0JBQU8sSUFBSSxDQUFDLEtBQUs7O0FBRWhCLGFBQUksQ0FBQyxLQUFLLENBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUEsR0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBRSxHQUFHLFFBQVE7O0FBRWxFLGFBQUksQ0FBQyxLQUFLLENBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUEsR0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBRSxHQUFHLFFBQVE7O0FBRWxFLGFBQUksQ0FBQyxLQUFLLENBQUUsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUEsR0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBRSxHQUFHLFFBQVEsQ0FDbEUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDakI7Ozs7OzthQUlPLGtCQUFDLEdBQUcsRUFBRTs7QUFFVixhQUFJLGNBQWMsR0FBRyxrQ0FBa0MsQ0FBQztBQUN4RCxZQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkQsbUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7VUFDaEMsQ0FBQyxDQUFDOztBQUVILGFBQUksTUFBTSxHQUFHLDJDQUEyQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRSxnQkFBTyxNQUFNLEdBQUc7QUFDWixhQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDMUIsYUFBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzFCLGFBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztVQUM3QixHQUFHLElBQUksQ0FBQztPQUNaOzs7VUEvSEUsR0FBRzs7O0FBa0lULE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMzRCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0lDcklJLFFBQVE7QUFDZCxZQURNLFFBQVEsQ0FDYixPQUFPLEVBQUU7NEJBREosUUFBUTs7QUFFdkIsYUFBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQzs7O0FBR2xDLFVBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNuQyxVQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7O0FBRXZDLFVBQUssQUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxBQUFFLEVBQUc7QUFDakQsYUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7T0FDNUI7OztBQUdELFVBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNuQixVQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckI7O2dCQWxCaUIsUUFBUTs7YUFvQnRCLGNBQUMsR0FBRyxFQUFFO0FBQ1AsWUFBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7QUFHaEIsYUFBSyxJQUFJLENBQUMsTUFBTSxFQUFHO0FBQ2hCLGVBQUcsQ0FBQyxNQUFNLENBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFLLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxBQUFFLENBQUUsRUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FDNUMsQ0FBQztBQUNGLGVBQUcsQ0FBQyxNQUFNLENBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFLLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxBQUFFLENBQUUsRUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQzFCLENBQUM7QUFDRixlQUFHLENBQUMsTUFBTSxDQUNQLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBRSxFQUN4QixJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEFBQUMsQ0FBRSxDQUNuRCxDQUFDO0FBQ0YsZUFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEFBQUUsQ0FBRSxFQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUM1QyxDQUFDOztVQUVKLE1BQU07QUFDSixrQkFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQzFCLENBQUM7QUFDRixrQkFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FDNUMsQ0FBQztBQUNGLGtCQUFHLENBQUMsTUFBTSxDQUNQLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsR0FBSyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQUFBRSxDQUFFLEVBQ2xELElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsR0FBSyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQUFBQyxDQUFFLENBQ25ELENBQUM7QUFDRixrQkFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQzFCLENBQUM7YUFDSjs7QUFFRCxZQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7OztBQUdoQixhQUFLLElBQUksQ0FBQyxTQUFTLEVBQUc7QUFDbkIsZUFBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQy9CLGVBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztVQUNiO0FBQ0QsYUFBSyxJQUFJLENBQUMsV0FBVyxFQUFHO0FBQ3JCLGVBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNuQyxlQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7VUFDZjtPQUNIOzs7YUFFUSxtQkFBQyxDQUFDLEVBQUU7QUFDVixhQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFHO0FBQ3hCLG1CQUFPLENBQUMsR0FBRyxHQUFHLENBQUM7VUFDakIsTUFBTTtBQUNKLG1CQUFPLENBQUMsQ0FBQztVQUNYO09BQ0g7OztVQWpGaUIsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRyaWFuZ2xlIGZyb20gJy4vdHJpYW5nbGUnO1xuXG5jbGFzcyBBcHAge1xuICAgY29uc3RydWN0b3IoY2FudmFzLCBzaWRlTGVuZ3RoKSB7XG4gICAgICAvLyBDYW52YXMgc3R1ZmZcbiAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAvLyBUcmlhbmdsZSBwcm9wc1xuICAgICAgdGhpcy5zaWRlTGVuZ3RoID0gc2lkZUxlbmd0aDtcbiAgICAgIHRoaXMuY3JlYXRlVHJpYW5nbGVzKCk7XG4gICB9XG5cbiAgIGRyYXcoKSB7XG4gICAgICAvLyBDbGVhciFcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIGxldCBpID0gdGhpcy50cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoIGkgLS0gKSB7XG4gICAgICAgICB0aGlzLnRyaWFuZ2xlc1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICAgIH1cbiAgIH1cblxuICAgcnVuKCkge1xuICAgICAgdGhpcy5kcmF3KCk7XG5cbiAgICAgIC8qXG4gICAgICAgKiB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICogICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcbiAgICAgICAqICAgIHRoaXMuZHJhdygpO1xuICAgICAgICogfSwgMTAwKTtcbiAgICAgICAqL1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXG4gICAgICAgICB0aGlzLmNyZWF0ZVRyaWFuZ2xlcygpO1xuXG4gICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgIH0pO1xuICAgfVxuXG4gICBjcmVhdGVUcmlhbmdsZXMoKSB7XG4gICAgICAvLyBSZW1vdmUgcHJldmlvdXMgdHJpYW5nbGVzXG4gICAgICB0aGlzLnRyaWFuZ2xlcyA9IFtdO1xuXG4gICAgICBsZXQgdHJpYW5nbGVXaWR0aCAgPSAwLFxuICAgICAgICAgIHRyaWFuZ2xlSGVpZ2h0ID0gLXRoaXMuc2lkZUxlbmd0aDtcblxuICAgICAgbGV0IGNvbG9ycyA9IFtcbiAgICAgICAgICc1NTYyNzAnLFxuICAgICAgICAgJzRFQ0RDNCcsXG4gICAgICAgICAnQzdGNDY0JyxcbiAgICAgICAgICdGRjZCNkInLFxuICAgICAgICAgJ0M0NEQ1OCcsXG4gICAgICBdO1xuXG4gICAgICB3aGlsZSAoIHRyaWFuZ2xlSGVpZ2h0IDwgdGhpcy5oZWlnaHQgKSB7XG4gICAgICAgICBsZXQgdG9nZ2xlID0gMDtcbiAgICAgICAgIHdoaWxlICggdHJpYW5nbGVXaWR0aCA8IHRoaXMud2lkdGggKSB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5zaWRlTGVuZ3RoIC8gMiAqIHRvZ2dsZTtcbiAgICAgICAgICAgIHRvZ2dsZSA9ICF0b2dnbGU7XG5cbiAgICAgICAgICAgIHZhciBjb2xvciA9IHRoaXMubGluZXJDb2xvckludGVycG9sYXRpb24oY29sb3JzWzFdLCBjb2xvcnNbM10sIHRyaWFuZ2xlV2lkdGggLyB0aGlzLndpZHRoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb2xvcicsIGNvbG9yKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRyaWFuZ2xlIHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBUcmlhbmdsZSh7XG4gICAgICAgICAgICAgICB4OiB0cmlhbmdsZVdpZHRoLFxuICAgICAgICAgICAgICAgeTogdHJpYW5nbGVIZWlnaHQgKyBvZmZzZXQsXG4gICAgICAgICAgICAgICBzaWRlTGVuZ3RoOiB0aGlzLnNpZGVMZW5ndGgsXG4gICAgICAgICAgICAgICBmaWxsU3R5bGU6ICcjJytjb2xvcixcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRyaWFuZ2xlIHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHRoaXMudHJpYW5nbGVzLnB1c2gobmV3IFRyaWFuZ2xlKHtcbiAgICAgICAgICAgICAgIHg6IHRyaWFuZ2xlV2lkdGgsXG4gICAgICAgICAgICAgICB5OiB0cmlhbmdsZUhlaWdodCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICsgb2Zmc2V0LFxuICAgICAgICAgICAgICAgc2lkZUxlbmd0aDogdGhpcy5zaWRlTGVuZ3RoLFxuICAgICAgICAgICAgICAgcm90YXRlOiAxODAsXG4gICAgICAgICAgICAgICBmaWxsU3R5bGU6ICcjJytjb2xvcixcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8gSCA9IEIvMlxuICAgICAgICAgICAgdHJpYW5nbGVXaWR0aCArPSB0aGlzLnNpZGVMZW5ndGggLyAyO1xuICAgICAgICAgfVxuXG4gICAgICAgICB0cmlhbmdsZUhlaWdodCArPSB0aGlzLnNpZGVMZW5ndGg7XG4gICAgICAgICB0cmlhbmdsZVdpZHRoID0gMDtcbiAgICAgIH1cbiAgIH1cblxuICAgbGluZXJDb2xvckludGVycG9sYXRpb24oIGZpcnN0Q29sb3IsIHNlY29uZENvbG9yLCBwZXJjZW50YWdlICkge1xuICAgICAgdmFyIHJnYjEgPSB0aGlzLmhleFRvUmdiKGZpcnN0Q29sb3IpO1xuICAgICAgdmFyIHJnYjIgPSB0aGlzLmhleFRvUmdiKHNlY29uZENvbG9yKTtcblxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoXG4gICAgICAvLyBSZWRcbiAgICAgICBNYXRoLmZsb29yKCAoIHJnYjIuciAtIHJnYjEuciApICogcGVyY2VudGFnZSArIHJnYjEuciApICogMHgwMTAwMDAgK1xuICAgICAgLy8gR3JlZW5cbiAgICAgICBNYXRoLmZsb29yKCAoIHJnYjIuZyAtIHJnYjEuZyApICogcGVyY2VudGFnZSArIHJnYjEuZyApICogMHgwMDAxMDAgK1xuICAgICAgLy8gQmx1ZVxuICAgICAgIE1hdGguZmxvb3IoICggcmdiMi5iIC0gcmdiMS5iICkgKiBwZXJjZW50YWdlICsgcmdiMS5iICkgKiAweDAwMDAwMSBcbiAgICAgICkudG9TdHJpbmcoMTYpO1xuICAgfVxuXG4gICAvLyBTb3VyY2U6XG4gICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81NjI0MTM5LzYzMDQ5MFxuICAgaGV4VG9SZ2IoaGV4KSB7XG4gICAgICAgLy8gRXhwYW5kIHNob3J0aGFuZCBmb3JtIChlLmcuIFwiMDNGXCIpIHRvIGZ1bGwgZm9ybSAoZS5nLiBcIjAwMzNGRlwiKVxuICAgICAgIHZhciBzaG9ydGhhbmRSZWdleCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XG4gICAgICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRoYW5kUmVnZXgsIGZ1bmN0aW9uKG0sIHIsIGcsIGIpIHtcbiAgICAgICAgICAgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcbiAgICAgICB9KTtcblxuICAgICAgIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXG4gICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgICAgfSA6IG51bGw7XG4gICB9XG59XG5cbndpbmRvdy5hcHAgPSBuZXcgQXBwKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpLCA0Myk7XG53aW5kb3cuYXBwLnJ1bigpO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJpYW5nbGUge1xuICAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB0aGlzLnNpZGVMZW5ndGggPSBvcHRpb25zLnNpZGVMZW5ndGggfHwgNTtcbiAgICAgIHRoaXMucm90YXRlID0gb3B0aW9ucy5yb3RhdGUgfHwgMDtcblxuICAgICAgLy8gQ29sb3JzXG4gICAgICB0aGlzLmZpbGxTdHlsZSA9IG9wdGlvbnMuZmlsbFN0eWxlO1xuICAgICAgdGhpcy5zdHJva2VTdHlsZSA9IG9wdGlvbnMuc3Ryb2tlU3R5bGU7XG5cbiAgICAgIGlmICggKCAhdGhpcy5maWxsU3R5bGUgKSAmJiAoICF0aGlzLnN0cm9rZVN0eWxlICkgKSB7XG4gICAgICAgICB0aGlzLnN0cm9rZVN0eWxlID0gJyMwMDAnO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3NpdGlvbiBpcyB0aGUgdG9wIGxlZnQgb2YgdGhlIHRyaWFuZ2xlXG4gICAgICB0aGlzLnggPSBvcHRpb25zLng7XG4gICAgICB0aGlzLnkgPSBvcHRpb25zLnk7XG4gICB9XG5cbiAgIGRyYXcoY3R4KSB7XG4gICAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgICAgLy8gUG9pbnRpbmcgbGVmdFxuICAgICAgaWYgKCB0aGlzLnJvdGF0ZSApIHtcbiAgICAgICAgIGN0eC5tb3ZlVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyICkgKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyB0aGlzLnNpZGVMZW5ndGggKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyICkgKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyKSApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArIHRoaXMuc2lkZUxlbmd0aCApXG4gICAgICAgICApO1xuICAgICAgLy8gUG9pbnRpbmcgUmlnaHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBjdHgubW92ZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyB0aGlzLnNpZGVMZW5ndGggKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyICkgKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIpIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSApXG4gICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICAgIC8vIENvbG9yIGl0IGluXG4gICAgICBpZiAoIHRoaXMuZmlsbFN0eWxlICkge1xuICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xuICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIH1cbiAgICAgIGlmICggdGhpcy5zdHJva2VTdHlsZSApIHtcbiAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlU3R5bGU7XG4gICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG4gICB9XG5cbiAgIGdldE51ZGdlZCh4KSB7XG4gICAgICBpZiAoIE1hdGguZmxvb3IoeCkgPT09IHggKSB7XG4gICAgICAgICByZXR1cm4geCArIDAuNTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXR1cm4geDtcbiAgICAgIH1cbiAgIH1cbn1cbiJdfQ==

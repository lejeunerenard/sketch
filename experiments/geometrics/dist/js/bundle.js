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

         window.setInterval(function () {
            _this.createTriangles();
            _this.draw();
         }, 100);

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

         while (triangleHeight < this.height) {
            var toggle = 0;
            while (triangleWidth < this.width) {
               var offset = this.sideLength / 2 * toggle;
               toggle = !toggle;

               var redColor = Math.floor(255 - (128 + Math.random() * 128) * (triangleWidth / this.width)).toString(16);

               if (redColor.length < 2) {
                  redColor = '0' + redColor;
               }

               var blueColor = Math.floor(255 * (triangleWidth / this.width)).toString(16);

               if (blueColor.length < 2) {
                  blueColor = '0' + blueColor;
               }

               var greenColor = Math.floor((128 + Math.random() * 128) * (triangleWidth / this.width)).toString(16);

               if (greenColor.length < 2) {
                  greenColor = '0' + greenColor;
               }

               // Create triangle pointing right
               this.triangles.push(new _triangle2['default']({
                  x: triangleWidth,
                  y: triangleHeight + offset,
                  sideLength: this.sideLength,
                  fillStyle: '#' + redColor + greenColor + blueColor
               }));

               // Create triangle pointing left
               this.triangles.push(new _triangle2['default']({
                  x: triangleWidth,
                  y: triangleHeight + this.sideLength / 2 + offset,
                  sideLength: this.sideLength,
                  rotate: 180,
                  fillStyle: '#' + redColor + greenColor + blueColor
               }));

               // H = B/2
               triangleWidth += this.sideLength / 2;
            }

            triangleHeight += this.sideLength;
            triangleWidth = 0;
         }
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VhbnplbGxtZXIvc2tldGNoL2V4cGVyaW1lbnRzL2dlb21ldHJpY3Mvc3JjL2FwcC5qcyIsIi9Vc2Vycy9zZWFuemVsbG1lci9za2V0Y2gvZXhwZXJpbWVudHMvZ2VvbWV0cmljcy9zcmMvdHJpYW5nbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7OztJQUUzQixHQUFHO0FBQ0ssWUFEUixHQUFHLENBQ00sTUFBTSxFQUFFLFVBQVUsRUFBRTs0QkFEN0IsR0FBRzs7O0FBR0gsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDeEMsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzs7QUFHakMsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCOztnQkFiRSxHQUFHOzthQWVGLGdCQUFHOztBQUVKLGFBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxhQUFJLENBQUMs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RztBQUNyQixlQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDbkMsZUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1VBQ2Y7T0FDSDs7O2FBRVEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1YsYUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRztBQUN4QixtQkFBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO1VBQ2pCLE1BQU07QUFDSixtQkFBTyxDQUFDLENBQUM7VUFDWDtPQUNIOzs7VUFqRmlCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBUcmlhbmdsZSBmcm9tICcuL3RyaWFuZ2xlJztcblxuY2xhc3MgQXBwIHtcbiAgIGNvbnN0cnVjdG9yKGNhbnZhcywgc2lkZUxlbmd0aCkge1xuICAgICAgLy8gQ2FudmFzIHN0dWZmXG4gICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgICB0aGlzLmhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcblxuICAgICAgLy8gVHJpYW5nbGUgcHJvcHNcbiAgICAgIHRoaXMuc2lkZUxlbmd0aCA9IHNpZGVMZW5ndGg7XG4gICAgICB0aGlzLmNyZWF0ZVRyaWFuZ2xlcygpO1xuICAgfVxuXG4gICBkcmF3KCkge1xuICAgICAgLy8gQ2xlYXIhXG4gICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICBsZXQgaSA9IHRoaXMudHJpYW5nbGVzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCBpIC0tICkge1xuICAgICAgICAgdGhpcy50cmlhbmdsZXNbaV0uZHJhdyh0aGlzLmN0eCk7XG4gICAgICB9XG4gICB9XG5cbiAgIHJ1bigpIHtcbiAgICAgIHRoaXMuZHJhdygpO1xuXG4gICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcbiAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgfSwgMTAwKTtcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcblxuICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB9KTtcbiAgIH1cblxuICAgY3JlYXRlVHJpYW5nbGVzKCkge1xuICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIHRyaWFuZ2xlc1xuICAgICAgdGhpcy50cmlhbmdsZXMgPSBbXTtcblxuICAgICAgbGV0IHRyaWFuZ2xlV2lkdGggID0gMCxcbiAgICAgICAgICB0cmlhbmdsZUhlaWdodCA9IC10aGlzLnNpZGVMZW5ndGg7XG5cbiAgICAgIHdoaWxlICggdHJpYW5nbGVIZWlnaHQgPCB0aGlzLmhlaWdodCApIHtcbiAgICAgICAgIGxldCB0b2dnbGUgPSAwO1xuICAgICAgICAgd2hpbGUgKCB0cmlhbmdsZVdpZHRoIDwgdGhpcy53aWR0aCApIHtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLnNpZGVMZW5ndGggLyAyICogdG9nZ2xlO1xuICAgICAgICAgICAgdG9nZ2xlID0gIXRvZ2dsZTtcblxuICAgICAgICAgICAgbGV0IHJlZENvbG9yID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgIDI1NSAtICggMTI4ICsgXG4gICAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDEyOCApICpcbiAgICAgICAgICAgICAgICAgICggdHJpYW5nbGVXaWR0aCAvIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgKS50b1N0cmluZygxNik7XG5cbiAgICAgICAgICAgIGlmICggcmVkQ29sb3IubGVuZ3RoIDwgMiApIHtcbiAgICAgICAgICAgICAgIHJlZENvbG9yID0gJzAnK3JlZENvbG9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYmx1ZUNvbG9yID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgIDI1NSAqICggdHJpYW5nbGVXaWR0aCAvIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgKS50b1N0cmluZygxNik7XG5cbiAgICAgICAgICAgIGlmICggYmx1ZUNvbG9yLmxlbmd0aCA8IDIgKSB7XG4gICAgICAgICAgICAgICBibHVlQ29sb3IgPSAnMCcrYmx1ZUNvbG9yO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZ3JlZW5Db2xvciA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAoIDEyOCArIFxuICAgICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAxMjggKSAqXG4gICAgICAgICAgICAgICAgICAoIHRyaWFuZ2xlV2lkdGggLyB0aGlzLndpZHRoIClcbiAgICAgICAgICAgICkudG9TdHJpbmcoMTYpO1xuXG4gICAgICAgICAgICBpZiAoIGdyZWVuQ29sb3IubGVuZ3RoIDwgMiApIHtcbiAgICAgICAgICAgICAgIGdyZWVuQ29sb3IgPSAnMCcrZ3JlZW5Db2xvcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRyaWFuZ2xlIHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBUcmlhbmdsZSh7XG4gICAgICAgICAgICAgICB4OiB0cmlhbmdsZVdpZHRoLFxuICAgICAgICAgICAgICAgeTogdHJpYW5nbGVIZWlnaHQgKyBvZmZzZXQsXG4gICAgICAgICAgICAgICBzaWRlTGVuZ3RoOiB0aGlzLnNpZGVMZW5ndGgsXG4gICAgICAgICAgICAgICBmaWxsU3R5bGU6ICcjJyArIHJlZENvbG9yICsgZ3JlZW5Db2xvciArIGJsdWVDb2xvcixcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRyaWFuZ2xlIHBvaW50aW5nIGxlZnRcbiAgICAgICAgICAgIHRoaXMudHJpYW5nbGVzLnB1c2gobmV3IFRyaWFuZ2xlKHtcbiAgICAgICAgICAgICAgIHg6IHRyaWFuZ2xlV2lkdGgsXG4gICAgICAgICAgICAgICB5OiB0cmlhbmdsZUhlaWdodCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICsgb2Zmc2V0LFxuICAgICAgICAgICAgICAgc2lkZUxlbmd0aDogdGhpcy5zaWRlTGVuZ3RoLFxuICAgICAgICAgICAgICAgcm90YXRlOiAxODAsXG4gICAgICAgICAgICAgICBmaWxsU3R5bGU6ICcjJyArIHJlZENvbG9yICsgZ3JlZW5Db2xvciArIGJsdWVDb2xvcixcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8gSCA9IEIvMlxuICAgICAgICAgICAgdHJpYW5nbGVXaWR0aCArPSB0aGlzLnNpZGVMZW5ndGggLyAyO1xuICAgICAgICAgfVxuXG4gICAgICAgICB0cmlhbmdsZUhlaWdodCArPSB0aGlzLnNpZGVMZW5ndGg7XG4gICAgICAgICB0cmlhbmdsZVdpZHRoID0gMDtcbiAgICAgIH1cbiAgIH1cbn1cblxud2luZG93LmFwcCA9IG5ldyBBcHAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJyksIDQzKTtcbndpbmRvdy5hcHAucnVuKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlhbmdsZSB7XG4gICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHRoaXMuc2lkZUxlbmd0aCA9IG9wdGlvbnMuc2lkZUxlbmd0aCB8fCA1O1xuICAgICAgdGhpcy5yb3RhdGUgPSBvcHRpb25zLnJvdGF0ZSB8fCAwO1xuXG4gICAgICAvLyBDb2xvcnNcbiAgICAgIHRoaXMuZmlsbFN0eWxlID0gb3B0aW9ucy5maWxsU3R5bGU7XG4gICAgICB0aGlzLnN0cm9rZVN0eWxlID0gb3B0aW9ucy5zdHJva2VTdHlsZTtcblxuICAgICAgaWYgKCAoICF0aGlzLmZpbGxTdHlsZSApICYmICggIXRoaXMuc3Ryb2tlU3R5bGUgKSApIHtcbiAgICAgICAgIHRoaXMuc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gICAgICB9XG5cbiAgICAgIC8vIFBvc2l0aW9uIGlzIHRoZSB0b3AgbGVmdCBvZiB0aGUgdHJpYW5nbGVcbiAgICAgIHRoaXMueCA9IG9wdGlvbnMueDtcbiAgICAgIHRoaXMueSA9IG9wdGlvbnMueTtcbiAgIH1cblxuICAgZHJhdyhjdHgpIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuXG4gICAgICAvLyBQb2ludGluZyBsZWZ0XG4gICAgICBpZiAoIHRoaXMucm90YXRlICkge1xuICAgICAgICAgY3R4Lm1vdmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArIHRoaXMuc2lkZUxlbmd0aCApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIpIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgdGhpcy5zaWRlTGVuZ3RoIClcbiAgICAgICAgICk7XG4gICAgICAvLyBQb2ludGluZyBSaWdodFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGN0eC5tb3ZlVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArIHRoaXMuc2lkZUxlbmd0aCApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArICggdGhpcy5zaWRlTGVuZ3RoIC8gMikgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgICAgLy8gQ29sb3IgaXQgaW5cbiAgICAgIGlmICggdGhpcy5maWxsU3R5bGUgKSB7XG4gICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG4gICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgfVxuICAgICAgaWYgKCB0aGlzLnN0cm9rZVN0eWxlICkge1xuICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VTdHlsZTtcbiAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIH1cbiAgIH1cblxuICAgZ2V0TnVkZ2VkKHgpIHtcbiAgICAgIGlmICggTWF0aC5mbG9vcih4KSA9PT0geCApIHtcbiAgICAgICAgIHJldHVybiB4ICsgMC41O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB4O1xuICAgICAgfVxuICAgfVxufVxuIl19

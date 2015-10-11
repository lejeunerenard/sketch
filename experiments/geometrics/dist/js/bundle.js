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

               // Create triangle pointing right
               this.triangles.push(new _triangle2['default']({
                  x: triangleWidth,
                  y: triangleHeight + offset,
                  sideLength: this.sideLength
               }));

               // Create triangle pointing left
               this.triangles.push(new _triangle2['default']({
                  x: triangleWidth,
                  y: triangleHeight + this.sideLength / 2 + offset,
                  sideLength: this.sideLength,
                  rotate: 180
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

         ctx.strokeStyle = '#000';
         ctx.stroke();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VhbnplbGxtZXIvc2tldGNoL2V4cGVyaW1lbnRzL2dlb21ldHJpY3Mvc3JjL2FwcC5qcyIsIi9Vc2Vycy9zZWFuemVsbG1lci9za2V0Y2gvZXhwZXJpbWVudHMvZ2VvbWV0cmljcy9zcmMvdHJpYW5nbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7OztJQUUzQixHQUFHO0FBQ0ssWUFEUixHQUFHLENBQ00sTUFBTSxFQUFFLFVBQVUsRUFBRTs0QkFEN0IsR0FBRzs7O0FBR0gsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDeEMsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzs7QUFHakMsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCOztnQkFiRSxHQUFHOzthQWVGLGdCQUFHOztBQUVKLGFBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxhQUFJLENBQUMs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QixDQUFDO0FBQ0Ysa0JBQUcsQ0FBQyxNQUFNLENBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLEVBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFFLENBQzVDLENBQUM7QUFDRixrQkFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEFBQUUsQ0FBRSxFQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEFBQUMsQ0FBRSxDQUNuRCxDQUFDO0FBQ0Ysa0JBQUcsQ0FBQyxNQUFNLENBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLEVBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUMxQixDQUFDO2FBQ0o7O0FBRUQsWUFBRyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDekIsWUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7OzthQUVRLG1CQUFDLENBQUMsRUFBRTtBQUNWLGFBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUc7QUFDeEIsbUJBQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztVQUNqQixNQUFNO0FBQ0osbUJBQU8sQ0FBQyxDQUFDO1VBQ1g7T0FDSDs7O1VBaEVpQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgVHJpYW5nbGUgZnJvbSAnLi90cmlhbmdsZSc7XG5cbmNsYXNzIEFwcCB7XG4gICBjb25zdHJ1Y3RvcihjYW52YXMsIHNpZGVMZW5ndGgpIHtcbiAgICAgIC8vIENhbnZhcyBzdHVmZlxuICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgIC8vIFRyaWFuZ2xlIHByb3BzXG4gICAgICB0aGlzLnNpZGVMZW5ndGggPSBzaWRlTGVuZ3RoO1xuICAgICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcbiAgIH1cblxuICAgZHJhdygpIHtcbiAgICAgIC8vIENsZWFyIVxuICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgbGV0IGkgPSB0aGlzLnRyaWFuZ2xlcy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlICggaSAtLSApIHtcbiAgICAgICAgIHRoaXMudHJpYW5nbGVzW2ldLmRyYXcodGhpcy5jdHgpO1xuICAgICAgfVxuICAgfVxuXG4gICBydW4oKSB7XG4gICAgICB0aGlzLmRyYXcoKTtcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblxuICAgICAgICAgdGhpcy5jcmVhdGVUcmlhbmdsZXMoKTtcblxuICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICB9KTtcbiAgIH1cblxuICAgY3JlYXRlVHJpYW5nbGVzKCkge1xuICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzIHRyaWFuZ2xlc1xuICAgICAgdGhpcy50cmlhbmdsZXMgPSBbXTtcblxuICAgICAgbGV0IHRyaWFuZ2xlV2lkdGggID0gMCxcbiAgICAgICAgICB0cmlhbmdsZUhlaWdodCA9IC10aGlzLnNpZGVMZW5ndGg7XG5cbiAgICAgIHdoaWxlICggdHJpYW5nbGVIZWlnaHQgPCB0aGlzLmhlaWdodCApIHtcbiAgICAgICAgIGxldCB0b2dnbGUgPSAwO1xuICAgICAgICAgd2hpbGUgKCB0cmlhbmdsZVdpZHRoIDwgdGhpcy53aWR0aCApIHtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLnNpZGVMZW5ndGggLyAyICogdG9nZ2xlO1xuICAgICAgICAgICAgdG9nZ2xlID0gIXRvZ2dsZTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRyaWFuZ2xlIHBvaW50aW5nIHJpZ2h0XG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBUcmlhbmdsZSh7XG4gICAgICAgICAgICAgICB4OiB0cmlhbmdsZVdpZHRoLFxuICAgICAgICAgICAgICAgeTogdHJpYW5nbGVIZWlnaHQgKyBvZmZzZXQsXG4gICAgICAgICAgICAgICBzaWRlTGVuZ3RoOiB0aGlzLnNpZGVMZW5ndGgsXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0cmlhbmdsZSBwb2ludGluZyBsZWZ0XG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKG5ldyBUcmlhbmdsZSh7XG4gICAgICAgICAgICAgICB4OiB0cmlhbmdsZVdpZHRoLFxuICAgICAgICAgICAgICAgeTogdHJpYW5nbGVIZWlnaHQgKyAoIHRoaXMuc2lkZUxlbmd0aCAvIDIgKSArIG9mZnNldCxcbiAgICAgICAgICAgICAgIHNpZGVMZW5ndGg6IHRoaXMuc2lkZUxlbmd0aCxcbiAgICAgICAgICAgICAgIHJvdGF0ZTogMTgwLFxuICAgICAgICAgICAgfSkpO1xuXG5cbiAgICAgICAgICAgIC8vIEggPSBCLzJcbiAgICAgICAgICAgIHRyaWFuZ2xlV2lkdGggKz0gdGhpcy5zaWRlTGVuZ3RoIC8gMjtcbiAgICAgICAgIH1cblxuICAgICAgICAgdHJpYW5nbGVIZWlnaHQgKz0gdGhpcy5zaWRlTGVuZ3RoO1xuICAgICAgICAgdHJpYW5nbGVXaWR0aCA9IDA7XG4gICAgICB9XG4gICB9XG59XG5cbndpbmRvdy5hcHAgPSBuZXcgQXBwKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpLCA0Myk7XG53aW5kb3cuYXBwLnJ1bigpO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJpYW5nbGUge1xuICAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICB0aGlzLnNpZGVMZW5ndGggPSBvcHRpb25zLnNpZGVMZW5ndGggfHwgNTtcbiAgICAgIHRoaXMucm90YXRlID0gb3B0aW9ucy5yb3RhdGUgfHwgMDtcblxuICAgICAgLy8gUG9zaXRpb24gaXMgdGhlIHRvcCBsZWZ0IG9mIHRoZSB0cmlhbmdsZVxuICAgICAgdGhpcy54ID0gb3B0aW9ucy54O1xuICAgICAgdGhpcy55ID0gb3B0aW9ucy55O1xuICAgfVxuXG4gICBkcmF3KGN0eCkge1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICAgIC8vIFBvaW50aW5nIGxlZnRcbiAgICAgIGlmICggdGhpcy5yb3RhdGUgKSB7XG4gICAgICAgICBjdHgubW92ZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgdGhpcy5zaWRlTGVuZ3RoIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArICggdGhpcy5zaWRlTGVuZ3RoIC8gMikgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyICkgKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyB0aGlzLnNpZGVMZW5ndGggKVxuICAgICAgICAgKTtcbiAgICAgIC8vIFBvaW50aW5nIFJpZ2h0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgY3R4Lm1vdmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgdGhpcy5zaWRlTGVuZ3RoIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyKSApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKVxuICAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMwMDAnO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgfVxuXG4gICBnZXROdWRnZWQoeCkge1xuICAgICAgaWYgKCBNYXRoLmZsb29yKHgpID09PSB4ICkge1xuICAgICAgICAgcmV0dXJuIHggKyAwLjU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9XG4gICB9XG59XG4iXX0=

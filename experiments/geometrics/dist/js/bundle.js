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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VhbnplbGxtZXIvc2tldGNoL2V4cGVyaW1lbnRzL2dlb21ldHJpY3Mvc3JjL2FwcC5qcyIsIi9Vc2Vycy9zZWFuemVsbG1lci9za2V0Y2gvZXhwZXJpbWVudHMvZ2VvbWV0cmljcy9zcmMvdHJpYW5nbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7OztJQUUzQixHQUFHO0FBQ0ssWUFEUixHQUFHLENBQ00sTUFBTSxFQUFFLFVBQVUsRUFBRTs0QkFEN0IsR0FBRzs7O0FBR0gsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDeEMsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzs7QUFHakMsVUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCOztnQkFiRSxHQUFHOzthQWVGLGdCQUFHOztBQUVKLGFBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRSxhQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQzs7QUFFOUIsZ0JBQVEsQ0FBQyxFQUFHLEVBQUc7QUFDWixnQkFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1VBQ25DO09BQ0g7OzthQUVFLGVBQUc7OztBQUNILGFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWixlQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDckMsa0JBQUssS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDL0Isa0JBQUssTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7O0FBRWpDLGtCQUFLLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBSyxLQUFLLENBQUM7QUFDL0Isa0JBQUssTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFLLE1BQU0sQ0FBQzs7QUFFakMsa0JBQUssZUFBZSxFQUFFLENBQUM7O0FBRXZCLGtCQUFLLElBQUksRUFBRSxDQUFDO1VBQ2QsQ0FBQyxDQUFDO09BQ0w7OzthQUVjLDJCQUFHOztBQUVmLGFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixhQUFJLGFBQWEsR0FBSSxDQUFDO2FBQ2xCLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7O0FBRXRDLGdCQUFRLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFHO0FBQ3BDLGdCQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDZixtQkFBUSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRztBQUNsQyxtQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQzFDLHFCQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUM7OztBQUdqQixtQkFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQWE7QUFDOUIsbUJBQUMsRUFBRSxhQUFhO0FBQ2hCLG1CQUFDLEVBQUUsY0FBYyxHQUFHLE1BQU07QUFDMUIsNEJBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDN0IsQ0FBQyxDQUFDLENBQUM7OztBQUdKLG1CQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQywwQkFBYTtBQUM5QixtQkFBQyxFQUFFLGFBQWE7QUFDaEIsbUJBQUMsRUFBRSxjQUFjLEdBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEFBQUUsR0FBRyxNQUFNO0FBQ3BELDRCQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDM0Isd0JBQU0sRUFBRSxHQUFHO2dCQUNiLENBQUMsQ0FBQyxDQUFDOzs7QUFJSiw0QkFBYSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZDOztBQUVELDBCQUFjLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNsQyx5QkFBYSxHQUFHLENBQUMsQ0FBQztVQUNwQjtPQUNIOzs7VUE3RUUsR0FBRzs7O0FBZ0ZULE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMzRCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0lDbkZJLFFBQVE7QUFDZCxZQURNLFFBQVEsQ0FDYixPQUFPLEVBQUU7NEJBREosUUFBUTs7QUFFdkIsYUFBTyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQzs7O0FBR2xDLFVBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNuQyxVQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7O0FBRXZDLFVBQUssQUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxBQUFFLEVBQUc7QUFDakQsYUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7T0FDNUI7OztBQUdELFVBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNuQixVQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckI7O2dCQWxCaUIsUUFBUTs7YUFvQnRCLGNBQUMsR0FBRyxFQUFFO0FBQ1AsWUFBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsWUFBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7QUFHaEIsYUFBSyxJQUFJLENBQUMsTUFBTSxFQUFHO0FBQ2hCLGVBQUcsQ0FBQyxNQUFNLENBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFLLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxBQUFFLENBQUUsRUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FDNUMsQ0FBQztBQUNGLGVBQUcsQ0FBQyxNQUFNLENBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFLLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxBQUFFLENBQUUsRUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQzFCLENBQUM7QUFDRixlQUFHLENBQUMsTUFBTSxDQUNQLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBRSxFQUN4QixJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEFBQUMsQ0FBRSxDQUNuRCxDQUFDO0FBQ0YsZUFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUssSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLEFBQUUsQ0FBRSxFQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUM1QyxDQUFDOztVQUVKLE1BQU07QUFDSixrQkFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQzFCLENBQUM7QUFDRixrQkFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FDNUMsQ0FBQztBQUNGLGtCQUFHLENBQUMsTUFBTSxDQUNQLElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsR0FBSyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQUFBRSxDQUFFLEVBQ2xELElBQUksQ0FBQyxTQUFTLENBQUUsSUFBSSxDQUFDLENBQUMsR0FBSyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQUFBQyxDQUFFLENBQ25ELENBQUM7QUFDRixrQkFBRyxDQUFDLE1BQU0sQ0FDUCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUUsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFFLENBQzFCLENBQUM7YUFDSjs7QUFFRCxZQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7OztBQUdoQixhQUFLLElBQUksQ0FBQyxTQUFTLEVBQUc7QUFDbkIsZUFBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQy9CLGVBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztVQUNiO0FBQ0QsYUFBSyxJQUFJLENBQUMsV0FBVyxFQUFHO0FBQ3JCLGVBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNuQyxlQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7VUFDZjtPQUNIOzs7YUFFUSxtQkFBQyxDQUFDLEVBQUU7QUFDVixhQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFHO0FBQ3hCLG1CQUFPLENBQUMsR0FBRyxHQUFHLENBQUM7VUFDakIsTUFBTTtBQUNKLG1CQUFPLENBQUMsQ0FBQztVQUNYO09BQ0g7OztVQWpGaUIsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFRyaWFuZ2xlIGZyb20gJy4vdHJpYW5nbGUnO1xuXG5jbGFzcyBBcHAge1xuICAgY29uc3RydWN0b3IoY2FudmFzLCBzaWRlTGVuZ3RoKSB7XG4gICAgICAvLyBDYW52YXMgc3R1ZmZcbiAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAvLyBUcmlhbmdsZSBwcm9wc1xuICAgICAgdGhpcy5zaWRlTGVuZ3RoID0gc2lkZUxlbmd0aDtcbiAgICAgIHRoaXMuY3JlYXRlVHJpYW5nbGVzKCk7XG4gICB9XG5cbiAgIGRyYXcoKSB7XG4gICAgICAvLyBDbGVhciFcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgIGxldCBpID0gdGhpcy50cmlhbmdsZXMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoIGkgLS0gKSB7XG4gICAgICAgICB0aGlzLnRyaWFuZ2xlc1tpXS5kcmF3KHRoaXMuY3R4KTtcbiAgICAgIH1cbiAgIH1cblxuICAgcnVuKCkge1xuICAgICAgdGhpcy5kcmF3KCk7XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgIHRoaXMuY3JlYXRlVHJpYW5nbGVzKCk7XG5cbiAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgfSk7XG4gICB9XG5cbiAgIGNyZWF0ZVRyaWFuZ2xlcygpIHtcbiAgICAgIC8vIFJlbW92ZSBwcmV2aW91cyB0cmlhbmdsZXNcbiAgICAgIHRoaXMudHJpYW5nbGVzID0gW107XG5cbiAgICAgIGxldCB0cmlhbmdsZVdpZHRoICA9IDAsXG4gICAgICAgICAgdHJpYW5nbGVIZWlnaHQgPSAtdGhpcy5zaWRlTGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoIHRyaWFuZ2xlSGVpZ2h0IDwgdGhpcy5oZWlnaHQgKSB7XG4gICAgICAgICBsZXQgdG9nZ2xlID0gMDtcbiAgICAgICAgIHdoaWxlICggdHJpYW5nbGVXaWR0aCA8IHRoaXMud2lkdGggKSB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5zaWRlTGVuZ3RoIC8gMiAqIHRvZ2dsZTtcbiAgICAgICAgICAgIHRvZ2dsZSA9ICF0b2dnbGU7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0cmlhbmdsZSBwb2ludGluZyByaWdodFxuICAgICAgICAgICAgdGhpcy50cmlhbmdsZXMucHVzaChuZXcgVHJpYW5nbGUoe1xuICAgICAgICAgICAgICAgeDogdHJpYW5nbGVXaWR0aCxcbiAgICAgICAgICAgICAgIHk6IHRyaWFuZ2xlSGVpZ2h0ICsgb2Zmc2V0LFxuICAgICAgICAgICAgICAgc2lkZUxlbmd0aDogdGhpcy5zaWRlTGVuZ3RoLFxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdHJpYW5nbGUgcG9pbnRpbmcgbGVmdFxuICAgICAgICAgICAgdGhpcy50cmlhbmdsZXMucHVzaChuZXcgVHJpYW5nbGUoe1xuICAgICAgICAgICAgICAgeDogdHJpYW5nbGVXaWR0aCxcbiAgICAgICAgICAgICAgIHk6IHRyaWFuZ2xlSGVpZ2h0ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyICkgKyBvZmZzZXQsXG4gICAgICAgICAgICAgICBzaWRlTGVuZ3RoOiB0aGlzLnNpZGVMZW5ndGgsXG4gICAgICAgICAgICAgICByb3RhdGU6IDE4MCxcbiAgICAgICAgICAgIH0pKTtcblxuXG4gICAgICAgICAgICAvLyBIID0gQi8yXG4gICAgICAgICAgICB0cmlhbmdsZVdpZHRoICs9IHRoaXMuc2lkZUxlbmd0aCAvIDI7XG4gICAgICAgICB9XG5cbiAgICAgICAgIHRyaWFuZ2xlSGVpZ2h0ICs9IHRoaXMuc2lkZUxlbmd0aDtcbiAgICAgICAgIHRyaWFuZ2xlV2lkdGggPSAwO1xuICAgICAgfVxuICAgfVxufVxuXG53aW5kb3cuYXBwID0gbmV3IEFwcChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKSwgNDMpO1xud2luZG93LmFwcC5ydW4oKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyaWFuZ2xlIHtcbiAgIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgdGhpcy5zaWRlTGVuZ3RoID0gb3B0aW9ucy5zaWRlTGVuZ3RoIHx8IDU7XG4gICAgICB0aGlzLnJvdGF0ZSA9IG9wdGlvbnMucm90YXRlIHx8IDA7XG5cbiAgICAgIC8vIENvbG9yc1xuICAgICAgdGhpcy5maWxsU3R5bGUgPSBvcHRpb25zLmZpbGxTdHlsZTtcbiAgICAgIHRoaXMuc3Ryb2tlU3R5bGUgPSBvcHRpb25zLnN0cm9rZVN0eWxlO1xuXG4gICAgICBpZiAoICggIXRoaXMuZmlsbFN0eWxlICkgJiYgKCAhdGhpcy5zdHJva2VTdHlsZSApICkge1xuICAgICAgICAgdGhpcy5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgICAgIH1cblxuICAgICAgLy8gUG9zaXRpb24gaXMgdGhlIHRvcCBsZWZ0IG9mIHRoZSB0cmlhbmdsZVxuICAgICAgdGhpcy54ID0gb3B0aW9ucy54O1xuICAgICAgdGhpcy55ID0gb3B0aW9ucy55O1xuICAgfVxuXG4gICBkcmF3KGN0eCkge1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICAgIC8vIFBvaW50aW5nIGxlZnRcbiAgICAgIGlmICggdGhpcy5yb3RhdGUgKSB7XG4gICAgICAgICBjdHgubW92ZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgdGhpcy5zaWRlTGVuZ3RoIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55IClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCApLFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueSArICggdGhpcy5zaWRlTGVuZ3RoIC8gMikgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyICkgKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKyB0aGlzLnNpZGVMZW5ndGggKVxuICAgICAgICAgKTtcbiAgICAgIC8vIFBvaW50aW5nIFJpZ2h0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgY3R4Lm1vdmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKVxuICAgICAgICAgKTtcbiAgICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy54ICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgdGhpcy5zaWRlTGVuZ3RoIClcbiAgICAgICAgICk7XG4gICAgICAgICBjdHgubGluZVRvKFxuICAgICAgICAgICAgdGhpcy5nZXROdWRnZWQoIHRoaXMueCArICggdGhpcy5zaWRlTGVuZ3RoIC8gMiApICksXG4gICAgICAgICAgICB0aGlzLmdldE51ZGdlZCggdGhpcy55ICsgKCB0aGlzLnNpZGVMZW5ndGggLyAyKSApXG4gICAgICAgICApO1xuICAgICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnggKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0TnVkZ2VkKCB0aGlzLnkgKVxuICAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgICAvLyBDb2xvciBpdCBpblxuICAgICAgaWYgKCB0aGlzLmZpbGxTdHlsZSApIHtcbiAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxTdHlsZTtcbiAgICAgICAgIGN0eC5maWxsKCk7XG4gICAgICB9XG4gICAgICBpZiAoIHRoaXMuc3Ryb2tlU3R5bGUgKSB7XG4gICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnN0cm9rZVN0eWxlO1xuICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfVxuICAgfVxuXG4gICBnZXROdWRnZWQoeCkge1xuICAgICAgaWYgKCBNYXRoLmZsb29yKHgpID09PSB4ICkge1xuICAgICAgICAgcmV0dXJuIHggKyAwLjU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9XG4gICB9XG59XG4iXX0=

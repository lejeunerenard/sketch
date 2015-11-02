import Triangle from './triangle';

class App {
   constructor(canvas, sideLength) {
      // Canvas stuff
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 2 * ( window.innerWidth / 2 - ( ( window.innerWidth / 2) % sideLength ) );
      this.canvas.height = 2 * ( window.innerHeight / 2 - ( ( window.innerHeight / 2 ) % sideLength ) );
      this.width = this.canvas.width;
      this.height = this.canvas.height;

      // Triangle props
      this.sideLength = sideLength;
      this.createTriangles();
   }

   draw() {
      // Clear!
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let i = this.triangles.length;

      while ( i -- ) {
         this.triangles[i].draw(this.ctx);
      }
   }

   run() {
      this.draw();

      /*
       * window.setInterval(() => {
       *    this.createTriangles();
       *    this.draw();
       * }, 100);
       */

      window.addEventListener('resize', () => {
         this.canvas.width = 2 * ( window.innerWidth / 2 - ( ( window.innerWidth / 2) % this.sideLength ) );
         this.canvas.height = 2 * ( window.innerHeight / 2 - ( ( window.innerHeight / 2 ) % this.sideLength ) );

         this.width = this.canvas.width;
         this.height = this.canvas.height;

         this.createTriangles();

         this.draw();
      });
   }

   createTriangles() {
      // Remove previous triangles
      this.triangles = [];

      let triangleWidth  = 0,
          triangleHeight = -this.sideLength;

      let colors = [
         '556270',
         '4ECDC4',
         'C7F464',
         'FF6B6B',
         'C44D58',
      ];

      while ( triangleHeight < this.height ) {
         let toggle = 0;
         while ( triangleWidth < this.width ) {
            let offset = this.sideLength / 2 * toggle;
            toggle = !toggle;

            var color = this.linerColorInterpolation('472F5F', 'F3819A', triangleWidth / this.width);

            // Create triangle pointing right
            if ( Math.random() > 0.5 ) {
               this.triangles.push(new Triangle({
                  x: triangleWidth,
                  y: triangleHeight + offset,
                  sideLength: this.sideLength,
                  fillStyle: '#'+color,
               }));
            }

            // Create triangle pointing left
            if ( Math.random() > 0.5 ) {
               this.triangles.push(new Triangle({
                  x: triangleWidth,
                  y: triangleHeight + ( this.sideLength / 2 ) + offset,
                  sideLength: this.sideLength,
                  rotate: 180,
                  fillStyle: '#'+color,
               }));
            }

            // H = B/2
            triangleWidth += this.sideLength / 2;
         }

         triangleHeight += this.sideLength;
         triangleWidth = 0;
      }
   }

   linerColorInterpolation( firstColor, secondColor, percentage ) {
      var rgb1 = this.hexToRgb(firstColor);
      var rgb2 = this.hexToRgb(secondColor);

      return Math.floor(
      // Red
       Math.floor( ( rgb2.r - rgb1.r ) * percentage + rgb1.r ) * 0x010000 +
      // Green
       Math.floor( ( rgb2.g - rgb1.g ) * percentage + rgb1.g ) * 0x000100 +
      // Blue
       Math.floor( ( rgb2.b - rgb1.b ) * percentage + rgb1.b ) * 0x000001 
      ).toString(16);
   }

   // Source:
   // http://stackoverflow.com/a/5624139/630490
   hexToRgb(hex) {
       // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
       var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
       hex = hex.replace(shorthandRegex, function(m, r, g, b) {
           return r + r + g + g + b + b;
       });

       var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
       return result ? {
           r: parseInt(result[1], 16),
           g: parseInt(result[2], 16),
           b: parseInt(result[3], 16)
       } : null;
   }
}

window.app = new App(document.querySelector('canvas'), 103);
window.app.run();

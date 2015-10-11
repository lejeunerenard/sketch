import Triangle from './triangle';

class App {
   constructor(canvas, sideLength) {
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

      window.addEventListener('resize', () => {
         this.width = window.innerWidth;
         this.height = window.innerHeight;

         this.canvas.width = this.width;
         this.canvas.height = this.height;

         this.createTriangles();

         this.draw();
      });
   }

   createTriangles() {
      // Remove previous triangles
      this.triangles = [];

      let triangleWidth  = 0,
          triangleHeight = -this.sideLength;

      while ( triangleHeight < this.height ) {
         let toggle = 0;
         while ( triangleWidth < this.width ) {
            let offset = this.sideLength / 2 * toggle;
            toggle = !toggle;

            // Create triangle pointing right
            this.triangles.push(new Triangle({
               x: triangleWidth,
               y: triangleHeight + offset,
               sideLength: this.sideLength,
            }));

            // Create triangle pointing left
            this.triangles.push(new Triangle({
               x: triangleWidth,
               y: triangleHeight + ( this.sideLength / 2 ) + offset,
               sideLength: this.sideLength,
               rotate: 180,
            }));


            // H = B/2
            triangleWidth += this.sideLength / 2;
         }

         triangleHeight += this.sideLength;
         triangleWidth = 0;
      }
   }
}

window.app = new App(document.querySelector('canvas'), 43);
window.app.run();

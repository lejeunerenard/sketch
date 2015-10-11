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

      window.setInterval(() => {
         this.createTriangles();
         this.draw();
      }, 100);

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

            let redColor = Math.floor(
               255 - ( 128 + 
                      Math.random() * 128 ) *
                  ( triangleWidth / this.width )
            ).toString(16);

            if ( redColor.length < 2 ) {
               redColor = '0'+redColor;
            }

            let blueColor = Math.floor(
               255 * ( triangleWidth / this.width )
            ).toString(16);

            if ( blueColor.length < 2 ) {
               blueColor = '0'+blueColor;
            }

            let greenColor = Math.floor(
               ( 128 + 
                      Math.random() * 128 ) *
                  ( triangleWidth / this.width )
            ).toString(16);

            if ( greenColor.length < 2 ) {
               greenColor = '0'+greenColor;
            }

            // Create triangle pointing right
            this.triangles.push(new Triangle({
               x: triangleWidth,
               y: triangleHeight + offset,
               sideLength: this.sideLength,
               fillStyle: '#' + redColor + greenColor + blueColor,
            }));

            // Create triangle pointing left
            this.triangles.push(new Triangle({
               x: triangleWidth,
               y: triangleHeight + ( this.sideLength / 2 ) + offset,
               sideLength: this.sideLength,
               rotate: 180,
               fillStyle: '#' + redColor + greenColor + blueColor,
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

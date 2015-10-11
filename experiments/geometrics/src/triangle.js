export default class Triangle {
   constructor (options) {
      options = options || {};

      this.sideLength = options.sideLength || 5;
      this.rotate = options.rotate || 0;

      // Position is the top left of the triangle
      this.x = options.x;
      this.y = options.y;
   }

   draw(ctx) {
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Pointing left
      if ( this.rotate ) {
         ctx.moveTo(
            this.getNudged( this.x + ( this.sideLength / 2 ) ),
            this.getNudged( this.y + this.sideLength )
         );
         ctx.lineTo(
            this.getNudged( this.x + ( this.sideLength / 2 ) ),
            this.getNudged( this.y )
         );
         ctx.lineTo(
            this.getNudged( this.x ),
            this.getNudged( this.y + ( this.sideLength / 2) )
         );
         ctx.lineTo(
            this.getNudged( this.x + ( this.sideLength / 2 ) ),
            this.getNudged( this.y + this.sideLength )
         );
      // Pointing Right
      } else {
         ctx.moveTo(
            this.getNudged( this.x ),
            this.getNudged( this.y )
         );
         ctx.lineTo(
            this.getNudged( this.x ),
            this.getNudged( this.y + this.sideLength )
         );
         ctx.lineTo(
            this.getNudged( this.x + ( this.sideLength / 2 ) ),
            this.getNudged( this.y + ( this.sideLength / 2) )
         );
         ctx.lineTo(
            this.getNudged( this.x ),
            this.getNudged( this.y )
         );
      }

      ctx.strokeStyle = '#000';
      ctx.stroke();
   }

   getNudged(x) {
      if ( Math.floor(x) === x ) {
         return x + 0.5;
      } else {
         return x;
      }
   }
}

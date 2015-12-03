import Vector from 'victor';

export default class ForceNode {
   constructor(options) {
      // option checking
      if ( ! options.x ) {
         throw new Error('new ForceNodes require a "x" parameter');
      }
      if ( ! options.y ) {
         throw new Error('new ForceNodes require a "y" parameter');
      }
      if ( ! options.range ) {
         throw new Error('new ForceNodes require a "range" parameter');
      }
      if ( ! options.forceField ) {
         throw new Error('new ForceNodes require a "forceField" parameter');
      }

      this.forceField = options.forceField;

      this.position = new Vector(options.x,options.y);
      this.range = options.range;
      this.intensity = options.intensity || 1;
   }

   x() {
      return this.position.x;
   }
   y() {
      return this.position.y;
   }

   calcForce(particle, distance) {
      // Defaults to a force towards the node inversely proportional to
      // the distance between them.
      return this.position.clone()
         .subtract(particle.position)
         .normalize()
         .multiplyScalar(this.intensity)
         .divideScalar(distance);
   }

   update() {

   }

   draw() {

   }
}

import Vector from 'victor';

export default class Particle {
   constructor(options) {
      // option checking
      if ( ! options.x ) {
         throw new Error('new Particles require a "x" parameter');
      }
      if ( ! options.y ) {
         throw new Error('new Particles require a "y" parameter');
      }
      if ( ! options.forceField ) {
         throw new Error('new Particles require a "forceField" parameter');
      }

      this.forceField = options.forceField;

      this.position = new Vector(options.x,options.y);

      this.m = options.mass || 1;
      this.velocity = options.velocity || new Vector(0, 0);

      this.color = options.color || 'rgba(0,0,0,.3)';
   }

   get x() {
      return this.position.x;
   }
   get y() {
      return this.position.y;
   }

   update(dt) {
      for (let i = 0; i < this.forceField.forceNodes.length; i++) {
         let node = this.forceField.forceNodes[i];

         let distance = this.position.distance(node.position);

         // If the node effects the particle
         if ( distance <= node.range ) {
            let force = node.calcForce(this, distance);
            this.velocity.add(force.divideScalar(this.m));
         }
      }
      this.position.add(this.velocity.clone().multiplyScalar(dt));
   }

   draw() {
      this.forceField.ctx.fillStyle = this.color;
      this.forceField.ctx.fillRect(this.x + this.forceField.canvas.width / 2, this.y + this.forceField.canvas.height / 2, 1, 1);
   }
}

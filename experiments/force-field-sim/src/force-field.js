import Particle from './particle';
import ForceNode from './force-node';

export default class ForceField {
   constructor(canvas) {
      this.particles = [];
      this.forceNodes = [];

      this.prevT = 0;

      this.canvas = canvas || document.querySelector('canvas');
      this.pixelRatio = window.devicePixelRatio || 1;
      this.canvas.width = window.innerWidth * this.pixelRatio;
      this.canvas.height = window.innerHeight * this.pixelRatio;

      this.ctx = this.canvas.getContext('2d');
   }

   generateCircleOfParticles(options) {
      // option checking
      if ( ! options.numParticles ) {
         throw new Error('option numParticles is required');
      }
      if ( ! options.particleRadius ) {
         throw new Error('option particleRadius is required');
      }

      // Create Particles
      for(let i = 0; i < options.numParticles; i++) {
         let radian = 2 * Math.PI * Math.random();
         let color = 'rgba(249,198,31,0.1)';
         // let color = 'rgba(0,0,0,0.1)';
         // let color = ( Math.random() > 0.5 ) ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,1)';
         this.particles.push(new Particle({
            forceField: this,
            color,
            x: Math.cos(radian) * options.particleRadius,
            y: Math.sin(radian) * options.particleRadius,
         }));
      }

      return this;
   }

   generateCircleOfForceNodes(options) {
      if ( ! options.numForceNodes ) {
         throw new Error('option numForceNodes is required');
      }
      if ( ! options.forceNodeRadius ) {
         throw new Error('option forceNodeRadius is required');
      }

      let choices = options.forcesChoices || [ ForceNode ];
      let maxRange = options.maxRange || 300;

      // Create Force Nodes
      let choiceLength = choices.length;
      for(let i = 0; i < options.numForceNodes; i++) {
         let radian = 2 * Math.PI * Math.random();
         let Type = choices[ Math.floor( Math.random() * choiceLength ) ];
         this.forceNodes.push(new Type({
            forceField: this,
            range: options.forceNodeRadius,
            // range: Math.random() * maxRange,
            intensity: 10,
            x: Math.cos(radian) * options.forceNodeRadius,
            y: Math.sin(radian) * options.forceNodeRadius,
         }));
      }

      return this;
   }

   generateCircleLayout(options) {
      this.generateCircleOfParticles(options);
      this.generateCircleOfForceNodes(options);

      return this;
   }

   update(t) {
      let dt = t - this.prevT;
      dt /= 1000;

      this.prevT = t;

      // Update particles
      let i = this.particles.length;
      while( i-- ) {
         this.particles[i].update(dt);
      }

      // Update Force Nodes
      i = this.forceNodes.length;
      while( i-- ) {
         this.forceNodes[i].update(dt);
      }
   }

   draw() {
      // Draw particles
      let i = this.particles.length;
      while( i-- ) {
         this.particles[i].draw();
      }

      // Draw Force Nodes
      i = this.forceNodes.length;
      while( i-- ) {
         this.forceNodes[i].draw();
      }

   }

   run(dt) {
      dt = dt || 0;
      this.update(dt);
      this.draw();

      // Start again
      requestAnimationFrame(this.run.bind(this));
   }
}

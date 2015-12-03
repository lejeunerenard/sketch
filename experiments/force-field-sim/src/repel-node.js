import ForceNode from './force-node';

export default class RepelNode extends ForceNode {
   calcForce(particle, distance) {
      // Defaults to a force towards the node inversely proportional to
      // the distance between them.
      return particle.position.clone()
         .subtract(this.position)
         .normalize()
         .divideScalar(distance);
   }
}

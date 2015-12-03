import ForceField from './force-field';
import ForceNode from './force-node';
import RepelNode from './repel-node';

window.ff = new ForceField().generateCircleOfParticles({
   numParticles: 2000,
   particleRadius: 400,
}).generateCircleOfForceNodes({
   numForceNodes: 100,
   forceNodeRadius: 280,
   maxRange: 400,
   forcesChoices: [
      ForceNode,
      RepelNode,
   ],
}).generateCircleOfForceNodes({
   numForceNodes: 100,
   forceNodeRadius: 600,
   maxRange: 400,
   forcesChoices: [
      ForceNode,
      RepelNode,
   ],
});
window.ff.run();

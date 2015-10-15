var blocks = [];

// Generate unicode characters
var blockElementsBlockStart = parseInt('2596', 16);
for ( var i = 0; i < 10; i ++ ) {
   blocks.push(String.fromCharCode(blockElementsBlockStart + i));
}

function getBlocks (x, y) {
   var output = '';

   for ( var i = 0; i < y; i ++ ) {
      var line = '';

      for ( var j = 0; j < x; j ++ ) {
         var index = Math.floor( Math.random() * ( blocks.length ) );
         line += blocks[index];
      }

      output += line + "\n";
   }

   return output;
}

(function(){
   d = function (...args) {
      var stack = new Error().stack;
      args.push(stack.split("\n")[2]);
      console.log(...args);
   }
}());

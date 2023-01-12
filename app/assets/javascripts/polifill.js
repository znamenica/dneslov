(function(e){
   e.closest = e.closest || function(css) {
      var node = this;

      while (node) {
         if (node.matches(css)) return node;
         else node = node.parentElement;
      }
      return null;
   }
})(Element.prototype);

(function(e){
   e.stopPropagation = e.stopPropagation || function() {
      e.cancelBubble = true;
      return null;
   }
})(Event.prototype);


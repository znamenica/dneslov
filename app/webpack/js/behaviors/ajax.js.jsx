document.addEventListener('DOMContentLoaded', () => {
   let send = XMLHttpRequest.prototype.send, token = $('meta[name=csrf-token]').attr('content');
   document.cookie = 'X-CSRF-Token=' + token;
   XMLHttpRequest.prototype.send = function(data) {
      this.setRequestHeader('X-CSRF-Token',token);
      this.async = true;

      return send.apply(this, arguments);
   };
})

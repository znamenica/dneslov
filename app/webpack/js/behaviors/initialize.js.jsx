import { mountComponents } from 'react-rails-ujs'

//import $ from 'jquery'
import Calendaries from 'Calendaries'
import MemoriesForm from 'MemoriesForm'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ Calendaries, MemoriesForm })

   var send = XMLHttpRequest.prototype.send, token = $('meta[name=csrf-token]').attr('content');
   document.cookie = 'X-CSRF-Token=' + token;
   XMLHttpRequest.prototype.send = function(data) {
      this.setRequestHeader('X-CSRF-Token',token);
      this.async = true;

      return send.apply(this, arguments);
   };
})

// TODO blow out all the requires in fawour of imports
require('classlist-polyfill')
require('custom-event-polyfill')
global.jQuery = require('./jquery.1')
global.$ = require('./jquery.1')
require('materialize-css/js/jquery.easing.1.3')
require('materialize-css/js/velocity.min')
require('materialize-css/js/global')
require('materialize-css/js/collapsible')
require('materialize-css/js/forms')
require('materialize-css/js/dropdown')
require('materialize-css/js/modal')
require('materialize-css/js/carousel')

import { mountComponents } from 'react-rails-ujs'
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

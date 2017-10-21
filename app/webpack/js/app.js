// TODO blow out all the requires in fawour of imports
require('classlist-polyfill')
require('custom-event-polyfill')
global.jQuery = require('./behaviors/jquery.1')
global.$ = require('./behaviors/jquery.1')
require('materialize-css/js/jquery.easing.1.3')
require('materialize-css/js/velocity.min')
require('materialize-css/js/global')
require('materialize-css/js/collapsible')
//require('materialize-css/js/forms')
//require('materialize-css/js/dropdown')
require('materialize-css/js/modal')
require('materialize-css/js/carousel')

// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

requireAll(require.context('./behaviors/', true, /(\.js|\.js.jsx|\.js.coffee)$/))

import { mountComponents } from 'react-rails-ujs/src/react-rails-ujs'

//import Calendaries from 'Calendaries'
import MemoriesForm from 'MemoriesForm'
document.addEventListener('DOMContentLoaded', () => {
   mountComponents({
//      Calendaries,
      MemoriesForm })
})

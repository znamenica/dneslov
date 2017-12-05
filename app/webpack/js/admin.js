// TODO blow out all the requires in fawour of imports
global.jQuery = require('./behaviors/jquery.1')
global.$ = require('./behaviors/jquery.1')
global.Vel = require('materialize-css/js/velocity.min')
global.Hammer = require('materialize-css/js/hammer.min')
require('materialize-css/js/jquery.easing.1.3')
require('materialize-css/js/global')
require('materialize-css/js/character_counter')
require('materialize-css/js/forms')
require('materialize-css/js/dropdown')
require('materialize-css/js/modal')
require('materialize-css/js/toasts')

// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

requireAll(require.context('./behaviors/', true, /(\.js|\.js.jsx|\.js.coffee)$/))

import { mountComponents } from 'react-rails-ujs/src/react-rails-ujs'

import Names from 'Names'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ Names })
})

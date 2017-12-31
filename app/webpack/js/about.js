// TODO blow out all the requires in fawour of imports
global.$ = require('./behaviors/jquery.1')

// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

requireAll(require.context('./behaviors/', true, /(\.js|\.js.jsx|\.js.coffee)$/))

import { mountComponents } from 'react-rails-ujs/src/react-rails-ujs'

import About from 'About'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ About })
})

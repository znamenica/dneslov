// TODO blow out all the requires in fawour of imports
require('./behaviors/polifill')
require('./behaviors/ajax')

// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

import { mountComponents } from 'react-rails-ujs/src/react-rails-ujs'

import Dashboard from 'Dashboard'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ Dashboard })
}, { passive: true })

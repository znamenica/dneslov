import './polifill'
import './ajax'
import './ext'

// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

import { mountComponents } from 'react-rails-ujs'

import Dashboard from 'Dashboard'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ Dashboard })
}, { passive: true })

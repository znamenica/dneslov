// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

import { mountComponents } from 'react-rails-ujs'

import About from 'About'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ About })
}, { passive: true })

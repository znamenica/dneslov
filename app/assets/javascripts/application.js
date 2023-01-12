import './polifill'
import './ajax'
import './ext'
import 'classlist-polyfill'
import 'custom-event-polyfill'

// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

import { mountComponents } from 'react-rails-ujs'

import MemoriesForm from 'MemoriesForm'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ MemoriesForm })
}, { passive: true })

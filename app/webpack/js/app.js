// TODO blow out all the requires in fawour of imports
require('./behaviors/polifill')
require('./behaviors/ajax')
require('./behaviors/ext')
require('classlist-polyfill')
require('custom-event-polyfill')

// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

import { mountComponents } from 'react-rails-ujs'

import MemoriesForm from 'MemoriesForm'

document.addEventListener('DOMContentLoaded', () => {
   mountComponents({ MemoriesForm })
}, { passive: true })

import {lory} from 'lory.js/dist/jquery.lory.js'

global.lory = lory

'use strict'

$(document).ready ->
   $('.modal').modal
      opacity: .5
      dismissible: true
      ready: (modal, trigger) ->
         $('.lory_slider').lory
            infinite: 5
            slideSpeed: 750
            ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
         $('.lory_slider').data().lory.slideTo global.lory_index;
         return

   $('img.carousel-item').on 'click', ->
      if $(this).hasClass 'active'
         global.lory_index = $(this).attr('data-index') - 1
         $('#slider-modal').modal 'open'
      return

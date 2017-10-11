import {lory} from 'lory.js/dist/jquery.lory.js'
global.lory = lory
'use strict'

$(document).ready ->
   $('.modal').modal
      ready: (modal, trigger) ->
         return

   $('img.carousel-item').on 'click', ->
      if $(this).hasClass 'active'
         if global.lory_scroll
            global.lory_index = $(this).attr('data-index') - 1
            $('.lory_slider').data().lory.slideTo global.lory_index;

         $('#slider-modal').modal 'open'
      return

   items_width = 0 #-25
   $('.lory_slider li').each (e, img) ->
      # items_width += img.clientWidth + 8
      items_width += $(img).outerWidth true

   modal = $('.modal')
   global.lory_scroll = items_width > modal.width()

   if ! global.lory_scroll
      modal.width items_width
      modal.find('.prev').addClass('hidden')
      modal.find('.next').addClass('hidden')

   lory_settings =
      slideSpeed: 750
      ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
   if global.lory_scroll
      # lory_settings.infinite = 1
      lory_settings.rewind = true

   $('.lory_slider').lory lory_settings

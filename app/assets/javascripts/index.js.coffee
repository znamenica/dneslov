(($) ->
   $.fn.extend donetyping: (callback, timeout) ->
      timeout = timeout or 1e3
      # 1 second default timeout
      timeoutReference = undefined

      doneTyping = (el) ->
         if !timeoutReference
            return
         timeoutReference = null
         callback.call el
         return

      @each (i, el) ->
         $el = $(el)
         # Chrome Fix (Use keyup over keypress to detect backspace)
         # thank you @palerdot
         $el.is(':input') and $el.on('keyup keypress paste', (e) ->
            # This catches the backspace button in chrome, but also prevents
            # the event from triggering too preemptively. Without this line,
            # using tab/shift+tab will make the focused element fire the callback.
            if e.type == 'keyup' and e.keyCode != 8
               return
            # Check if timeout has been set. If it has, "reset" the clock and
            # start over again.
            if timeoutReference
               clearTimeout timeoutReference
            timeoutReference = setTimeout((->
               # if we made it here, our timeout has elapsed. Fire the
               # callback
               doneTyping el
               return
            ), timeout)
            return
         ).on('blur', ->
            # If we can, fire the event since we're leaving the field
            doneTyping el
            return
         )
         return
   return
) jQuery

handle_search_request = ->
   form = $('form#query')
   request =
      url: form.attr('action') + '.js'
      data: form.serialize()
   $.ajax(request)
   return

init_js = (context) ->
   $(context).find('.collapsible').collapsible()
   $(context).find('.carousel').carousel()
   $(context).find('.chips').material_chip();
   # $(context).find('.chips-initial').material_chip();
   $(context).find('input[type=search]').donetyping(handle_search_request)
   return

$(document).ready ->
   init_js(document)
   $.ajaxSetup
      context: '#page'
      dataType: 'html'
   $(document).ajaxSuccess (e, response, settings) ->
      if settings.dataType == 'html' and settings.context and !settings.isLocal
         $(settings.context).children().remove()
         $(settings.context).append response.responseText
         init_js settings.context
         # path = settings.url
         # var el = document.createElement('a');
         # el.href = "http://www.somedomain.com/account/search?filter=a#top";
         # el.pathname    // /account/search
         history.pushState { 'html': response.responseText }, '', '/'
      return
   return

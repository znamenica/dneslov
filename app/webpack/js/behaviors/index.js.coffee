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

@filter_request = ->
   form = $('form#common-data')
   valuesToSubmit = $('form#query').serialize() + "&" + $('form#common-data').serialize()
   request =
      url: form.attr('action') + '.js'
      data: valuesToSubmit
      complete: (_, state) ->
         console.log '/index.js:', state
         return
   $.ajax(request)
   return

close_selection_date = (e) ->
   e.stopPropagation()
   $('form#common-data input[name=with_date]').attr('value', '')
   filter_request()
   $(this).hide()
   return

close_selection_token = (e) ->
   e.stopPropagation()
   this_token = $(this).parent().attr('data-token')
   regex = new RegExp(this_token.replace(/\+/, "\\+") + "([\\s\\+]+|$)")
   query = $('form#query input[type=search]').attr('value')
   $('form#query input[type=search]').attr('value', query.replace(regex, ""))
   filter_request()
   $(this).hide()
   return

close_selection_calendary = (e) ->
   e.stopPropagation()
   calendaries = $('form#common-data input[name=in_calendaries]').attr('value')
   this_calendary = $(this).parent().attr('data-slug')
   regex = new RegExp("(" + this_calendary + ",|," + this_calendary + "$|^" + this_calendary + "$)")
   $('form#common-data input[name=in_calendaries]').attr('value', calendaries.replace(regex, ""))
   filter_request()
   $(this).hide()
   $('.chip[data-slug=' + this_calendary + '] .close').removeClass('hidden')
   return

add_selection_calendary = (e) ->
   e.stopPropagation()
   this_calendary = $(this).parent().attr('data-slug')
   calendaries = $('form#common-data input[name=in_calendaries]').attr('value')
   if calendaries
      calendaries += ',' + this_calendary
   else
      calendaries = this_calendary
   $('form#common-data input[name=in_calendaries]').attr('value', calendaries)
   filter_request()
   $(this).hide()
   $('.chip[data-slug=' + this_calendary + '] .close').addClass('hidden')
   return

icon_click = (e) ->
   e.stopPropagation()
   return

init_js = (context) ->
   $(context).find('.collapsible').collapsible()
   $(context).find('.carousel.compact').carousel()
   $(context).find('select').material_select()

   $(context).find('input[type=search]').donetyping(filter_request)
   $(context).find('.chip.date .close.remove').on 'click', close_selection_date
   $(context).find('.chip.calendary .close.remove').on 'click', close_selection_calendary
   $(context).find('.chip.token .close.remove').on 'click', close_selection_token
   $(context).find('.chip.calendary .close.add').on 'click', add_selection_calendary
   $(context).find('.avatar a').on 'click', icon_click
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

$(document).ready(function(){
   pickmeup.defaults.locales['ру'] = {
      days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
   }
   pickmeup('#calendar', {
      locale: 'ру',
      first_day: 0,
   }).show()
   cal = $('.pickmeup').remove()
   cal.removeAttr('style')
   cal.appendTo('#calendar')
   $('#calendar').on('pickmeup-change', function (e) {
      console.log("selected date", e.detail.date)
      $('form#calendar-date input').attr('value', e.detail.formatted_date);
      form = $('form#calendar-date');
      valuesToSubmit = form.serialize();
      request = {
         url: form.attr('action') + '.js',
         data: valuesToSubmit,
         complete: function(_, state) {
            console.log("/index.js:", state)
         },
      }

      $.ajax(request)
   })
})

var pickmeup = require('pickmeup/dist/pickmeup.min.js')

$(document).ready(function(){
   pickmeup.defaults.locales['ру'] = {
      days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
   }
   selected = new Date();
   selected.setTime(selected.getTime() + 9*60*60*1000);
   selected_string = selected.getDate() + "/" + (selected.getMonth() + 1) + "/" + selected.getFullYear();
   pickmeup('#calendar', {
      date: selected_string, // plus 9 hours
      today_offset: 8*60*60*1000,
      locale: 'ру',
      first_day: 0,
   }).show()
   cal = $('.pickmeup').remove()
   cal.removeAttr('style')
   cal.appendTo('#calendar')
   $('#calendar').on('pickmeup-change', function (e) {
      console.log("selected date", e.detail.date)
      $('form#common-data input[name=with_date]').attr('value', e.detail.formatted_date);
      filter_request()
   })
})

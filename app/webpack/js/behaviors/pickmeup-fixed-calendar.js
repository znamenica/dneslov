//var pickmeup = require('pickmeup/dist/pickmeup.min.js')
var pickmeup = require('pickmeup/js/pickmeup.js')
var pmu;

var is_julian = function() {
   return ($('#julian:checked').length == 1);
}

var get_today = function() {
   today = new Date;

   if (is_julian()) {
      today.setDate(today.getDate() - 13);
   }
   today.setTime(today.getTime() + 8*60*60*1000);

   return today;
}

$(document).ready(function(){
   pickmeup.defaults.locales['ру'] = {
      days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
   }
   selected = get_today();
   selected.setTime(selected.getTime() + 1*60*60*1000);
   selected_string = selected.getDate() + "/" + (selected.getMonth() + 1) + "/" + selected.getFullYear();
   calendar_style = $("input[name='calendar-style']:checked").val();
   pmu = pickmeup('#calendar', {
      date: selected_string, // plus 9 hours
      locale: 'ру',
      first_day: 0,
      current: get_today(),
      calendar_gap: function () {
         return (is_julian() && -13 || 0);
      },
      render: function (date) {
         return { today : get_today() };
      }
   })
   pmu.show()
   cal = $('.pickmeup').remove()
   cal.removeAttr('style')
   instance = cal.find('.pmu-instance')
   styles = $('.style-select').remove()
   nextprev = $('.next-prev').remove()
   instance.append(nextprev)
   instance.prepend(styles)
   cal.appendTo('#calendar')
   $('#calendar').on('pickmeup-change', function (e) {
      console.log("selected date", e.detail.date)
      $('form#common-data input[name=with_date]').attr('value', e.detail.formatted_date);
      filter_request()
   })
   $('#calendar .pmu-yesterday').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      date = pmu.get_date();
      date.setDate(date.getDate() - 1);
      pmu.set_date(date);
      $('form#common-data input[name=with_date]').attr('value', pmu.get_date(true));
      filter_request()
   })
   $('#calendar .pmu-tomorrow').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      date = pmu.get_date();
      date.setDate(date.getDate() + 1);
      pmu.set_date(date);
      $('form#common-data input[name=with_date]').attr('value', pmu.get_date(true));
      filter_request()
   })
   $('#calendar input[name="calendar-style"]').on('change', function (e) {
      new_calendar_style = $(this).val();
      if (new_calendar_style != calendar_style) {
         new_date = pmu.get_date();
         if (new_calendar_style == 0) {
            new_date.setDate(new_date.getDate() - 13);
         } else {
            new_date.setDate(new_date.getDate() + 13);
         }
         pmu.set_date(new_date, new_date);
         calendar_style = new_calendar_style;
         $('form#common-data input[name=with_date]').attr('value', pmu.get_date(true));
         filter_request()
      }
   })
})

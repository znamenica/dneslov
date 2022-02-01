import { Component } from 'react'
import * as Pickmeup from 'pickmeup/js/pickmeup.js'
import { merge } from 'merge-anything'
import * as Axios from 'axios'
import {julianEaster, orthodoxEaster} from 'date-easter'
import PropTypes from 'prop-types'

export default class PickMeUpCalendar extends Component {
   static defaultProps = {
      withDate: null,
      calendarStyle: 'neojulian',
      calendary: {},
      pickmeup: {
         first_day: 0,
         locale: 'ру',
         flat: true,
         format: 'd.m.Y',
         locales: {
            'ру': {
               days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
               daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
               daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
               months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
               monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
            }
         }
      },
      onUpdate: null,
   }

   static propTypes = {
      withDate: PropTypes.string,
      calendarStyle: PropTypes.oneOf(['neojulian', 'julian']),
      calendary: PropTypes.object,
   }

   state = {
      withDate: [ this.props.withDate, this.props.calendarStyle ],
      calendarStyle: this.props.calendarStyle
   }

   pmu = null

   // system
   constructor(props) {
      super(props)

      this.onPickmeupChange = this.onPickmeupChange.bind(this)
      this.onYesterdayClick = this.onYesterdayClick.bind(this)
      this.onTomorrowClick = this.onTomorrowClick.bind(this)
      this.uprenderCalendar = this.uprenderCalendar.bind(this)
   }

   setState(value) {
      Object.keys(value).forEach((key) => { this.state[key] = value[key] })
      this.props.onUpdate({ withDate: this.state.withDate })
      console.log("[setState] * state", this.state)
   }

   componentDidMount() {
      let settings = merge({}, this.props.pickmeup, {
         date: this.selectedString(), // plus 9 hours
         current: this.getToday(),
         calendar_gap: this.recalculateGap.bind(this),
         render: this.onPickmeupRender.bind(this),
      })

      this.$calendar.addEventListener('pickmeup-fill', this.uprenderCalendar, { passive: true })

      this.pmu = Pickmeup(this.$calendar, settings)
      this.pmu.show()

      let cal = document.querySelector('.pickmeup') //.remove()
      let instance = cal.querySelector('.pmu-instance')
      let styles = document.querySelector('.style-select') //.remove()
      let nextprev = document.querySelector('.next-prev') //.remove()

      instance.append(nextprev)
      instance.prepend(styles)
      this.$calendar.append(cal)
      this.$calendar.addEventListener('pickmeup-change', this.onPickmeupChange, { passive: true })
      this.$calendar.querySelectorAll('.pmu-yesterday').forEach((el) => {
         el.addEventListener('click', this.onYesterdayClick)
      })
      this.$calendar.querySelectorAll('.pmu-tomorrow').forEach((el) => {
         el.addEventListener('click', this.onTomorrowClick)
      })
   }

   componentWillUnmount() {
      this.$calendar.remove()
      this.$calendar.removeEventListener('pickmeup-fill', this.uprenderCalendar)
      this.$calendar.removeEventListener('pickmeup-change', this.onPickmeupChange)
      this.$calendar.querySelectorAll('.pmu-yesterday').forEach((el) => {
         el.removeEventListener('click', this.onYesterdayClick)
      })
      this.$calendar.querySelectorAll('.pmu-tomorrow').forEach((el) => {
         el.removeEventListener('click', this.onTomorrowClick)
      })
   }

   // specific
   selectedString() {
      let selected

      if (this.state.withDate && this.state.withDate.first()) {
         let parts = this.state.withDate.first().split(".")

         selected = new Date(+parts[2], +parts[1] - 1, +parts[0])
      } else {
         selected = this.getToday()
      }

      selected.setTime(selected.getTime() + 1*60*60*1000)

      return selected.getDate() + "/" + (selected.getMonth() + 1) + "/" + selected.getFullYear()
   }

   recalculateGap() {
      return this.isJulian() && -13 || 0
   }

   isJulian(value) {
      return (value || this.state.calendarStyle) == 'julian'
   }

   getToday() {
      let today = new Date

      if (this.isJulian()) {
         today.setDate(today.getDate() + this.recalculateGap())
      }
      today.setTime(today.getTime() + 8*60*60*1000)

      return today
   }

   getOrigDate(dDate) {
      return new Date(dDate - this.recalculateGap() * 24*60*60*1000).getDate()
   }

   // events
   uprenderCalendar() {
      let doubleDates = this.$calendar.querySelectorAll('.pmu-date-double')

      doubleDates.forEach((dDate) => {
         let dates = dDate.className.split(" ").reduce((dates, klass) => {
            if (dates) {
               return dates
            }

            const regEx = /(\d+)-(\d+)/
            let match = klass.match(regEx)
            if (match) {
               return [ match[1], match[2] ]
            }

            return null
         }, null)

         dDate.innerHTML = "&nbsp;<span class='pmu-date-self'>" + dates[0] +
                           "</span><span class='pmu-date-usual'>" + dates[1] + "</span>"
      })
   }

   onPickmeupRender(date) {
      let renderObject = { today : this.getToday() }, classes = []

      if (this.isJulian()) {
         classes.push("pmu-date-" + date.getDate() + "-" + this.getOrigDate(date))
         classes.push('pmu-date-double')
      }

      if (this.matchEasterDate(date)) {
         classes.push('pmu-date-easter')
      }

      switch(this.matchFastDate(date)) {
         case 'meat':
            classes.push('pmu-date-light-fast')
            break
         case 'butter':
            classes.push('pmu-date-fast')
      }

      return Object.assign({}, renderObject, { class_name: classes.join(' ') })
   }

   easterDate(yearIn) {
      let year = yearIn || Date.now().getFullYear(),
          easterIn = Date.at(Date.parse(this.isJulian() && julianEaster(year) || orthodoxEaster(year)))

      return easterIn
   }

   // "matchBound" function to the test weither the date passed as an argument
   // is a fast day returning the measure the fast of any. Argument:
   // date        - the date to match
   // forward     - "+nnn" day after pascha date
   // backward    - "-nnn" day before pascha date
   // strictDay   - "nn" day of the month in the year
   // strictMonth - "mm" month of the year
   // weekDayIn   - "%n" week day only selection
   // weekDay     - week day for the date to match
   // easter      - easter for the date to match
   // year        - year of the date to match
   // baseDateRef - reference hash t store or read baseDate value from "date"
   matchBound(date, forward, backward, strictDay, strictMonth, weekDayIn, weekDay, easter, year, baseDateRef) {
      let cond = false,
          condDate,
          baseDate = baseDateRef["date"],
          condString = `${weekDayIn && "+weekDayIn == weekDay" || "true"} && date ${baseDate && "<=" || ">="} condDate`

      if (forward) {
         condDate = easter.dayshifted(+forward)
         cond = eval(condString)
      } else if (backward) {
         condDate = easter.dayshifted(-backward)
         if (baseDate && condDate < baseDate) {
            condDate = this.easterDate(year + 1).dayshifted(-backward)
         }

         cond = eval(condString)
      } else if (strictDay) {
         condDate = new Date(date)
         condDate.setDate(strictDay)
         condDate.setMonth(+strictMonth - 1)
         if (baseDate && condDate < baseDate) {
            condDate.setFullYear(condDate.getFullYear() + 1)
         }

         cond = eval(condString)
      }

      if (!baseDate) {
         baseDateRef["date"] = condDate
      }

      return cond
   }

   matchEasterDate(date) {
      return +date === +this.easterDate(date.getFullYear())
   }

   fastDays() {
      let calendary = this.props.calendary

      return calendary && calendary["meta"] && calendary["meta"]["fast_days"] || []
   }

   matchFastDate(date) {
      let year = date.getFullYear(),
          weekDay = (date.getDay() - this.recalculateGap()) % 7,
          easter = this.easterDate(year),
          fastDays = this.props.calendary["meta"]["fast_days"] || []

      return fastDays.reduce((measure, rule) => {
         let fast = [rule["days"]].flat().some((ranges) => {
            return [ranges].flat().some((range) => {
               let baseDateRef = {},
                   match = range.match(/(?:(?:\+(\d+))|(?:\-(\d+))|(\d+)\.(\d+))(?:%(\d))?(?:\.\.(?:(?:\+(\d+))|(?:\-(\d+))|(\d+)\.(\d+))(?:%(\d))?)?/),
                   begin = this.matchBound(date, match[1], match[2], match[3], match[4], match[5], weekDay, easter, year, baseDateRef)

               if (begin) {
                  let end

                  if (match[6] || match[7] || match[8]) {
                     end = this.matchBound(date, match[6], match[7], match[8], match[9], match[10], weekDay, easter, year, baseDateRef)
                  } else {
                     end = this.matchBound(date, match[1], match[2], match[3], match[4], match[5], weekDay, easter, year, baseDateRef)
                  }

                  return begin && end
               } else {
                  return begin
               }
            })
         })

         return measure || fast && [rule["measure"]].flat().last()
      }, null)
   }

   onPickmeupChange(e) {
      this.setState({withDate: [ e.detail.formatted_date, this.state.calendarStyle ]})
   }

   onYesterdayClick(e) {
      let date = this.pmu.get_date()

      date.setDate(date.getDate() - 1)
      this.pmu.set_date(date)
      this.setState({withDate: [ this.pmu.get_date(true), this.state.calendarStyle ]})

      e.preventDefault()
      e.stopPropagation()
   }

   onTomorrowClick(e) {
      let date = this.pmu.get_date()

      date.setDate(date.getDate() + 1)
      this.pmu.set_date(date)
      this.setState({withDate: [ this.pmu.get_date(true), this.state.calendarStyle ]})

      e.preventDefault()
      e.stopPropagation()
   }

   onClick(e) {
      let newCalendarStyle = e.target.getAttribute('id')

      if (newCalendarStyle != this.state.calendarStyle) {
         let new_date = this.pmu.get_date()
         if (this.isJulian(newCalendarStyle)) {
            new_date.setDate(new_date.getDate() - 13)
         } else {
            new_date.setDate(new_date.getDate() + 13)
         }
         this.state.calendarStyle = newCalendarStyle
         this.pmu.set_date(new_date, new_date)
         e.target.classList.add('clicked')

         this.setState({
            withDate: [ this.pmu.get_date(true), newCalendarStyle ]
         })
      }
   }

   labelClassName(type) {
      let klass = ['pmu-style', type]

      if (this.state.calendarStyle == type) {
         klass = klass.concat('checked')
      }

      return klass.join(" ")
   }

   render() {
      console.log("[render] * this.props", this.props)

      return (
         <div className='row calendary'>
            <div className='hidden'>
               <nav
                  key="calendarStyles"
                  className='style-select'
                  id='calendar-styles'>
                  <label
                     id='julian'
                     className={this.labelClassName('julian')}
                     key="labelJulian"
                     onClick={this.onClick.bind(this)}
                     htmlFor='julian'>
                        Юлианский</label>
                  <label
                     id='neojulian'
                     className={this.labelClassName('neojulian')}
                     key="labelNeojulian"
                     onClick={this.onClick.bind(this)}
                     htmlFor="neojulian">
                        Новоюлианский</label></nav>
               <nav
                  key="dayNavigate"
                  className='next-prev'>
                  <div
                     className='pmu-yesterday pmu-button'>◀ Вчера</div>
                  <div
                     className='pmu-tomorrow pmu-button'>Завтра ▶</div></nav></div>
            <div
               id='calendar'
               key='calendar'
               ref={e => this.$calendar = e} /></div>)
   }
}

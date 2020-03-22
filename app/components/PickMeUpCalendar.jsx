import { Component } from 'react'
import * as Pickmeup from 'pickmeup/js/pickmeup.js'
import * as assign from 'assign-deep'
import * as Axios from 'axios'
import PropTypes from 'prop-types'

export default class PickMeUpCalendar extends Component {
   static defaultProps = {
      with_date: null,
      calendar_style: 'julian',
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
      with_date: PropTypes.string,
      calendar_style: PropTypes.oneOf(['newjulian', 'julian']),
   }

   state = {
      with_date: [ this.props.with_date, this.props.calendar_style ],
      calendar_style: this.props.calendar_style
   }

   pmu = null

   // system
   constructor(props) {
      super(props)

      this.onPickmeupChange = this.onPickmeupChange.bind(this)
      this.onYesterdayClick = this.onYesterdayClick.bind(this)
      this.onTomorrowClick = this.onTomorrowClick.bind(this)
      this.onChangeStyle = this.onChangeStyle.bind(this)
   }

   setState(value) {
      Object.keys(value).forEach((key) => {
         this.state[key] = value[key]
      })

      this.props.onUpdate({ with_date: this.state.with_date })
      console.log("state", this.state)
   }

   selectedString() {
      let selected = this.getToday()

      selected.setTime(selected.getTime() + 1*60*60*1000)

      return selected.getDate() + "/" + (selected.getMonth() + 1) + "/" + selected.getFullYear()
   }

   recalculateGap() {
      return this.isJulian() && -13 || 0
   }

   isJulian(value) {
      return (value || this.state.calendar_style) == 'julian'
   }

   getToday() {
      let today = new Date

      if (this.isJulian()) {
         today.setDate(today.getDate() - 13)
      }
      today.setTime(today.getTime() + 8*60*60*1000)

      return today
   }

   componentDidMount() {
      let settings = assign({}, this.props.pickmeup, {
         date: this.selectedString(), // plus 9 hours
         current: this.getToday(),
         calendar_gap: this.recalculateGap.bind(this),
         render: this.onPickmeupRender.bind(this),
      })

      this.pmu = Pickmeup(this.$calendar, settings)
      this.pmu.show()

      let cal = document.querySelector('.pickmeup') //.remove()
      let instance = cal.querySelector('.pmu-instance')
      let styles = document.querySelector('.style-select') //.remove()
      let nextprev = document.querySelector('.next-prev') //.remove()

      instance.append(nextprev)
      instance.prepend(styles)

      this.$calendar.append(cal)
      this.$calendar.addEventListener('pickmeup-change', this.onPickmeupChange)
      this.$calendar.querySelectorAll('.pmu-yesterday').forEach((el) => {
         el.addEventListener('click', this.onYesterdayClick)
      })
      this.$calendar.querySelectorAll('.pmu-tomorrow').forEach((el) => {
         el.addEventListener('click', this.onTomorrowClick)
      })
      this.$calendar.querySelectorAll('.pmu-style').forEach((el) => {
         el.addEventListener('click', this.onChangeStyle)
      })
   }

   componentWillUnmount() {
      this.$calendar.remove()
      this.$calendar.removeEventListener('pickmeup-change', this.onPickmeupChange)
      this.$calendar.querySelectorAll('.pmu-yesterday').forEach((el) => {
         el.removeEventListener('click', this.onYesterdayClick)
      })
      this.$calendar.querySelectorAll('.pmu-tomorrow').forEach((el) => {
         el.removeEventListener('click', this.onTomorrowClick)
      })
      this.$calendar.querySelectorAll('.pmu-style').forEach((el) => {
         removeEventListener('click', this.onChangeStyle)
      })
   }

   onPickmeupRender() {
      return { today : this.getToday() }
   }

   onPickmeupChange(e) {
      this.setState({with_date: [ e.detail.formatted_date, this.state.calendar_style ]})
   }

   onYesterdayClick(e) {
      let date = this.pmu.get_date()

      date.setDate(date.getDate() - 1)
      this.pmu.set_date(date)
      this.setState({with_date: [ this.pmu.get_date(true), this.state.calendar_style ]})

      e.preventDefault()
      e.stopPropagation()
   }

   onTomorrowClick(e) {
      let date = this.pmu.get_date()

      date.setDate(date.getDate() + 1)
      this.pmu.set_date(date)
      this.setState({with_date: [ this.pmu.get_date(true), this.state.calendar_style ]})

      e.preventDefault()
      e.stopPropagation()
   }

   onChangeStyle(e) {
      let radio_id = e.target.getAttribute('for'),
          radio = e.target.parentElement.querySelector('#' + radio_id),
          new_calendar_style = radio.getAttribute('value')

      if (new_calendar_style != this.state.calendar_style) {
         let new_date = this.pmu.get_date()
         if (this.isJulian(new_calendar_style)) {
            new_date.setDate(new_date.getDate() - 13)
         } else {
            new_date.setDate(new_date.getDate() + 13)
         }
         this.state.calendar_style = new_calendar_style
         this.pmu.set_date(new_date, new_date)
         this.setState({
            with_date: [ this.pmu.get_date(true), new_calendar_style ]
         })
      }
   }

   render() {
      return (
         <div className='row calendary'>
            <div className='hidden'>
               <nav
                  className='style-select'
                  id='calendar-styles'>
                  <input
                     className='hidden'
                     id='julian'
                     type='radio'
                     name='calendar-style'
                     defaultChecked
                     value='julian' />
                  <label
                     className='pmu-style julian'
                     htmlFor='julian'>
                        Юлианский</label>
                  <input
                     className='hidden'
                     id='neojulian'
                     type='radio'
                     name='calendar-style'
                     value='neojulian' />
                  <label
                     className='pmu-style neo-julian'
                     htmlFor="neojulian">
                        Новоюлианский</label></nav>
               <nav className='next-prev'>
                  <div
                     className='pmu-yesterday pmu-button'>◀</div>
                  <div
                     className='pmu-yesterday pmu-left pmu-button'>Вчера</div>
                  <div
                     className='pmu-tomorrow pmu-right pmu-button'>Завтра</div>
                  <div
                     className='pmu-tomorrow pmu-button'>▶</div></nav></div>
            <div
               id='calendar'
               key='calendar'
               ref={e => this.$calendar = e} /></div>)}}

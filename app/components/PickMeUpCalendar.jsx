import { Component } from 'react'
import Pickmeup from 'pickmeup/js/pickmeup.js'
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

   constructor(props) {
      super(props)

      console.log(props)
      this.onPickmeupRender = this.onPickmeupRender.bind(this)
      this.onPickmeupChange = this.onPickmeupChange.bind(this)
      this.onTomorrowClick = this.onTomorrowClick.bind(this)
      this.onYesterdayClick = this.onYesterdayClick.bind(this)
      this.onChangeStyle = this.onChangeStyle.bind(this)
   }

   setState = (value) => {
      Object.keys(value).forEach((key) => {
         this.state[key] = value[key]
      })
      this.props.onUpdate({ with_date: this.state.with_date })
      console.log("state", this.state)
   }

   selectedString = () => {
      let selected = this.getToday()

      selected.setTime(selected.getTime() + 1*60*60*1000)
      return selected.getDate() + "/" + (selected.getMonth() + 1) + "/" + selected.getFullYear()
   }

   recalculateGap = () => {
      return this.isJulian() && -13 || 0
   }

   isJulian = (value) => {
      return (value || this.state.calendar_style) == 'julian'
   }

   getToday = () => {
      let today = new Date

      if (this.isJulian()) {
         today.setDate(today.getDate() - 13)
      }
      today.setTime(today.getTime() + 8*60*60*1000)

      return today
   }

   componentDidMount = () => {
      let p = $.extend(this.props.pickmeup, {
         date: this.selectedString(), // plus 9 hours
         current: this.getToday(),
         calendar_gap: this.recalculateGap,
         render: this.onPickmeupRender,
      })

      this.pmu = Pickmeup('#calendar', p)
      this.pmu.show()

      let cal = $('.pickmeup').remove()
      let instance = cal.find('.pmu-instance')
      let styles = $('.style-select').remove()
      let nextprev = $('.next-prev').remove()

      instance.append(nextprev)
      instance.prepend(styles)

      this.$el = $(this.el)
      this.$el.append(cal)
      this.$el.on('pickmeup-change', this.onPickmeupChange)
      this.$el.find('.pmu-yesterday').on('click', this.onYesterdayClick)
      this.$el.find('.pmu-tomorrow').on('click', this.onTomorrowClick)
      this.$el.find('input[name="calendar-style"]').on('click', this.onChangeStyle)
   }

   componentWillUnmount = () => {
      this.$el.off('pickmeup-change', this.onPickmeupChange)
      this.$el.find('.pmu-yesterday').off('click', this.onYesterdayClick)
      this.$el.find('.pmu-tomorrow').off('click', this.onTomorrowClick)
      this.$el.find('input[name="calendar-style"]').off('click', this.onChangeStyle)
      this.$el.empty()
   }

   render = () => {
      return (
         <div className='row calendary'>
            <div className='hidden'>
               <nav className='style-select'>
                  <input
                     className='hidden'
                     id='julian'
                     type='radio'
                     name='calendar-style'
                     defaultChecked
                     value='julian' />
                  <label
                     className='pmu-style'
                     htmlFor='julian'>Юлианский</label>
                  <input
                     className='hidden'
                     id='neojulian'
                     type='radio'
                     name='calendar-style'
                     value='neojulian' />
                  <label
                     className='pmu-style'
                     htmlFor="neojulian">Новоюлианский</label></nav>
               <nav className='next-prev'>
                  <div
                     className='pmu-yesterday pmu-button'>◀</div>
                  <div
                     className='pmu-yesterday pmu-left pmu-button'>Вчера</div>
                  <div
                     className='pmu-tomorrow pmu-right pmu-button'>Завтра</div>
                  <div
                     className='pmu-tomorrow pmu-button'>▶</div></nav></div>
            <div id='calendar'
               key='calendar'
               ref={el => this.el = el} /></div>)
   }

   onPickmeupRender = () => {
      return { today : this.getToday() }
   }

   onPickmeupChange = (e) => {
      this.setState({with_date: [ e.detail.formatted_date, this.state.calendar_style ]})
   }

   onYesterdayClick = (e) => {
      let date = this.pmu.get_date()
      date.setDate(date.getDate() - 1)
      this.pmu.set_date(date)
      this.setState({with_date: [ this.pmu.get_date(true), this.state.calendar_style ]})

      e.preventDefault()
      e.stopPropagation()
   }

   onTomorrowClick = (e) => {
      let date = this.pmu.get_date()
      date.setDate(date.getDate() + 1)
      this.pmu.set_date(date)
      this.setState({with_date: [ this.pmu.get_date(true), this.state.calendar_style ]})

      e.preventDefault()
      e.stopPropagation()
   }

   onChangeStyle = (e) => {
      let new_calendar_style = $(e.target).val()

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
            with_date: [ this.pmu.get_date(true), new_calendar_style ]})
      }
   }
}

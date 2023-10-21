import { Component } from 'react'
import {julianEaster, orthodoxEaster} from 'date-easter'

import EventSpan from 'EventSpan'
import { yeardateToMs } from 'support'

export default class EventSpans extends Component {
   static defaultProps = {
      msDate: null,
      calendarStyle: 'julian',
      defaultCalendarySlug: null,
      specifiedCalendarySlug: null,
      describedMemoIds: [],
      events: [],
      slug: null,
   }

   static staticKindCodes = [
      '',
      'Prophecy',
      'Genum',
      'Conception',
      'Nativity',
      'Circumcision',
      'Meeting',
      'Baptism',
      'Marriage',
      'Conceiving',
      'Assurance',
      'Transfiguration',
      'Revival',
      'Entrance',
      'Curse',
      'Preach',
      'Betraial',
      'Supper',
      'Passion',
      'Repose',
      'Rest',
      'Veneration',
      'Placing',
      'Resurrection',
      'Learning',
      'Writing',
      'Appearance',
      'Exaltation',
      'Ascension',
      'Uncovering',
      'Translation',
      'Miracle',
      'Protection',
      'Renunciation',
      'Adoration',
      'Restoration',
      'Sanctification',
      'Council',
   ]

   static getDerivedStateFromProps(props, state) {
      console.debug("[getDerivedStateFromProps] <<<", props, state)

      if (props !== state.prevProps) {
         return({
            events: EventSpans.sortEvents(props),
            prevProps: props
         })
      } else {
         return null
      }
   }

   static calculateNearbyDate(eventsIn, msDate) {
      console.debug("[calculateNearbyDate] <<<", eventsIn, msDate, new Date(msDate || Date.now()))

      let distances =
         eventsIn.map((event, index) => {
            return [event.date - msDate, index]
         }),
         indexNearbyIn = distances.filter(([dist, _]) => dist >= 0).sort(([dist1, _i], [dist2, _j]) => dist1 > dist2)[0] || [],
         indexNearby = indexNearbyIn[1]

      return eventsIn.map((event, index) => {
         if (index == indexNearby) {
            event.active = true
         }

         return event
      })
   }

   static yearDateFor(event, calendarySlug) {
      let memo = event.memoes.find(m => m.calendary_slug == calendarySlug) || event.memoes[0]

      return memo?.year_date
   }

   static easterDate(yearIn, style) {
      let year = yearIn || Date.now().getFullYear(),
          easterIn = Date.at(Date.parse(style == 'julian' ? julianEaster(year) : orthodoxEaster(year)))

      return easterIn
   }

   static fixedYearForYearDate(yearDate, year) {
      return yearDate && yearDate.split('.').reverse().join("") >= "0901" ? year : year + 1
   }

   static dateFor(yearDate, msDate, style) {
      console.debug("[dateFor] <<<", yearDate, msDate, style)

      let dateIn = new Date(msDate || Date.now()),
          yearIn = dateIn.getFullYear(),
          m = yearDate && yearDate.match(/(?<sign>[+-])(?<indent>.*)|(?<yearM>.*)(?<divisor>[%<>~])(?<dateM>.*)/),
          date, year, datePre, gapIn, gap, mul

      if (!m) {
         year = this.fixedYearForYearDate(yearDate, yearIn)
         date = yearDate && new Date(Date.parse((yearDate.concat("." + year)).split('.').reverse().join('-')))
      } else if (m[1]) {
         mul = m[1] == '-' ? -1 : 1

         date = new Date(this.easterDate(yearIn, style).getTime() + mul * parseInt(m[2]) * 24 * 60 * 60 * 1000)
      } else if (m[3]) {
         year = this.fixedYearForYearDate(m[3], yearIn),
         datePre = new Date(Date.parse((m[3].concat("." + year)).split('.').reverse().join('-'))),
         gapIn = parseInt(m[5]) - datePre.getDay()

         switch (m[4]) {
            case '%':
               // '%' => (0..6), 01.01%0 = 01.01.1900=1/+6, %0=0/+0, %0=6/+1
               gap = gapIn < 0 && gapIn + 7 || gapIn
               break
            case '<':
               // '<' => (1..7), // 01.01%0 = 01.01.1900=1/+6, %0=0/+7, %0=6/+1
               gap = gapIn >= 0 && gapIn - 7 || gapIn
               break
            case '>':
               // '>' => (-7..-1), 01.01%0 = 01.01.1900=1/+6, %0=0/-7, %0=6/-6
               gap = gapIn <= 0 && gapIn + 7 || gapIn
               break
            case '~':
               // '~' => (-3..3), 01.01%0 = 01.01.1900=1/+6, %0=0/+0, %0=6/+1
               gap = gapIn < -3 && gapIn + 7 || gapIn > 3 && gapIn - 7 || gapIn
         }

         date = new Date(datePre - gap * 24 * 60 * 60 * 1000)
      }

      console.debug("[dateFor] >>>", date)

      return date
   }

   static sortEvents(props) {
      // TODO remove in favor of sort by flexdate
      let events = props.events.sort((x, y) => {
         let xi = this.staticKindCodes.indexOf(x.kind_code) || this.staticKindCodes.length + 1,
             yi = this.staticKindCodes.indexOf(y.kind_code) || this.staticKindCodes.
length + 1

         if (xi < yi) {
            return -1
         } else if (xi > yi) {
            return 1
         }
         return 0
      }).flat().map((event) => {
         event.date = this.dateFor(this.yearDateFor(event, props.defaultCalendarySlug), props.msDate, props.calendarStyle)

         console.debug("[sortEvents] ***** event", event)

         return event
      })

      return this.calculateNearbyDate(events, props.msDate)
   }

   // system
   state = {}

   componentDidMount() {
      this.collapsible = M.Collapsible.init(this.$collapsible, {})
   }

   componentWillUnmount() {
      this.collapsible.destroy()
   }

   // custom
   render() {
      console.log("[render] * props:", this.props, "state:", this.state)

      return (
         <div
            className='row'
            id='events-list'>
            <ul
               key='events-list'
               ref={e => this.$collapsible = e}
               className='collapsible collection'
               data-collapsible='expandable' >
               {this.state.events.filterMap((event) =>
                  <EventSpan
                     key={'event-' + event.id}
                     active={event.active}
                     specifiedCalendarySlug={this.props.specifiedCalendarySlug}
                     defaultCalendarySlug={this.props.defaultCalendarySlug}
                     describedMemoIds={this.props.describedMemoIds}
                     happenedAt={event.happened_at}
                     kindName={event.kind_name}
                     place={event.place}
                     id={event.id}
                     date={event.date?.toLocaleDateString('ru-RU')}
                     slug={this.props.slug}
                     titles={event.titles}
                     scripta={event.scripta} />)}</ul></div>)}}

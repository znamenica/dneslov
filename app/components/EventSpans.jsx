import { Component } from 'react'

import EventSpan from 'EventSpan'
import { yeardateToMs } from 'support'

export default class EventSpans extends Component {
   static defaultProps = {
      msDate: null,
      defaultCalendarySlug: null,
      describedMemoIds: [],
      events: [],
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
      if (props !== state.prevProps) {
         return({
            nearbyDate: EventSpans.calculateNearbyDate(props),
            events: EventSpans.sortEvents(props),
            prevProps: props
         })
      } else {
         return null
      }
   }

   static calculateNearbyDate(props) {
      console.debug("[calculateNearbyDate] <<<", props)

      return this.getYearDates(props).sort((yd_x, yd_y) => {
         let x = yd_x.split(".").reverse().join(""),
             y = yd_y.split(".").reverse().join("")

         return x < y && 1 || -1
      }).reduce((res, yearDate) => {
         let msEventDate = yeardateToMs(yearDate, props.msDate)

         console.debug("[calculateNearbyDate] **", res, yearDate, msEventDate, new Date(msEventDate), "/", props.msDate, msEventDate - props.msDate)

         return msEventDate >= props.msDate &&
            (!res || yeardateToMs(res, props.msDate) > msEventDate) &&
            yearDate || res
      })
   }

   static getYearDates(props) {
      return props.events.flatMap(e => {
         return e.memoes.map(m => { return m.yd_parsed })
      }).uniq()
   }

   static sortEvents(props) {
      // TODO remove in favor of sort by flexdate
      return props.events.sort((x, y) => {
         let xi = this.staticKindCodes.indexOf(x.kind_code) || this.staticKindCodes.length + 1,
             yi = this.staticKindCodes.indexOf(y.kind_code) || this.staticKindCodes.
length + 1

         if (xi < yi) {
            return -1
         } else if (xi > yi) {
            return 1
         }
         return 0
      }).flat()
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
   isNearbyDateFor(e) {
      return e.memoes.map(m => { return m.yd_parsed }).uniq().includes(this.state.nearbyDate)
   }

   mapEventSpans(func) {
      return this.props.events.map((e) => {
         return func(e) || null
      }).filter((e) => { return e })
   }

   render() {
      console.log("[render] * props", this.props, "state:", this.state)

      return (
         <div
            className='row'
            id='events-list'>
            <ul
               key='events-list'
               ref={e => this.$collapsible = e}
               className='collapsible collection'
               data-collapsible='expandable' >
               {this.mapEventSpans((event) =>
                  <EventSpan
                     key={'event-' + event.id}
                     active={this.isNearbyDateFor(event)}
                     defaultCalendarySlug={this.props.defaultCalendarySlug}
                     describedMemoIds={this.props.describedMemoIds}
                     happenedAt={event.happened_at}
                     kindName={event.kind_name}
                     place={event.place}
                     yearDate={event.yd_parsed}
                     memoes={event.memoes}
                     titles={event.titles}
                     cantoes={event.cantoes} />)}</ul></div>)}}

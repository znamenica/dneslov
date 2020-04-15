import { Component } from 'react'

import EventSpan from 'EventSpan'
import { yeardateToMs } from 'support'

export default class EventSpans extends Component {
   static defaultProps = {
      msDate: null,
      events: [],
   }

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return({
            nearbyDate: EventSpans.calculateNearbyDate(props),
            prevProps: props
         })
      } else {
         return null
      }
   }

   static calculateNearbyDate(props) {
      console.debug("[calculateNearbyDate] <<<", props)

      return Array.from(props.events).reverse().reduce((res, e) => {
         let msEventDate = yeardateToMs(e.yeardate, props.msDate)
         console.debug("[calculateNearbyDate] **", res, e.yeardate, msEventDate, new Date(msEventDate), "/", props.msDate, msEventDate - props.msDate)

         return msEventDate >= props.msDate &&
               (!res || yeardateToMs(res, props.msDate) > msEventDate) &&
               e.yeardate || res
      }, null)
   }

   // system
   state = {}

   componentDidMount() {
      this.collapsible = M.Collapsible.init(this.$collapsible, {})
   }

   componentWillUnmount() {
      this.collapsible.destroy()
   }

   isNearbyDateFor(e) {
      return e.yeardate && e.yeardate == this.state.nearbyDate
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
                     happened_at={event.happened_at}
                     kind_name={event.kind_name}
                     place={event.place}
                     yeardate={event.yeardate}
                     title={event.title}
                     description={event.description}
                     troparion={event.troparion}
                     kontakion={event.kontakion} />)}</ul></div>)}}

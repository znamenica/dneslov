import { Component } from 'react'

import EventSpan from 'EventSpan'

export default class EventSpans extends Component {
   static defaultProps = {
      events: [],
   }

   // system
   componentDidMount() {
      this.collapsible = M.Collapsible.init(this.$collapsible, {})
   }

   componentWillUnmount() {
      this.collapsible.destroy()
   }

   render() {
      return (
         <div className='row'
            id='events-list'>
            <ul
               key='events-list'
               ref={e => this.$collapsible = e}
               className='collapsible collection'
               data-collapsible='expandable' >
               {this.props.events.map((event) =>
                  <EventSpan
                     key={'event-' + event.id}
                     happened_at={event.happened_at}
                     kind_name={event.kind_name}
                     place={event.place}
                     description={event.description}
                     troparion={event.troparion}
                     kontakion={event.kontakion} />)}</ul></div>)}}

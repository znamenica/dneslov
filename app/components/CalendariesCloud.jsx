import { Component } from 'react'

import Chip from 'Chip'

export default class CalendariesCloud extends Component {
   static defaultProps = {
      calendaries: [],
      calendaries_used: [],
      onAct: null,
   }

   onChipAct(data) {
      this.props.onAct(data)
   }

   isCalendaryUsed(calendary) {
      return this.props.calendaries_used &&
         this.props.calendaries_used.reduce((used, c) => {
         return used || c && (c.slug == calendary.slug)
      }, null)
   }

   actionFor(calendary) {
      return this.isCalendaryUsed(calendary) ? null : 'add'
   }

   render() {
      console.log("[render] > props:", this.props)

      return (
         <div className='row centering'
            id='calendaries-cloud'>
            {this.props.calendaries.map((calendary) =>
               <Chip
                  key={calendary.slug}
                  data={{slug: calendary.slug}}
                  className='calendary'
                  text={calendary.title}
                  alt={calendary.description}
                  color={calendary.color}
                  url={calendary.url}
                  action={this.actionFor(calendary)}
                  onAct={this.onChipAct.bind(this)} />)}</div>)}}

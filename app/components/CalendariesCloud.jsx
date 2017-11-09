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
      return this.props.calendaries_used.reduce((used, slug) => {
         return used || (slug == calendary.slug)
      }, false)
   }

   actionFor(calendary) {
      return this.isCalendaryUsed(calendary) ? null : 'add'
   }

   render() {
      console.log(this.props)

      return (
         <div className='row centering'>
            {this.props.calendaries.map((calendary) =>
               <Chip
                  key={calendary.slug}
                  data={{slug: calendary.slug}}
                  className='calendary'
                  text={calendary.name}
                  color={calendary.color}
                  url={calendary.url}
                  action={this.actionFor(calendary)}
                  onAct={this.onChipAct.bind(this)} />)}</div>)}}

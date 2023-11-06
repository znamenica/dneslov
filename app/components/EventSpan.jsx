import { Component } from 'react'

import Chip from 'Chip'
import Name from 'Name'
import Markdown from 'Markdown'
import { getUrlsFrom } from 'support'

export default class EventSpan extends Component {
   static defaultProps = {
      happenedAt: null,
      kindName: null,
      place: {},
      titles: [],
      defaultCalendarySlug: null,
      specifiedCalendarySlug: null,
      date: '',
      id: null,
      slug: null,

      active: null,
      wrapperYearDateClass: "",
   }

   static types = ["Subject", "Event"]

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return {
            prevProps: props,
            title: EventSpan.getTitle(props),
         }
      }

      return null
   }

   static getTitle(props) {
      let titles = props.titles.sortByArray(this.types, "type")

      return titles[0].text
   }

   // system
   state = {}

   // custom
   classNameForItem() {
      return 'collection-item event ' + (this.props.active && "active" || "")
   }

   classNameForYearDate() {
      return 'year-date right ' + (this.props.active && "nearby" || "")
   }

   render() {
      console.log("[render] * this.props:", this.props, "this.state:", this.state)

      return (
         <li className={this.classNameForItem()}>
            <div
               className='collapsible-header'
               key={'event-span-' + this.props.date + '-' + this.props.happenedAt}>
               <Name
                  short_name={this.state.title}
                  url={getUrlsFrom(this.props.specifiedCalendarySlug, this.props.slug, this.props.id)[0]} />
               <Chip
                  className='happened-at'
                  text={this.props.happenedAt} />
               {this.props.place?.name &&
                  <Chip
                     className='place'
                     text={this.props.place.name} />}
               {this.props.date && <Chip
                  className={this.classNameForYearDate()}
                  text={this.props.date} />}</div>
            <div
               className='collapsible-body' /></li>)
   }
}

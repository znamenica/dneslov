import { Component } from 'react'
import PropTypes from 'prop-types'

import Carousel from 'Carousel'
import EventSpans from 'EventSpans'
import Chip from 'Chip'
import Name from 'Name'
import Description from 'Description'

export default class Memory extends Component {
   static defaultProps = {
      slug: null,
      short_name: null,
      titles: [],
      descriptions: [],
      names: [],
      councils: [],
      beings: [],
      wikies: [],
      paterics: [],
      memos: [],
      icons: [],
      events: [],
      troparion: null,
      kontakion: null,
      selected_calendaries: [],
   }

   state = {}

   // system
   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         let cal = Memory.calculateDefaultCalendary(props)
         return {
            calendary_slug: cal,
            title: Memory.getTitle(props, cal),
            prevProps: props
         }
      }

      return null
   }

   mapGroupedMemoesByDate(func) {
      let hash = this.props.memos.reduce((hash, memo) => {
         if (!hash[memo.date]) {
            hash[memo.date] = []
         }

         hash[memo.date] = hash[memo.date].concat({
            event: memo.event,
            calendary: memo.calendary,
            url: memo.url,
         })

         return hash
      }, {})

      console.log('HASH', hash)

      return Object.entries(hash).map((value) => {
         console.log('KV', value[0], value[1])
         return func(value[0], value[1])
      })
   }

   static calculateDefaultCalendary(props) {
      let parts = window.location.href.split("#"),
          cal = parts[1] && decodeURIComponent(parts[1])

      return cal || props.selected_calendaries &&
         props.selected_calendaries.reduce((cal, calendary_slug) => {
            if (!cal) {
               cal = props.titles.reduce((cal, title) => {
                  if (!cal && title.calendary == calendary_slug) {
                     cal = calendary_slug
                  }

                  return cal
               }, null)
            }

            return cal
         }) || props.default_calendary_slug
   }

   static getTitle(props, cal) {
      let title = props.titles.reduce((title, t) => { return t.calendary == cal && cal || title })

      return title && title.text
   }

   render() {
      console.log("[render] > props", this.props, "state: ", this.state)

      return (
         <div className='row'>
            <div className='col s12'>
               <div className='row'>
                  <div className='col s12'>
                     <Chip
                        color={this.props.order.color}
                        text={this.props.order.slug} />
                     <Name
                        short_name={this.state.title}
                        default_name_in_calendary={this.state.title}
                        names={this.props.names} />
                     <Chip
                        className='year-date'
                        text={this.props.year} /></div></div></div>
            {false && this.props.councils.length > 0 && //TODO
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12'>
                        {this.props.councils.map((council) =>
                           <Chip
                              key={council.slug}
                              url={council.url}
                              text={council.slug} />)}</div></div></div>}
            {this.props.beings.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Бытие</div>
                     <div className='col s12'>
                        {this.props.beings.map((being) =>
                           <Chip
                              key={being.id}
                              url={being.url}
                              text={being.text} />)}</div></div></div>}
            {this.props.wikies.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Вики</div>
                     <div className='col s12'>
                        {this.props.wikies.map((wiki) =>
                           <Chip
                              key={wiki.id}
                              url={wiki.url}
                              text={wiki.text} />)}</div></div></div>}
            {this.props.paterics.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Отечник</div>
                     <div className='col s12'>
                        {this.props.paterics.map((pateric) =>
                           <Chip
                              key={pateric.id}
                              url={pateric.url}
                              text={pateric.text} />)}</div></div></div>}
            {this.props.descriptions.length > 0 &&
               <Description
                  descriptions={this.props.descriptions}
                  calendary_slug={this.state.calendary_slug} />}
            {this.props.memos.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Даты</div>
                     <div className='col s12'>
                        <div
                           className='dates'>
                           {this.mapGroupedMemoesByDate((memo, events) =>
                              <div
                                 className='date fixed-action-btn'>
                                    <Chip
                                       key={'memo-' + memo}
                                       text={memo} />
                                 <ul>
                                    {events.map((event) =>
                                       <li>
                                          <Chip
                                             key={'event-' + event.event}>
                                             <span>
                                                {event.event}</span>
                                             <span>
                                                -</span>
                                             <span>
                                                {event.url &&
                                                   <a
                                                      href={event.url}>
                                                      {event.calendary}</a>}
                                                {!event.url && event.calendary}</span></Chip></li>)}</ul></div>)}</div></div></div></div>}
            {this.props.icons.length > 0 &&
               <Carousel
                  images={this.props.icons} />}
            {this.props.troparion &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        {this.props.troparion.title}</div>
                     <div className='col s12'>
                        {this.props.troparion.text}</div></div></div>}
            {this.props.kontakion &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        {this.props.kontakion.title}</div>
                     <div className='col s12'>
                        {this.props.kontakion.text}</div></div></div>}
            {this.props.events.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        События</div>
                     <div className='col s12'>
                        <EventSpans
                           events={this.props.events} /></div></div></div>}</div>)}}

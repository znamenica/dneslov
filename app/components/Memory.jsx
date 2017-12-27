import { Component } from 'react'
import PropTypes from 'prop-types'

import Carousel from 'Carousel'
import EventSpans from 'EventSpans'
import Chip from 'Chip'
import Name from 'Name'

export default class Memory extends Component {
   static defaultProps = {
      slug: null,
      short_name: null,
      description: null,
      names: [],
      councils: [],
      beings: [],
      wikies: [],
      paterics: [],
      calendaries: [],
      icons: [],
      events: [],
      troparion: null,
      kontakion: null,
   }

   render() {
      console.log("MEMORY", this.props)

      return (
         <div className='row'>
            <div className='col s12'>
               <div className='row'>
                  <div className='col s12'>
                     <Chip
                        color={this.props.order.color}
                        text={this.props.order.slug} />
                     <Name
                        short_name={this.props.short_name}
                        names={this.props.names} />
                     <Chip
                        className='year-date'
                        text={this.props.year} /></div></div></div>
            {this.props.councils.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12'>
                        {this.props.councils.map((council) =>
                           <Chip
                              key={council.slug}
                              url={council.url}
                              text={council.slug} />)}</div></div></div>}
            {this.props.description &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Описание</div>
                     <div className='col s12'>
                        {this.props.description}</div></div></div>}
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
            {this.props.calendaries.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Календари</div>
                     <div className='col s12'>
                        {this.props.calendaries.map((calendary) =>
                           <Chip
                              key={calendary.slug} >
                              <span className='name'>
                                 <a
                                    href={calendary.url}
                                    target='_blank'>
                                       {calendary.name}</a></span>
                              {calendary.dates.map((date) =>
                                 <span
                                    className='date'
                                    key={date.date} >
                                    {date.date}</span>)}</Chip>)}</div></div></div>}
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

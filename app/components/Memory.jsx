import { Component } from 'react'
import PropTypes from 'prop-types'

import IconLoryModal from 'IconLoryModal'
import Chip from 'Chip'

export default class Memory extends Component {
   static defaultProps = {
      memory: {
         slug: null,
         short_name: null,
         description: null,
         councils: [],
         beings: [],
         wikies: [],
         paterics: [],
         calendaries: [],
         icons: [],
         troparion: null,
         kontakion: null,
      }
   }

   componentLoaded() {
      this.$$carousel.carousel()
   }

   componentDidMount() {
      this.$$carousel = $(this.$carousel)
      window.addEventListener('load', this.componentLoaded.bind(this))
      Array.from(this.$carousel.querySelectorAll('img')).forEach((img) => {
         img.addEventListener('click', this.onIconClick.bind(this))
      })
   }

   componentWillUnmount() {
      document.removeEventListener('load', this.componentLoaded.bind(this))
      Array.from(this.$carousel.querySelectorAll('img')).forEach((img) => {
         img.removeEventListener('click', this.onIconClick.bind(this))
      })
   }

   onIconClick(e) {
      if (e.target.className.match(/\bactive\b/)) {
         e.stopPropagation()
         let index = e.target.getAttribute('data-index')
         this.lory.openModal(index)
      }
   }

   onLorySlideFrom(e) {
      let index = parseInt(e.detail.nextSlide)

      if (index >= 0) {
         this.$$carousel.carousel('set', e.detail.nextSlide);
      }
   }

   render() {
      return (
         <div className='row'>
            <div className='col s12'>
               <div className='row'>
                  <div className='col s12'>
                     <Chip
                        color={this.props.memory.order.color}
                        text={this.props.memory.order.slug} />
                     <span>
                        <b>{this.props.memory.short_name}</b></span>
                     <Chip
                        className='year-date'
                        text={this.props.memory.year} /></div></div></div>
            {this.props.memory.councils.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12'>
                        {this.props.memory.councils.map((council) =>
                           <Chip
                              key={council.slug}
                              url={council.url}
                              text={council.slug} />)}</div></div></div>}
            {this.props.memory.description &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Описание</div>
                     <div className='col s12'>
                        {this.props.memory.description}</div></div></div>}
            {this.props.memory.beings.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Бытие</div>
                     <div className='col s12'>
                        {this.props.memory.beings.map((being) =>
                           <Chip
                              key={being.id}
                              url={being.url}
                              text={being.text} />)}</div></div></div>}
            {this.props.memory.wikies.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Вики</div>
                     <div className='col s12'>
                        {this.props.memory.wikies.map((wiki) =>
                           <Chip
                              key={wiki.id}
                              url={wiki.url}
                              text={wiki.text} />)}</div></div></div>}
            {this.props.memory.paterics.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Отечник</div>
                     <div className='col s12'>
                        {this.props.memory.paterics.map((pateric) =>
                           <Chip
                              key={pateric.id}
                              url={pateric.url}
                              text={pateric.text} />)}</div></div></div>}
            {this.props.memory.calendaries.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Календари</div>
                     <div className='col s12'>
                        {this.props.memory.calendaries.map((calendary) =>
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
            {this.props.memory.icons.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12'>
                        <div
                           className='carousel compact'
                           ref={e => this.$carousel = e} >
                           {this.props.memory.icons.map((icon) =>
                              <img
                                 key={icon.id}
                                 className='carousel-item'
                                 alt={icon.description}
                                 src={icon.url}
                                 data-index={icon.id} />)}</div></div></div></div>}
            {this.props.memory.troparion &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        {this.props.memory.troparion.title}</div>
                     <div className='col s12'>
                        {this.props.memory.troparion.text}</div></div></div>}
            {this.props.memory.kontakion &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        {this.props.memory.kontakion.title}</div>
                     <div className='col s12'>
                        {this.props.memory.kontakion.text}</div></div></div>}
            {this.props.memory.icons.length > 0 &&
               <IconLoryModal
                  key='lory'
                  ref={e => this.lory = e}
                  onLorySlideFrom={this.onLorySlideFrom.bind(this)}
                  links={this.props.memory.icons} />}</div>)}}

import { Component } from 'react'

import Chip from 'Chip'
import Name from 'Name'
import Markdown from 'Markdown'

export default class MemorySpan extends Component {
   static defaultProps = {
      slug: null,
      default_calendary_slug: null,
      thumb_url: null,
      happened_at: null,
      orders: {},
      description: null,
      title: null,
      add_date: null,
      year_date: null,
      bind_kind_code: null,
      calendary_slug: null,
      event_title: null,
      onLoadRequest: null,
   }

   state = {
      thumb_url: this.props.thumb_url
   }

   // system
   constructor(props) {
      super(props)

      this.onAvatarClick = this.onAvatarClick.bind(this)
      this.onSpanHeaderClick = this.onSpanHeaderClick.bind(this)
   }

   componentDidMount() {
      this.$avatar.addEventListener('click', this.onAvatarClick)
      this.$header.addEventListener('click', this.onSpanHeaderClick)
   }

   componentWillUnmount() {
      this.$avatar.removeEventListener('click', this.onAvatarClick)
      this.$header.removeEventListener('click', this.onSpanHeaderClick)
   }

   // events
   onAvatarClick(e) {
      e.stopPropagation()
      e.preventDefault()
      this.props.onLoadRequest(this.props.slug)
   }

   onSpanBodyClick(e) {
      this.props.onLoadRequest(this.props.slug)
   }

   onSpanHeaderClick(e) {
      if (!this.props.description) {
         e.preventDefault()
         e.stopPropagation()
      }
   }

   onLoadImageError() {
      console.warn("[onLoadImageError] ** image load error")
      this.setState({ thumb_url: null })
   }

   // props
   hasNoImage() {
      return !this.state.thumb_url
   }

   hasImage() {
      return !this.hasNoImage()
   }

   linkToMemory() {
      return "/" + this.props.slug
   }

   render() {
      console.log("[render] > props:", this.props, "state:", this.state)

      return (
         <li
            className='collection-item avatar memory'>
            <div
               className='collapsible-header'
               key={'header-' + this.props.slug}
               ref={e => this.$header = e} >
               <a
                  ref={e => this.$avatar = e}
                  key='avatar'
                  href={this.linkToMemory()} >
                  {this.hasImage() &&
                     <img
                        className='circle z-depth-1'
                        onError={this.onLoadImageError.bind(this)}
                        src={this.state.thumb_url} />}
                  {this.hasNoImage() &&
                     <i className='material-icons circle terracota z-depth-1'>perm_identity</i>}</a>
               <Chip
                  color={'gray'}
                  text={Object.values(this.props.orders)[0]} />
               <span
                  className='name short'>
                  {this.props.title}</span>
               <Chip
                  className='year-date'
                  text={this.props.happened_at} /></div>
            {this.props.description &&
               <div
                  className='collapsible-body description'
                  onClick={this.onSpanBodyClick.bind(this)} >
                  <Markdown source={this.props.description} /></div>}</li>)
   }
}

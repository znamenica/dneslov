import { Component } from 'react'
import ReactMarkdown from 'react-markdown'

import Chip from 'Chip'
import Name from 'Name'

export default class MemorySpan extends Component {
   static defaultProps = {
      slug: null,
      short_name: null,
      default_name_in_calendary: null,
      default_calendary_slug: null,
      url: null,
      icon_url: null,
      year: null,
      order: null,
      description: null,
      names: [],
      onLoadRequest: null,
   }

   state = {
      icon_url: this.props.icon_url
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
      this.props.onLoadRequest(this.props.slug)
      e.stopPropagation()
      e.preventDefault()
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
      this.setState({ icon_url: null })
   }

   // props
   hasNoImage() {
      return !this.state.icon_url
   }

   hasImage() {
      return !this.hasNoImage()
   }

   linkToMemory() {
      return this.props.url
   }

   render() {
      console.log("[render] > props:", this.props, "state:", this.state)

      return (
         <li className='collection-item avatar memory'>
            <div
               className='collapsible-header'
               ref={e => this.$header = e} >
               <a
                  ref={e => this.$avatar = e}
                  key='avatar'
                  href={this.linkToMemory()} >
                  {this.hasImage() &&
                     <img
                        className='circle z-depth-1'
                        onError={this.onLoadImageError.bind(this)}
                        src={this.state.icon_url} />}
                  {this.hasNoImage() &&
                     <i className='material-icons circle terracota z-depth-1'>perm_identity</i>}</a>
               <Chip
                  color={this.props.order.color}
                  text={this.props.order.slug} />
               <Name
                  short_name={this.props.short_name}
                  default_name_in_calendary={this.props.default_name_in_calendary}
                  names={this.props.names} />
               <Chip
                  className='year-date'
                  text={this.props.year} /></div>
            {this.props.description &&
               <div
                  className='collapsible-body description'
                  onClick={this.onSpanBodyClick.bind(this)} >
                  <ReactMarkdown source={this.props.description} /></div>}</li>)}}

import { Component } from 'react'
import ReactMarkdown from 'react-markdown'

import Chip from 'Chip'
import Name from 'Name'

export default class MemorySpan extends Component {
   static defaultProps = {
      slug: null,
      short_name: null,
      default_calendary_name: null,
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
   componentDidMount() {
      this.$avatar.addEventListener('click', this.onAvatarClick.bind(this))
   }

   componentWillUnmount() {
      this.$avatar.removeEventListener('click', this.onAvatarClick.bind(this))
   }

   // events
   onAvatarClick(e) {
      this.props.onLoadRequest(this.props.slug)
      e.stopPropagation()
      e.preventDefault()
   }

   onSpanClick(e) {
      this.props.onLoadRequest(this.props.slug)
   }

   onLoadImageError() {
      console.log("ERROR")
      this.setState({ icon_url: null })
   }

   // props
   hasNoImage() {
      return !this.state.icon_url
   }

   hasImage() {
      return !this.hasNoImage()
   }

   render() {
      console.log("PROPS", this.props)
      console.log("STATE", this.state)

      return (
         <li className='collection-item avatar memory'>
            <div className='collapsible-header'>
               <a
                  ref={e => this.$avatar = e}
                  key='avatar'
                  href={this.props.url} >
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
                  default_calendary_name={this.props.default_calendary_name}
                  names={this.props.names} />
               <Chip
                  className='year-date'
                  text={this.props.year} /></div>
            <div className='collapsible-body description'
               onClick={this.onSpanClick.bind(this)} >
               {this.props.description &&
                  <ReactMarkdown source={this.props.description} />}</div></li>)}}

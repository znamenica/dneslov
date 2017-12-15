import { Component } from 'react'
import Chip from 'Chip'

export default class MemorySpan extends Component {
   static defaultProps = {
      slug: null,
      short_name: null,
      url: null,
      icon_url: null,
      year: null,
      order: null,
      description: null,
      onLoadRequest: null,
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

   // props
   hasImage() {
      return !!this.props.icon_url
   }

   render() {
      console.log("PROPS", this.props)

      return (
         <li className='collection-item avatar memory View_child'>
            <div className='collapsible-header'>
               <a
                  ref={e => this.$avatar = e}
                  key='avatar'
                  href={this.props.url} >
                  {this.hasImage() &&
                     <img className='circle z-depth-1' src={this.props.icon_url}></img>}
                  {!this.hasImage() &&
                     <i className='material-icons circle terracota z-depth-1'>perm_identity</i>}</a>
               <Chip
                  color={this.props.order.color}
                  text={this.props.order.slug} />
               <span>
                  {this.props.short_name}</span>
               <Chip
                  className='year-date'
                  text={this.props.year} /></div>
            {this.props.description &&
               <div className='collapsible-body'
                  onClick={this.onSpanClick.bind(this)} >
                  <span>{this.props.description}</span></div>}</li>)}}

import { Component } from 'react'
import Chip from 'Chip'

export default class MemorySpan extends Component {
   static defaultProps = {
      memory: {
         short_name: null,
         url: null,
         icon_url: null,
         year: null,
         description: null,
      }
   }

   renderImage = () => {
      let img

      if (this.props.memory.icon_url) {
         img = <img className='circle z-depth-1' src={this.props.memory.icon_url}></img>
      } else {
         img = <i className='material-icons circle terracota z-depth-1'>perm_identity</i>
      }

      return img
   }

   onAvatarClick = (e) => {
      e.stopPropagation()
   }

   render = () => {
      return (
         <li className='collection-item avatar memory View_child'>
            <div className='collapsible-header'>
               <a
                  href={this.props.memory.url}
                  target='_blank'
                  onClick={this.onAvatarClick} >
                  {this.renderImage()}</a>
               <Chip
                  color={this.props.memory.order.color}
                  text={this.props.memory.order.slug} />
               <span>
                  {this.props.memory.short_name}</span>
               <Chip
                  className='year-date'
                  text={this.props.memory.year} /></div>
            {this.props.memory.description &&
               <div className='collapsible-body'>
                  <span>{this.props.memory.description}</span></div>}</li>)}}
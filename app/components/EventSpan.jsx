import { Component } from 'react'
import Chip from 'Chip'

export default class EventSpan extends Component {
   static defaultProps = {
      happened_at: null,
      kind_name: null,
      place: null,
      description: null,
      troparion: null,
      kontakion: null,
   }

   hasData() {
      return this.props.description || this.props.troparion || this.props.kontakion
   }

   render() {
      console.log("Event span props", this.props)

      return (
         <li className='collection-item event'>
            <div className='collapsible-header'>
               <span>
                  {this.props.kind_name}</span>
               <Chip
                  className='year-date'
                  text={this.props.happened_at} />
               {this.props.place &&
                  <Chip
                     className='place'
                     text={this.props.place} />}</div>
            {this.hasData() &&
               <div className='collapsible-body'>
                  {this.props.description &&
                     <div className='col s12'>
                        <div className='row'>
                           <div className='col s12 title'>
                              Описание</div>
                           <div className='col s12'>
                              {this.props.description}</div></div></div>}
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
                              {this.props.kontakion.text}</div></div></div>}</div>}</li>)}}

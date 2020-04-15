import { Component } from 'react'
import Chip from 'Chip'

export default class EventSpan extends Component {
   static defaultProps = {
      date: null,
      happened_at: null,
      kind_name: null,
      title: null,
      yeardate: null,
      place: null,
      description: null,
      troparion: null,
      kontakion: null,
      wrapperYearDateClass: "",
   }

   hasData() {
      return this.props.description || this.props.troparion || this.props.kontakion
   }

   classNameForItem() {
      return 'collection-item event ' + (this.props.active && "active" || "")
   }

   classNameForYearDate() {
      return 'year-date ' + (this.props.active && "nearby" || "")
   }

   onSpanHeaderClick(e) {
      e.preventDefault()
      e.stopPropagation()
   }

   render() {
      console.log("[render] * props", this.props)

      return (
         <li className={this.classNameForItem()}>
            <div
               className='collapsible-header'
               onClick={this.onSpanHeaderClick.bind(this)} >
               {this.props.yeardate && <Chip
                  className={this.classNameForYearDate()}
                  text={this.props.yeardate} />}
               <span>
                  {this.props.title || this.props.kind_name}</span>
               <Chip
                  className='year-date'
                  text={this.props.happened_at} />
               {this.props.place &&
                  <Chip
                     className='place'
                     text={this.props.place} />}</div>
            {this.hasData() &&
               <div className='collapsible-body'>
                  <div className="container">
                  {this.props.description &&
                        <div className='row'>
                           <div className='col s12 title'>
                              Описание</div>
                           <div className='col s12'>
                              {this.props.description}</div></div>}
                  {this.props.troparion &&
                        <div className='row'>
                           <div className='col s12 title'>
                              {this.props.troparion.title}</div>
                           <div className='col s12'>
                              {this.props.troparion.text}</div></div>}
                  {this.props.kontakion &&
                        <div className='row'>
                           <div className='col s12 title'>
                              {this.props.kontakion.title}</div>
                           <div className='col s12'>
                              {this.props.kontakion.text}</div></div>}</div></div>}</li>)
   }
}

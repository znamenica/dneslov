import { Component } from 'react'
import PropTypes from 'prop-types'
import Chip from 'Chip'

export default class SearchConditions extends Component {
   static defaultProps = {
      date: null,
      calendaries: null,
      query: "",
      onAct: null,
   }

   static propTypes = {
      date: PropTypes.string,
      calendaries: PropTypes.array,
      query: PropTypes.array,
      onAct: PropTypes.func.isRequired,
   }

   onChipAct(data) {
      this.props.onAct(data)
   }

   query() {
      let tokens = this.props.query.split(/\//),
          filtered = tokens.filter((t) => { return ! t.match(/^[\s+]*$/) })

      return filtered.map(t => { return t.trim().replace(/ /g, "+") })
   }

   render() {
      console.log("[render] * props", this.props)

      return (
         <div className='row'>
            <div
               className='col xl12 l12 m12 s12'
               id='search-conditions' >
               <Chip
                  className='white'
                  text='Выборка:' />
               {this.props.date && <Chip
                  className='date'
                  data={{date: this.props.date}}
                  text={this.props.date}
                  action='remove'
                  onAct={this.onChipAct.bind(this)} />}
               {this.props.calendaries &&
                this.props.calendaries.map((calendary) =>
                  <Chip
                     key={calendary.slug}
                     data={{slug: calendary.slug}}
                     className='calendary'
                     text={calendary.title}
                     action='remove'
                     onAct={this.onChipAct.bind(this)} />)}
               {this.query().map((token, index) =>
                  <Chip
                     key={index}
                     data={{token: token}}
                     className='token'
                     text={token}
                     action='remove'
                     onAct={this.onChipAct.bind(this)} />)}</div></div>)}}

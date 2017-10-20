import { Component } from 'react'
import PropTypes from 'prop-types'
import Chip from 'Chip'

export default class SearchConditions extends Component {
   static defaultProps = {
      date: null,
      calendaries: [],
      query: [],
      onAct: null,
   }

   static propTypes = {
      date: PropTypes.string,
      calendaries: PropTypes.array,
      query: PropTypes.array,
      onAct: PropTypes.func.isRequired,
   }

   onChipAct = (data) => {
      this.props.onAct(data)
   }

   renderDate = () => {
      let date

      if (this.props.date) {
         date = <Chip
                  className='date'
                  data={{date: this.props.date}}
                  text={this.props.date}
                  action='remove'
                  onAct={this.onChipAct} />
      }

      return date
   }
   render = () => {
      console.log(this.props)

      return (
         <div className='row'>
            <div className='input-field col s12'>
               <Chip
                  className='white'
                  text='Выборка:' />
               {this.renderDate()}
               {this.props.calendaries.map((calendary) =>
                  <Chip
                     key={calendary.slug}
                     data={{slug: calendary.slug}}
                     className='calendary'
                     text={calendary.name}
                     action='remove'
                     onAct={this.onChipAct} />)}
               {this.props.query.map((token, index) =>
                  <Chip
                     key={index}
                     data={{token: token}}
                     className='token'
                     text={token}
                     action='remove'
                     onAct={this.onChipAct} />)}
            </div>
         </div>)}}

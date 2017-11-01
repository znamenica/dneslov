import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorSpan extends Component {
   static defaultProps = {
      text: '',
   }

   static propTypes = {
      text: PropTypes.string,
   }

   state = {
      text: this.props.text || ''
   }

   render() {
      return (
         <div className='row'>
            <div className="col error">
               {this.state.text}</div></div>)}}

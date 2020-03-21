import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorSpan extends Component {
   static defaultProps = {
      error: '',
   }

   static propTypes = {
      error: PropTypes.string,
   }

   render() {
      return (
         <div
            className={'error ' + this.props.appendClassName }>
            {this.props.error}</div>)}}

import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorSpan extends Component {
   static defaultProps = {
      error: '',
   }

   static propTypes = {
      error: PropTypes.string,
   }

   state = {
      error: this.props.error || ''
   }

   componentWillReceiveProps(nextProps) {
      this.setState({error: nextProps.error || ''})
   }

   render() {
      return (
         <div className="error">
            {this.state.error}</div>)}}

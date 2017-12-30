import { Component } from 'react'
import PropTypes from 'prop-types'

export default class SubmitButton extends Component {
   static defaultProps = {
      title: '',
      valid: false,
   }

   static propTypes = {
      title: PropTypes.string.isRequired,
      valid: PropTypes.bool,
   }

   state = {
      valid: this.props.valid
   }

   componentWillReceiveProps(nextProps) {
      this.state.valid = nextProps.valid
   }

   render() {
      console.log(this.state)

      return (
         <button
            type='submit'
            className='btn btn-primary'
            disabled={! this.state.valid} >
            <span>
               {this.props.title}</span></button>)}}

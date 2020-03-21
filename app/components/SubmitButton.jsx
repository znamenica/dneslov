import { Component } from 'react'
import PropTypes from 'prop-types'

export default class SubmitButton extends Component {
   static defaultProps = {
      title: '',
      active: false,
   }

   static propTypes = {
      title: PropTypes.string.isRequired,
      active: PropTypes.bool,
   }

   state = { valid: this.props.valid }

   componentDidMount() {
      document.addEventListener('dneslov-form-valid', this.onFormValidChanged.bind(this))
   }

   componentWillUnmount() {
      document.removeEventListener('dneslov-form-valid', this.onFormValidChanged.bind(this))
   }

   onFormValidChanged(e) {
      this.setState({ active: e.detail.valid })
   }

   onClick() {
      let ce = new CustomEvent('dneslov-record-submit', {})

      document.dispatchEvent(ce)
   }

   render() {
      return (
         <button
            type='submit'
            className='btn btn-primary'
            disabled={! this.state.active}
            onClick={this.onClick.bind(this)} >
            <span>
               {this.props.title}</span></button>)}}

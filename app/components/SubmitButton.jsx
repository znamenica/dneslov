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

   // system
   constructor(props) {
      super(props)

      this.onFormValidChanged = this.onFormValidChanged.bind(this)
   }

   componentDidMount() {
      document.addEventListener('dneslov-form-valid', this.onFormValidChanged)
   }

   componentWillUnmount() {
      document.removeEventListener('dneslov-form-valid', this.onFormValidChanged)
   }

   // events
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

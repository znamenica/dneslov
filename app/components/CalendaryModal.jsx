import { Component } from 'react'
import PropTypes from 'prop-types'

import CalendaryForm from 'CalendaryForm'
import SubmitButton from 'SubmitButton'

export default class CalendaryModal extends Component {
   static defaultProps = {
      licit: false,
      slug: null,
      language_code: '',
      alphabeth_code: '',
      author_name: '',
      date: '',
      council: '',
      names: [],
      descriptions: [],
      wikies: [],
      links: [],
      open: false,
   }

   static propTypes = {
      slug: PropTypes.string,
      licit: PropTypes.boolean,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.object,
   }

   getCleanState() {
      return {
         licit: false,
         slug: null,
         language_code: '',
         alphabeth_code: '',
         author_name: '',
         date: '',
         council: '',
         names: [],
         descriptions: [],
         wikies: [],
         links: [],
         open: false
      }
   }

   componentDidMount() {
      this.modal = $(this.$modal).modal()
   }

   componentDidUpdate() {
      if (this.props.open) {
         this.modal.modal('open')
      }
   }

   onSubmitSuccess(data) {
      this.state = this.getCleanState()
      this.modal.modal('close')
   }

   onSubmit(e) {
      let data = { calendary: this.processedHash(this.$form.query) }

      e.stopPropagation()
      e.preventDefault()
      $.post('', data, this.onSubmitSuccess.bind(this), 'JSON')
   }

   processedHash(hash) {
      let result = {}

      Object.entries(hash).forEach(([key, value]) => {
         if (value instanceof Object) {
            if (Object.keys(value)[0].match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) {
               result[key] = Object.values(value)
            } else {
               result[key] = this.processedHash(value)
            }
         } else {
            result[key] = value
         }
      })

      return result
   }

   onFormUpdate() {
      this.$submit.setState({valid: this.$form.valid})
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div>
            <div className='row'>
               <a
                 className="waves-effect waves-light btn modal-trigger right-align"
                 href="#calendary-form-modal">
                    Новый календарь</a></div>
            <div
               key='calendary-form-modal'
               className='modal modal-fixed-footer z-depth-2'
               id='calendary-form-modal'
               ref={e => this.$modal = e} >
               <form onSubmit={this.onSubmit.bind(this)}>
                  <div className='modal-content'>
                     <CalendaryForm
                        ref={e => this.$form = e}
                        key={'form'}
                        {...this.state}
                        onUpdate={this.onFormUpdate.bind(this)}/></div>
                  <div className="modal-footer">
                     <SubmitButton
                        ref={e => this.$submit = e}
                        title='Создай календарь'
                        valid={false} /></div></form></div></div>)}}

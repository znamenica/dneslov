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
      onUpdateCalendary: null,
      onCloseCalendary: null,
   }

   static propTypes = {
      slug: PropTypes.string,
      licit: PropTypes.boolean,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.object,
      onUpdateCalendary: PropTypes.func.isRequired,
      onCloseCalendary: PropTypes.func.isRequired,
   }

   state = this.getDefaultState()

   componentWillReceiveProps(nextProps) {
      this.setState(this.getDefaultState(nextProps))
   }

   getDefaultState(props = this.props) {
      return {
         id: props.id,
         licit: props.licit,
         slug: props.slug,
         language_code: props.language_code,
         alphabeth_code: props.alphabeth_code,
         author_name: props.author_name,
         date: props.date,
         council: props.council,
         names: props.names,
         descriptions: props.descriptions,
         wikies: props.wikies,
         links: props.links,
      }
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
      this.modal = $(this.$modal).modal({
         complete: this.props.onCloseCalendary.bind(this)
      })
   }

   componentDidUpdate() {
      if (this.props.open) {
         this.modal.modal('open')
      }
   }

   newCalendary() {
      this.setState(this.getCleanState())
   }

   onSubmitSuccess(data) {
      console.log("SUCCESS", data)
      this.props.onUpdateCalendary(data)
      this.modal.modal('close')
   }

   onSubmitError(data) {
      console.log(data)
      // add error//
   }

   onSubmit(e) {
      let settings = {
         data: { calendary: this.$form.query,
                 slug: this.$form.query.slug_attributes.text },
         dataType: 'JSON',
         error: this.onSubmitError.bind(this),
         success: this.onSubmitSuccess.bind(this) }

      if (settings.data.calendary.id) {
         settings.method = 'PUT'
         settings.url = '/calendaries/' + settings.data.slug + '.json'
      } else {
         settings.method = 'POST'
         settings.url = '/calendaries/create.json'
      }

      e.stopPropagation()
      e.preventDefault()

      console.log(settings)
      $.ajax(settings)
   }

   onFormUpdate() {
      this.$submit.setState({valid: this.$form.valid})
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div className='enrighten'>
            <div className='row'>
               <a
                  className="waves-effect waves-light btn modal-trigger"
                  href="#calendary-form-modal"
                  onClick={this.newCalendary.bind(this)} >
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
                        title={this.props.slug && 'Обнови календарь' || 'Создай календарь'}
                        valid={false} /></div></form></div></div>)}}

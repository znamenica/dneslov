import { Component } from 'react'
import PropTypes from 'prop-types'

import CalendaryForm from 'CalendaryForm'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'

export default class CalendaryModal extends Component {
   static defaultProps = {
      licit: false,
      slug: {text: ''},
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
         slug: {text: ''},
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

   onSubmitError(response) {
      let error

      console.log("ERROR", response, this.state, this.$form.query)

      if (response.responseJSON) {
         let errors = []

         Object.entries(response.responseJSON).forEach(([key, value]) => {
            errors.push(value.map((e) => { return key + " " + e }))
         })

         error = errors.join(", ")
      } else {
         error = response.responseText
      }

      this.$error.setState({error: error})
   }

   onSubmit(e) {
      e.stopPropagation()
      e.preventDefault()

      let settings = {
         data: { calendary: this.$form.serializedQuery() },
         dataType: 'JSON',
         error: this.onSubmitError.bind(this),
         success: this.onSubmitSuccess.bind(this),
      }

      if (settings.data.calendary.id) {
         settings.data.slug = settings.data.calendary.slug_attributes.text
         settings.method = 'PUT'
         settings.url = '/calendaries/' + settings.data.slug + '.json'
      } else {
         settings.method = 'POST'
         settings.url = '/calendaries.json'
      }

      console.log("STATE",this.state)
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
                        onUpdate={this.onFormUpdate.bind(this)} /></div>
                  <div className="modal-footer">
                     <div className="row">
                        <div className="col xl9 l8 m7 s6">
                           <ErrorSpan
                              ref={e => this.$error = e}
                              key={'error'} /></div>
                        <div className="col xl3 l4 m5 s6">
                           <SubmitButton
                              ref={e => this.$submit = e}
                              title={this.props.id && 'Обнови календарь' || 'Создай календарь'}
                              valid={false} /></div></div></div></form></div></div>)}}

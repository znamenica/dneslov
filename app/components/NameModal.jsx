import { Component } from 'react'
import PropTypes from 'prop-types'

import NameForm from 'NameForm'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'

export default class NameModal extends Component {
   static defaultProps = {
      id: null,
      text: '',
      language_code: '',
      alphabeth_code: '',
      root_id: 0,
      root: '',
      bind_kind: '',
      bond_to_id: 0,
      bond_to: '',
      open: false,
      onUpdateName: null,
      onCloseName: null,
   }

   static propTypes = {
      onUpdateName: PropTypes.func.isRequired,
      onCloseName: PropTypes.func.isRequired,
   }

   state = this.getDefaultState()

   componentWillReceiveProps(nextProps) {
      if (this.props != nextProps) {
         this.setState(this.getDefaultState(nextProps))
         // clear old error
         this.$error.setState({error: null})
      }
   }

   getDefaultState(props = this.props) {
      console.log(props)
      return {
         id: props.id,
         text: props.text,
         language_code: props.language_code,
         alphabeth_code: props.alphabeth_code,
         root_id: props.root_id,
         root: props.root,
         bind_kind: props.bind_kind,
         bond_to_id: props.bond_to_id,
         bond_to: props.bond_to,
      }
   }

   getCleanState() {
      return {
         id: null,
         text: '',
         language_code: '',
         alphabeth_code: '',
         root_id: 0,
         root: '',
         bind_kind: '',
         bond_to_id: 0,
         bond_to: '',
      }
   }

   componentDidMount() {
      this.modal = $(this.$modal).modal({
         complete: this.props.onCloseName.bind(this)
      })
   }

   componentDidUpdate() {
      this.$submit.setState({valid: this.$form.valid})

      if (this.props.open) {
         this.modal.modal('open')
      }
   }

   newName() {
      this.setState(this.getCleanState())
   }

   onSubmitSuccess(data) {
      console.log("SUCCESS", data)
      this.props.onUpdateName(data)
      this.$error.setState({error: null})
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
         data: { name: this.$form.serializedQuery() },
         dataType: 'JSON',
         error: this.onSubmitError.bind(this),
         success: this.onSubmitSuccess.bind(this),
      }

      if (settings.data.name.id) {
         settings.method = 'PUT'
         settings.url = '/names/' + settings.data.name.id + '.json'
      } else {
         settings.method = 'POST'
         settings.url = '/names.json'
      }

      console.log("STATE",this.state)
      console.log(settings)
      $.ajax(settings)
   }

   onFormUpdate() {
      if (this.$form) {
         console.log(this.$form.valid)
         this.$submit.setState({valid: this.$form.valid})
      }
   }

   render() {
      console.log(this.state)

      return (
         <div className='enrighten'>
            <div className='row'>
               <a
                  className="waves-effect waves-light btn modal-trigger"
                  href="#name-form-modal"
                  onClick={this.newName.bind(this)} >
                     Новое имя</a></div>
            <div
               key='name-form-modal'
               className='form-modal modal modal-fixed-footer z-depth-2'
               id='name-form-modal'
               ref={e => this.$modal = e} >
               <form onSubmit={this.onSubmit.bind(this)}>
                  <div className='modal-content'>
                     <NameForm
                        ref={e => this.$form = e}
                        key='form'
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
                              title={this.props.id && 'Обнови имя' || 'Создай имя'} /></div></div></div></form></div></div>)}}

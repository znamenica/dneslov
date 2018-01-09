import { Component } from 'react'
import PropTypes from 'prop-types'

import MemoForm from 'MemoForm'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'

export default class MemoModal extends Component {
   static defaultProps = {
      id: null,
      year_date: '',
      add_date: '',
      calendary_id: 0,
      calendary: '',
      event_id: 0,
      event: '',
      bind_kind: '',
      bond_to_id: 0,
      bond_to: '',
      memory_id: 0,
      memory: '',
      descriptions: {},
      links: {},
      open: false,
      onUpdateMemo: null,
      onCloseMemo: null,
   }

   static propTypes = {
      onUpdateMemo: PropTypes.func.isRequired,
      onCloseMemo: PropTypes.func.isRequired,
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
         year_date: props.year_date,
         add_date: props.add_date,
         calendary_id: props.calendary_id,
         calendary: props.calendary,
         event_id: props.event_id,
         event: props.event,
         bind_kind: props.bind_kind,
         bond_to_id: props.bond_to_id,
         bond_to: props.bond_to,
         memory_id: props.memory_id,
         memory: props.memory,
         descriptions: props.descriptions,
         links: props.links,
      }
   }

   getCleanState() {
      return {
         id: null,
         year_date: '',
         add_date: '',
         calendary_id: 0,
         calendary: '',
         event_id: 0,
         event: '',
         bind_kind: '',
         bond_to_id: 0,
         bond_to: '',
         memory_id: 0,
         memory: '',
         descriptions: {},
         links: {},
      }
   }

   componentDidMount() {
      this.modal = $(this.$modal).modal({
         complete: this.props.onCloseMemo.bind(this)
      })
   }

   componentDidUpdate() {
      this.$submit.setState({valid: this.$form.valid})

      if (this.props.open) {
         this.modal.modal('open')
      }
   }

   newMemo() {
      this.setState(this.getCleanState())
   }

   onSubmitSuccess(data) {
      console.log("SUCCESS", data)
      this.props.onUpdateMemo(data)
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
         data: { memo: this.$form.serializedQuery() },
         dataType: 'JSON',
         error: this.onSubmitError.bind(this),
         success: this.onSubmitSuccess.bind(this),
      }

      if (settings.data.memo.id) {
         settings.method = 'PUT'
         settings.url = '/memoes/' + settings.data.memo.id + '.json'
      } else {
         settings.method = 'POST'
         settings.url = '/memoes.json'
      }

      console.log("STATE",this.state)
      console.log(settings)
      $.ajax(settings)
   }

   onFormUpdate() {
      // TODO inestigate why `this.$form` became null when form is closed,
      //and why the callback is called
      if (this.$form) {
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
                  href="#memo-form-modal"
                  onClick={this.newMemo.bind(this)} >
                     Новый помин</a></div>
            <div
               key='memo-form-modal'
               className='form-modal modal modal-fixed-footer z-depth-2'
               id='memo-form-modal'
               ref={e => this.$modal = e} >
               <form onSubmit={this.onSubmit.bind(this)}>
                  <div className='modal-content'>
                     <MemoForm
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
                              title={this.props.id && 'Обнови помин' || 'Создай помин'} /></div></div></div></form></div></div>)}}

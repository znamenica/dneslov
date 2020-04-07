import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import SubmitButton from 'SubmitButton'
import Form from 'Form'

export default class Modal extends Component {
   static defaultProps = {
      id: null,
      remoteName: null,
      remoteNames: null,
      meta: null,
      data: null,
      validations: {},
   }

   static propTypes = {
      remoteName: PropTypes.string.isRequired,
      remoteNames: PropTypes.string.isRequired,
      meta: PropTypes.object.isRequired,
      data: PropTypes.object.isRequired,
      validations: PropTypes.object,
   }

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return {
            prevProps: props,
            data: props.data,
         }
      }

      return null
   }

   //system
   state = {}

   constructor() {
      super()

      this.onCloseClick = this.onCloseClick.bind(this)
   }

   componentDidMount() {
      document.addEventListener('dneslov-record-stored', this.onCloseClick)

      this.modal = M.Modal.init(this.$modal, {
         onCloseEnd: this.onModalClosed.bind(this)
      })

      this.componentDidRender()
   }

   componentWillUnmount() {
      document.removeEventListener('dneslov-record-stored', this.onCloseClick)

      this.modal.destroy()
   }

    componentDidUpdate() {
      this.componentDidRender()
   }

   // custom
   componentDidRender() {
      if (this.state.data) {
         this.modal.open()
      }
   }

   onCloseClick() {
      this.setState({ data: null })
   }

   onModalClosed() {
      let ce = new CustomEvent('dneslov-modal-close', {})

      document.dispatchEvent(ce)
   }

   renderModal() {
      return (
         <div className='enrighten'>
            <div
               key='calendary-form-modal'
               className='form-modal modal modal-fixed-footer z-depth-2'
               ref={e => this.$modal = e}
               id='calendary-form-modal'>
               <div className='modal-content'>
                  <Form
                     meta={this.props.meta.form}
                     data={this.state.data} /></div>
               <div className="modal-footer">
                  <div className="row">
                     <div className="col xl12 l12 m12 s12">
                        <div className="row">
                              <button
                                 key='close-button'
                                 type='button'
                                 className='btn close'
                                 onClick={this.onCloseClick.bind(this)} >
                                 {this.props.meta.close}</button>
                              <SubmitButton
                                 title={this.state.data.id &&
                                        this.props.meta.update ||
                                        this.props.meta.create } /></div></div></div></div></div></div>)
   }

   render() {
      console.log("[render] > props", this.props)

      if (this.state.data) {
         return this.renderModal()
      }

      this.modal.close()
      return null
   }
}

import PropTypes from 'prop-types'

import CommonModal from 'CommonModal'
import MemoForm from 'MemoForm'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'

export default class MemoModal extends CommonModal {
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
      titles: {},

      remoteName: 'memo',
      remoteNames: 'memoes',
   }

   static propTypes = {
      id: PropTypes.number,
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
         titles: props.titles,
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
         titles: {},
         links: {},
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
                  onClick={this.newRecord.bind(this)} >
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
                           <div className="row">
                              <div className="col s4">
                                 <button
                                    key='close-button'
                                    type='button'
                                    className='btn close'
                                    onClick={this.onCloseClick.bind(this)} >
                                    Закрой</button></div>
                              <div className="col s8">
                                 <SubmitButton
                                    key='submit'
                                    ref={e => this.$submit = e}
                                    title={this.props.id && 'Обнови помин' || 'Создай помин'} /></div></div></div></div></div></form></div></div>)}}

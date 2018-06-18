import PropTypes from 'prop-types'

import CommonModal from 'CommonModal'
import MemoryForm from 'MemoryForm'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'

export default class MemoryModal extends CommonModal {
   static defaultProps = {
      id: null,
      slug: {text: ''},
      short_name: '',
      base_year: '',
      order: '',
      council: '',
      quantity: '',
      bond_to_id: 0,
      bond_to: '',
      covers_to_id: 0,
      covers_to: '',
      names: [],
      notes: [],
      descriptions: [],
      wikies: [],
      beings: [],
      paterics: [],
      memory_names: [],
      events: [],

      remoteName: 'memory',
      remoteNames: 'memories',
   }

   static propTypes = {
      slug: PropTypes.object,
      id: PropTypes.number,
   }

   getDefaultState(props = this.props) {
      console.log(props)
      return {
         id: props.id,
         slug: props.slug,
         order: props.order,
         council: props.council,
         quantity: props.quantity,
         bond_to_id: props.bond_to_id,
         bond_to: props.bond_to,
         short_name: props.short_name,
         base_year: props.base_year,
         covers_to_id: props.covers_to_id,
         covers_to: props.covers_to,
         notes: props.notes,
         descriptions: props.descriptions,
         wikies: props.wikies,
         beings: props.beings,
         paterics: props.paterics,
         memory_names: props.memory_names,
         events: props.events,
      }
   }

   getCleanState() {
      return {
         id: null,
         slug: { text: '' },
         order: '',
         short_name: '',
         base_year: '',
         council: '',
         quantity: '',
         bond_to_id: 0,
         bond_to: '',
         covers_to_id: 0,
         covers_to: '',
         base_year: '',
         short_name: '',
         notes: [],
         descriptions: [],
         wikies: [],
         beings: [],
         paterics: [],
         memory_names: [],
         events: [],
      }
   }

   render() {
      console.log(this.state)

      return (
         <div className='enrighten'>
            <div className='row'>
               <a
                  className="waves-effect waves-light btn modal-trigger"
                  href="#memory-form-modal"
                  onClick={this.newRecord.bind(this)} >
                     Новая память</a></div>
            <div
               key='memory-form-modal'
               className='form-modal modal modal-fixed-footer z-depth-2'
               id='memory-form-modal'
               ref={e => this.$modal = e} >
               <form onSubmit={this.onSubmit.bind(this)}>
                  <div className='modal-content'>
                     <MemoryForm
                        ref={e => this.$form = e}
                        key='form'
                        {...this.state}
                        onUpdate={this.onFormUpdate.bind(this)} /></div>
                  <div className="modal-footer">
                     <div className="row">
                        <div className="col xl9 l8 m7 s6">
                           <ErrorSpan
                              ref={e => this.$error = e}
                              key='error' /></div>
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
                                    title={this.props.id && 'Обнови память' || 'Создай память'} /></div></div></div></div></div></form></div></div>)}}

import CommonModal from 'CommonModal'
import NameForm from 'NameForm'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'

export default class NameModal extends CommonModal {
   static defaultProps = {
      id: null,
      text: '',
      language_code: '',
      alphabeth_code: '',
      root_id: '',
      root: '',
      bind_kind: '',
      bond_to_id: '',
      bond_to: '',

      remoteName: 'name',
      remoteNames: 'names',
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
         root_id: '',
         root: '',
         bind_kind: '',
         bond_to_id: '',
         bond_to: '',
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
                  onClick={this.newRecord.bind(this)} >
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
                                    title={this.props.id && 'Обнови имя' || 'Создай имя'} /></div></div></div></div></div></form></div></div>)}}

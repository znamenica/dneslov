import PropTypes from 'prop-types'

import CommonModal from 'CommonModal'
import CalendaryForm from 'CalendaryForm'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'

export default class CalendaryModal extends CommonModal {
   static defaultProps = {
      id: null,
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

      remoteName: 'calendary',
      remoteNames: 'calendaries',
   }

   static propTypes = {
      slug: PropTypes.object,
      licit: PropTypes.bool,
      language_code: PropTypes.string,
      names: PropTypes.array,
      wikies: PropTypes.array,
      links: PropTypes.array,
      alphabeth_code: PropTypes.string,
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
         id: null,
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
      }
   }

   render() {
      console.log(this.state)

      return (
         <div className='enrighten'>
            <div className='row'>
               <a
                  className="waves-effect waves-light btn modal-trigger"
                  href="#calendary-form-modal"
                  onClick={this.newRecord.bind(this)} >
                     Новый календарь</a></div>
            <div
               key='calendary-form-modal'
               className='form-modal modal modal-fixed-footer z-depth-2'
               id='calendary-form-modal'
               ref={e => this.$modal = e} >
               <form onSubmit={this.onSubmit.bind(this)}>
                  <div className='modal-content'>
                     <CalendaryForm
                        ref={e => this.$form = e}
                        key='form'
                        {...this.state}
                        onUpdate={this.onFormUpdate.bind(this)} /></div>
                  <div className="modal-footer">
                     <div className="row">
                        <div className="col xl9 l7 m6 s6">
                           <ErrorSpan
                              ref={e => this.$error = e}
                              key={'error'} /></div>
                        <div className="col xl3 l5 m6 s6">
                           <div className="row">
                              <div className="col s2">
                                 <button
                                    key='close-button'
                                    type='button'
                                    className='btn close'
                                    onClick={this.onCloseClick.bind(this)} >
                                    Закрой</button></div>
                              <div className="col s10">
                                 <SubmitButton
                                    key='submit'
                                    ref={e => this.$submit = e}
                                    title={this.props.id && 'Обнови календарь' || 'Создай календарь'} /></div></div></div></div></div></form></div></div>)}}

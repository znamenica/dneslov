import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'

import SlugField from 'SlugField'
import LanguageField from 'LanguageField'
import AlphabethField from 'AlphabethField'
import LicitBox from 'LicitBox'
import NamesCollection from 'NamesCollection'
import DescriptionsCollection from 'DescriptionsCollection'
import WikiesCollection from 'WikiesCollection'
import LinksCollection from 'LinksCollection'
import TextField from 'TextField'

export default class CalendaryForm extends Component {
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

   query = {}

   componentDidMount() {
      this.modal = $(this.$modal).modal()
   }

   componentDidUpdate() {
      if (this.props.open) {
         this.modal.modal('open')
      }
   }

   valid() {
      return true // TODO
   }

   onSubmitSuccess(data) {
      this.modal.modal('close')
      this.setState(this.getDefaultState())
   }

   onSubmit(e) {
      console.log("QUERY", this.query)
      let data = { calendary: this.query }

      e.stopPropagation()
      e.preventDefault()
      //$.post('', data, this.onSubmitSuccess.bind(this), 'JSON')
   }

   onChildUpdate(value) {
      this.query = assign(this.query, value)
   }

   render() {
      console.log(this.props)
      console.log(this.query)

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
               ref={$modal => this.$modal = $modal} >
               <form onSubmit={this.onSubmit.bind(this)} noValidate>
                  <div className='modal-content'>
                     <div className='row'>
                        <SlugField
                           slug={this.props.slug || ''}
                           postfix='attributes'
                           wrapperClassName='input-field col xl2 l2 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <LanguageField
                           language_code={this.props.language_code}
                           wrapperClassName='input-field col xl4 l4 m8 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <AlphabethField
                           alphabeth_code={this.props.alphabeth_code}
                           wrapperClassName='input-field col xl4 l4 m8 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <LicitBox
                           licit={this.props.licit}
                           wrapperClassName='fake-input-field col xl2 l2 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} /></div>
                     <div className='row'>
                        <div className='col l12 s12'>
                           <NamesCollection
                              value={this.props.names}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <div className='col l12 s12'>
                           <DescriptionsCollection
                              value={this.props.descriptions}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <div className='col l12 s12'>
                           <WikiesCollection
                              value={this.props.wikies}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <div className='col l12 s12'>
                           <LinksCollection
                              value={this.props.links}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <TextField
                           name='author_name'
                           title='Автор'
                           placeholder='Введи имя автора(ов)'
                           text={this.props.author_name}
                           wrapperClassName='input-field col xl6 l6 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <TextField
                           name='date'
                           title='Пора'
                           placeholder='Введи пору написания'
                           text={this.props.date}
                           wrapperClassName='input-field col xl3 l3 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <TextField
                           name='council'
                           title='Собор'
                           placeholder='Введи сокращение собора'
                           text={this.props.council}
                           wrapperClassName='input-field col xl3 l3 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} /></div>
</div>
                  <div className="modal-footer">
                     <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={! this.valid()} >
                        <span>
                           Создай календарь</span></button></div></form></div></div>)}}

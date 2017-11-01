import { Component } from 'react'
import PropTypes from 'prop-types'
import * as assign from 'assign-deep'
import { mixin } from 'lodash-decorators'

import SlugField from 'SlugField'
import LanguageField from 'LanguageField'
import AlphabethField from 'AlphabethField'
import LicitBox from 'LicitBox'
import NamesCollection from 'NamesCollection'
import DescriptionsCollection from 'DescriptionsCollection'
import WikiesCollection from 'WikiesCollection'
import LinksCollection from 'LinksCollection'
import TextField from 'TextField'
import SubmitButton from 'SubmitButton'
import ErrorSpan from 'ErrorSpan'
import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
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

   static validations = {
      'Избранный язык не соотвествует избранной азбуке': matchCodes,
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

   onSubmitSuccess(data) {
      this.modal.modal('close')
      this.setState(this.getDefaultState())
   }

   onSubmit(e) {
      console.log("QUERY", this.query)
      let data = { calendary: this.query }

      e.stopPropagation()
      e.preventDefault()
      $.post('', data, this.onSubmitSuccess.bind(this), 'JSON')
   }

   onChildUpdate(value) {
      this.query = assign(this.query, value)
      this.updateError(this.query)
      this.$error.setState({text: this.error})
      this.validate()
   }

   _traverse_map(node, state) {
      if (!state) {
         state = {level: 0, parent: null}
      }

      let result = [node]

      if (node.refs) {
         Object.values(node.refs).forEach((child) => {
            let child_result = this._traverse_map(child, {
               level: state.level + 1, parent: node})
            result = result.concat(child_result)
         })
      }

      return result
   }

   /*
   _traverse_map1(node, state){
      if (!state) {
         state = {level: 0, parent: null}
      }

      let result = []

      result.push(node)
      if (node.props) {
         let children = React.Children.toArray(node.props.children)

         console.log(node.props.children)
         children.forEach((child) => {
            let child_result = this._traverse_map(child, {
               level: state.level + 1, parent: node})
            result.concat(child_result)
         })
      }

      console.log(node, result, result.length)
      return result
   }*/

   validate() {
      let valid = this._traverse_map(this).reduce((v, c) => { return v && (! c.isValid || c.isValid()) }, true)
      this.$submit.setState({valid: valid})
   }

   render() {
      console.log(this.props)
      console.log(this.props.children)
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
               ref={e => this.$modal = e} >
               <form onSubmit={this.onSubmit.bind(this)}>
                  <div className='modal-content'>
                     <div className='row'>
                        <SlugField
                           ref={'slug'}
                           key={'slug'}
                           slug={this.props.slug || ''}
                           postfix='attributes'
                           wrapperClassName='input-field col xl2 l2 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <LanguageField
                           ref={'languageField'}
                           key={'languageField'}
                           language_code={this.props.language_code}
                           wrapperClassName='input-field col xl4 l4 m8 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <AlphabethField
                           ref={'alphabethField'}
                           key={'alphabethField'}
                           alphabeth_code={this.props.alphabeth_code}
                           wrapperClassName='input-field col xl4 l4 m8 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <LicitBox
                           ref={'licitBox'}
                           key={'licitBox'}
                           licit={this.props.licit}
                           wrapperClassName='fake-input-field col xl2 l2 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} /></div>
                     <ErrorSpan
                        ref={e => this.$error = e}
                        key={'error'}
                        text={this.error} />
                     <div className='row'>
                        <div className='col l12 s12'>
                           <NamesCollection
                              ref={'names'}
                              key={'names'}
                              value={this.props.names}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <div className='col l12 s12'>
                           <DescriptionsCollection
                              ref={'descriptions'}
                              key={'descriptions'}
                              value={this.props.descriptions}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <div className='col l12 s12'>
                           <WikiesCollection
                              ref={'wikies'}
                              key={'wikies'}
                              value={this.props.wikies}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <div className='col l12 s12'>
                           <LinksCollection
                              ref={'links'}
                              key={'links'}
                              value={this.props.links}
                              postfix='attributes'
                              onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                     <div className='row'>
                        <TextField
                           ref={'authorName'}
                           key={'authorName'}
                           name='author_name'
                           title='Автор'
                           placeholder='Введи имя автора(ов)'
                           text={this.props.author_name}
                           wrapperClassName='input-field col xl6 l6 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <TextField
                           ref={'date'}
                           key={'date'}
                           name='date'
                           title='Пора'
                           placeholder='Введи пору написания'
                           text={this.props.date}
                           wrapperClassName='input-field col xl3 l3 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} />
                        <TextField
                           ref={'council'}
                           key={'council'}
                           name='council'
                           title='Собор'
                           placeholder='Введи сокращение собора'
                           text={this.props.council}
                           wrapperClassName='input-field col xl3 l3 m4 s12'
                           onUpdate={this.onChildUpdate.bind(this)} /></div></div>
                  <div className="modal-footer">
                     <SubmitButton
                        ref={e => this.$submit = e}
                        title='Создай календарь'
                        valid={false} /></div></form></div></div>)}}

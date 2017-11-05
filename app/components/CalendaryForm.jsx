import { Component } from 'react'
import PropTypes from 'prop-types'
import * as uuid from 'uuid/v1'
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
import ErrorSpan from 'ErrorSpan'
import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class CalendaryForm extends Component {
   static defaultProps = {
      licit: false,
      slug: {},
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

   static propTypes = {
      slug: PropTypes.object,
      licit: PropTypes.boolean,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.object,
   }

   static validations = {
      'Избранный язык не соотвествует избранной азбуке': matchCodes,
   }

   query = this.deserializedHash(this.props)

   componentWillReceiveProps(nextProps) {
      this.query = this.deserializedHash(nextProps)
   }

   shouldComponentUpdate(nextProps, nextState) {
      return true
   }

   serializedHash(hash) {
      let result = {}

      Object.entries(hash).forEach(([key, value]) => {
         if (value instanceof Object) {
            if (Object.keys(value)[0].match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) {
               result[key] = Object.values(value)
            } else {
               result[key] = this.serializedHash(value)
            }
         } else {
            result[key] = value
         }
      })

      return result
   }

   deserializedHash(hash) {
      let result = {}

      Object.entries(hash).forEach(([key, value]) => {
         if (typeof value !== 'object' || value === null) {
            result[key] = value
         } else {
            switch(value.constructor.name) {
            case 'Array':
/*               result[key + '_attributes'] = value.reduce((s, v) => {
                  if (value instanceof Object) {
                     s[uuid()] = this.deserializedHash(v)
                  } else {
                     s[uuid()] = v }
                  return s }, {})*/
               result[key + '_attributes'] = value.map((v) => {
                  return assign({key: uuid()}, this.deserializedHash(v)) })
               break
            case 'Object':
               result[key + '_attributes'] = this.deserializedHash(value)
               break
            default:
               result[key] = value
            }
         }
      })

      console.log(result)
      return result
   }

   onChildUpdate(value) {
      console.log(value)
      this.query = assign({}, this.query, value)
      this.updateError(this.query)
      this.validate()
      this.props.onUpdate()
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
      this.valid = this._traverse_map(this).reduce((v, c) => { return v && (! c.isValid || c.isValid()) }, true)
   }

   render() {
      console.log(this.query)

      return (
         <div>
            <div className='row'>
               <SlugField
                  ref={'slug'}
                  key={'slug'}
                  slug={this.query.slug_attributes}
                  postfix='attributes'
                  wrapperClassName='input-field col xl2 l2 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <LanguageField
                  ref={'languageField'}
                  key={'languageField'}
                  language_code={this.query.language_code}
                  wrapperClassName='input-field col xl4 l4 m8 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <AlphabethField
                  ref={'alphabethField'}
                  key={'alphabethField'}
                  alphabeth_code={this.query.alphabeth_code}
                  wrapperClassName='input-field col xl4 l4 m8 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <LicitBox
                  ref={'licitBox'}
                  key={'licitBox'}
                  licit={this.query.licit}
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
                     value={this.query.names_attributes}
                     postfix='attributes'
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <DescriptionsCollection
                     ref={'descriptions'}
                     key={'descriptions'}
                     value={this.query.descriptions_attributes}
                     postfix='attributes'
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <WikiesCollection
                     ref={'wikies'}
                     key={'wikies'}
                     value={this.query.wikies_attributes}
                     postfix='attributes'
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <LinksCollection
                     ref={'links'}
                     key={'links'}
                     value={this.query.links_attributes}
                     postfix='attributes'
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <TextField
                  ref={'authorName'}
                  key={'authorName'}
                  name='author_name'
                  title='Автор'
                  placeholder='Введи имя автора(ов)'
                  text={this.query.author_name}
                  wrapperClassName='input-field col xl6 l6 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={'date'}
                  key={'date'}
                  name='date'
                  title='Пора'
                  placeholder='Введи пору написания'
                  text={this.query.date}
                  wrapperClassName='input-field col xl3 l3 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={'council'}
                  key={'council'}
                  name='council'
                  title='Собор'
                  placeholder='Введи сокращение собора'
                  text={this.query.council}
                  wrapperClassName='input-field col xl3 l3 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div></div>)}}

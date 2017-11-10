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

   static propTypes = {
      slug: PropTypes.object,
      licit: PropTypes.boolean,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.object,
   }

   static validations = {
      'Избранный язык не соотвествует избранной азбуке': matchCodes,
   }

   // query has non-serialized form without '*_attributes' and with uuided hashes
   query = this.deserializedHash(this.props)

   valid = false

   componentWillReceiveProps(nextProps) {
      this.query = this.deserializedHash(nextProps)
   }

   shouldComponentUpdate(nextProps, nextState) {
      return true
   }

   componentDidUpdate() {
      this.validate()
   }

   serializedQuery() {
      return this.serializedHash(this.query)
   }

   deserializedHash(hash) {
      let result = {}

      Object.entries(hash).forEach(([key, value]) => {
         console.log(key, value, (value && value.constructor.name))
         switch(value && value.constructor.name) {
         case 'Array':
            console.log(value[0], value[0] && value[0].constructor.name)
            if (value[0] instanceof Object) {
               result[key] = value.reduce((s, v) => {
                  s[uuid()] = this.deserializedHash(v)
                  return s
               }, {})
            } else {
               result[key] = value
            }
            break
         case 'Object':
            result[key] = this.deserializedHash(value)
            break
         default:
            result[key] = value
         }
      })

      console.log(result)
      return result
   }

   serializedHash(hash) {
      let result = {}, subkey

      Object.entries(hash).forEach(([key, value]) => {
         console.log(key, value, value && value.constructor.name)
         switch(value && value.constructor.name) {
         case 'Array':
            subkey = Object.keys(value)[0]
            if (subkey && subkey.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) {
               result[key + '_attributes'] = Object.values(value)
            } else {
               result[key + '_attributes'] = value
            }
            break
         case 'Object':
            result[key + '_attributes'] = this.serializedHash(value)
            break
         default:
            result[key] = value
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

      let result = []

      if (node) {
         result.push(node)

         if (node.r && node.r.length) {
            node.r.forEach((child) => {
               let child_result = this._traverse_map(child, {
                  level: state.level + 1, parent: node})
               result = result.concat(child_result)
            })
         }
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
      if (this.r && this.r.length) {
         console.log(this._traverse_map(this))
         this.valid = this._traverse_map(this).reduce((v, c) => { 
            return v && (! c.isValid || c.isValid()) }, true)
         console.log(this.valid)
      }
   }

   render() {
      this.r = []

      console.log(this.props)
      console.log(this.query)

      return (
         <div>
            <div className='row'>
               <SlugField
                  ref={e => this.r.push(e)}
                  key={'slug'}
                  slug={this.query.slug}
                  wrapperClassName='input-field col xl2 l2 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <LanguageField
                  ref={e => this.r.push(e)}
                  key={'languageField'}
                  language_code={this.query.language_code}
                  wrapperClassName='input-field col xl4 l4 m8 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <AlphabethField
                  ref={e => this.r.push(e)}
                  key={'alphabethField'}
                  alphabeth_code={this.query.alphabeth_code}
                  wrapperClassName='input-field col xl4 l4 m8 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <LicitBox
                  ref={e => this.r.push(e)}
                  key={'licitBox'}
                  licit={this.query.licit}
                  wrapperClassName='fake-input-field col xl2 l2 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
                     key={'error'} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <NamesCollection
                     ref={e => this.r.push(e)}
                     key={'names'}
                     value={this.query.names}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <DescriptionsCollection
                     ref={e => this.r.push(e)}
                     key={'descriptions'}
                     value={this.query.descriptions}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <WikiesCollection
                     ref={e => this.r.push(e)}
                     key={'wikies'}
                     value={this.query.wikies}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <LinksCollection
                     ref={e => this.r.push(e)}
                     key={'links'}
                     value={this.query.links}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <TextField
                  ref={e => this.r.push(e)}
                  key={'authorName'}
                  name='author_name'
                  title='Автор'
                  placeholder='Введи имя автора(ов)'
                  text={this.query.author_name}
                  wrapperClassName='input-field col xl6 l6 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key={'date'}
                  name='date'
                  title='Пора'
                  placeholder='Введи пору написания'
                  text={this.query.date}
                  wrapperClassName='input-field col xl3 l3 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key={'council'}
                  name='council'
                  title='Собор'
                  placeholder='Введи сокращение собора'
                  text={this.query.council}
                  wrapperClassName='input-field col xl3 l3 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div></div>)}}

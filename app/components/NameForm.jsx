import { Component } from 'react'
import PropTypes from 'prop-types'
import * as uuid from 'uuid/v1'
import * as assign from 'assign-deep'
import { mixin } from 'lodash-decorators'

import LanguagedTextField from 'LanguagedTextField'
import NameField from 'NameField'
import NameBindKindField from 'NameBindKindField'
import ErrorSpan from 'ErrorSpan'
import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class NameForm extends Component {
   static defaultProps = {
      id: null,
      text: '',
      language_code: '',
      alphabeth_code: '',
      root_id: 0,
      root: '',
      bind_kind: '',
      bond_to_id: 0,
      bond_to: '',
   }

   static propTypes = {
      order: PropTypes.string.isRequired,
   }

   static validations = {
      'Вид связки не должен иметь значение "Не связанное" в случае, если связаное имя задано': (query) => {
         return query.bond_to_id && query.bind_kind == "несвязаное"
      },
      'Вид связки должен иметь значение "Не связанное" в случае, если связаное имя отсутствует': (query) => {
         return !query.bond_to_id && query.bind_kind != "несвязаное"
      },
      'Связаное имя не должно соответствовать названию текущего имени': (query) => {
         return query.bond_to && query.bond_to == query.text
      },
      'Корневое имя не должно соответствовать названию текущего имени': (query) => {
         return query.root && query.root == query.text
      },
   }

   // query has non-serialized form without '*_attributes' and with uuided hashes
   query = this.deserializedHash(this.props)

   valid = false

   componentWillReceiveProps(nextProps) {
      this.query = this.deserializedHash(nextProps)
      console.log(this.query, nextProps)
   }

   shouldComponentUpdate(nextProps, nextState) {
      return true
   }

   componentWillMount() {
      this.r = new Array
   }

   componentDidUpdate() {
      this.validate()
   }

   serializedQuery() {
      console.log('QUERY', this.query)
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
            } else if (value[0]) {
               result[key] = value
            } else {
               result[key] = {}
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
            subkey = Object.keys(value)[0]
            if (subkey && subkey.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) {
               result[key + '_attributes'] = Object.values(value)
            } else {
               result[key + '_attributes'] = this.serializedHash(value)
            }
            break
         default:
            result[key] = value
         }
      })

      console.log(result)
      return result
   }

   onChildUpdate(value) {
      this.query = assign({}, this.query, value)
      console.log(value, this.query)
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
      console.log(this.props)
      console.log(this.query)

      return (
         <div>
            <LanguagedTextField
               key='languageTextField'
               ref={e => this.r.push(e)}
               title='Написание имени'
               placeholder='Введи написание имени'
               text={this.query.text}
               language_code={this.query.language_code}
               alphabeth_code={this.query.alphabeth_code}
               value_validations={this.props.child_value_validations}
               validations={this.props.child_validations}
               key_name='text'
               onUpdate={this.onChildUpdate.bind(this)} />
            <div className='row'>
               <NameField
                  ref={e => this.r.push(e)}
                  key='bondToId'
                  field_name='bond_to_id'
                  name='bond_to'
                  title='Связаное имя'
                  bond_to_id={this.query.bond_to_id}
                  bond_to={this.query.bond_to}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <NameBindKindField
                  ref={e => this.r.push(e)}
                  key='bindKind'
                  name='bind_kind'
                  bind_kind={this.query.bind_kind}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <NameField
                  ref={e => this.r.push(e)}
                  key='rootId'
                  field_name='root_id'
                  name='root'
                  title='Корневое имя'
                  root_id={this.query.root_id}
                  root={this.query.root}
                  wrapperClassName='input-field col xl4 l4 m12 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
                     error={this.getError(this.query)}
                     key='error' /></div></div></div>)}}

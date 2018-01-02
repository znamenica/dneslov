import { Component } from 'react'
import PropTypes from 'prop-types'
import * as uuid from 'uuid/v1'
import * as assign from 'assign-deep'
import { mixin } from 'lodash-decorators'

import DynamicField from 'DynamicField'
import DescriptionsCollection from 'DescriptionsCollection'
import LinksCollection from 'LinksCollection'
import FilteredDynamicField from 'FilteredDynamicField'
import MemoBindKindField from 'MemoBindKindField'
import DateField from 'DateField'
import YearDateField from 'YearDateField'
import CalendaryField from 'CalendaryField'
import MemoryField from 'MemoryField'
import EventField from 'EventField'
import ErrorSpan from 'ErrorSpan'
import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class MemoForm extends Component {
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
      descriptions: [],
      links: [],
   }

   static validations = {
      'Вид привязки не должен иметь значение "Не привязаный" в случае, если привязка задана': (query) => {
         return query.bond_to_id && query.bind_kind == "несвязаный"
      },
      'Вид привязки должен иметь значение "Не привязаный" в случае, если привязка отсутствует': (query) => {
         return !query.bond_to_id && query.bind_kind != "несвязаный"
      },
      'Привязаная дата не должно соответствовать текущей дате': (query) => {
         return query.bond_to && query.bond_to == query.year_date
      },
      'Минимум одно описание должно быть задано': (query) => {
         console.log(query.descriptions, Object.keys(query.descriptions).length)
         return Object.keys(query.descriptions).length == 0
      },
   }

   // query has non-serialized form without '*_attributes' and with uuided hashes
   query = this.deserializedHash(this.props)

   valid = false

   constructor(props) {
      super(props)

      console.log(this.query, props)
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.id != this.props.id) {
         this.query = this.deserializedHash(nextProps)
         console.log(this.query, nextProps)
      }
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

   // converts [] to {}
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

   // converts {} to []
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

      if (value.memory || value.event || value.calendary) {
         this.forceUpdate()
      }
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
         this.valid = this._traverse_map(this).reduce((v, c) => { 
            return v && (! c.isValid || c.isValid()) }, true)
         console.log(this.valid)
      }
   }

   render() {
      console.log("props", this.props)
      console.log("query", this.query)

      return (
         <div>
            <div className='row'>
               <CalendaryField
                  ref={e => this.r.push(e)}
                  key='calendaryId'
                  calendary_id={this.query.calendary_id}
                  calendary={this.query.calendary}
                  wrapperClassName='input-field col xl4 l4 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <MemoryField
                  ref={e => this.r.push(e)}
                  key='memoryId'
                  memory_id={this.query.memory_id}
                  memory={this.query.memory}
                  wrapperClassName='input-field col xl4 l4 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <EventField
                  ref={e => this.r.push(e)}
                  key='eventId'
                  filter_value={this.query.memory_id}
                  event_id={this.query.event_id}
                  event={this.query.event}
                  wrapperClassName='input-field col xl4 l4 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <YearDateField
                  ref={e => this.r.push(e)}
                  key='yearDate'
                  year_date={this.query.year_date}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <MemoBindKindField
                  ref={e => this.r.push(e)}
                  key='bindKind'
                  name='bind_kind'
                  bind_kind={this.query.bind_kind}
                  wrapperClassName='input-field col xl3 l3 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <FilteredDynamicField
                  ref={e => this.r.push(e)}
                  key='bondToId'
                  pathname='short_memoes'
                  field_name='bond_to_id'
                  name='bond_to'
                  key_name='memo'
                  value_name='id'
                  filter={{with_event_id: this.query.event_id, with_calendary_id: this.query.calendary_id}}
                  title='Привязаный помин'
                  placeholder='Начни ввод даты привязаного помина...'
                  bond_to_id={this.query.bond_to_id}
                  bond_to={this.query.bond_to}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <DateField
                  ref={e => this.r.push(e)}
                  key='addDate'
                  name='add_date'
                  title='Пора добавления'
                  add_date={this.query.add_date}
                  wrapperClassName='input-field col xl3 l3 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
                     error={this.getError(this.query)}
                     key='error' /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <DescriptionsCollection
                     ref={e => this.r.push(e)}
                     key='descriptions'
                     name='descriptions'
                     value={this.query.descriptions}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <LinksCollection
                     ref={e => this.r.push(e)}
                     key={'links'}
                     value={this.query.links}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div></div>)}}

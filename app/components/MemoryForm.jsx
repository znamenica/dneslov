import { Component } from 'react'
import PropTypes from 'prop-types'
import * as uuid from 'uuid/v1'
import * as assign from 'assign-deep'
import { mixin } from 'lodash-decorators'

import SlugField from 'SlugField'
import DescriptionsCollection from 'DescriptionsCollection'
import BeingsCollection from 'BeingsCollection'
import WikiesCollection from 'WikiesCollection'
import PatericsCollection from 'PatericsCollection'
import MemoryNamesCollection from 'MemoryNamesCollection'
import EventsCollection from 'EventsCollection'
import OrderField from 'OrderField'
import TextField from 'TextField'
import BaseYearField from 'BaseYearField'
import ShortNameField from 'ShortNameField'
import PlaceField from 'PlaceField'
import DynamicField from 'DynamicField'
import ErrorSpan from 'ErrorSpan'
import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class MemoryForm extends Component {
   static defaultProps = {
      slug: {text: ''},
      base_year: 0,
      short_name: '',
      order: null,
      council: '',
      quantity: '',
      sight_id: '',
      covers_to_id: '',
      descriptions: [],
      wikies: [],
      beings: [],
      paterics: [],
      memory_names: [],
      events: [],
   }

   static propTypes = {
      slug: PropTypes.object,
      order: PropTypes.string.isRequired,
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
/*
   isCouncil() {
      this.state.order == 'сбр'
   }

   isIcon() {
      this.state.order == 'обр'
   }
*/
   render() {
      console.log(this.props)
      console.log(this.query)

      return (
         <div>
            <div className='row'>
               <SlugField
                  ref={e => this.r.push(e)}
                  key='slug'
                  slug={this.query.slug}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <ShortNameField
                  ref={e => this.r.push(e)}
                  key='shortName'
                  text={this.query.short_name}
                  wrapperClassName='input-field col xl3 l3 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <OrderField
                  ref={e => this.r.push(e)}
                  key='order'
                  order={this.query.order}
                  wrapperClassName='input-field col xl5 l5 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <BaseYearField
                  ref={e => this.r.push(e)}
                  key='baseYear'
                  text={this.query.base_year}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <PlaceField
                  ref={e => this.r.push(this.$covers_to = e)}
                  key='covers_to'
                  name='covers_to_id'
                  pure_name='covers_to'
                  title='Покровительство'
                  placeholder='Введи место покровительства'
                  text={this.query.covers_to}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key='council'
                  name='council'
                  title='Собор'
                  placeholder='Введи сокращение собора'
                  text={this.query.council}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key='quantity'
                  name='quantity'
                  title='Количество'
                  placeholder='Введи количество'
                  text={this.query.quantity}
                  wrapperClassName='input-field col xl2 l2 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <DynamicField
                  ref={e => this.r.push(this.$sight = e)}
                  key='sight'
                  pathname='icons'
                  key_name='short_name'
                  value_name='id'
                  name='sight_id'
                  pure_name='sight'
                  title='Вид'
                  placeholder='Введи вид образа'
                  text={this.query.sight}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
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
                  <BeingsCollection
                     ref={e => this.r.push(e)}
                     key='beings'
                     name='beings'
                     value={this.query.beings}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <WikiesCollection
                     ref={e => this.r.push(e)}
                     key='wikies'
                     name='wikies'
                     value={this.query.wikies}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <PatericsCollection
                     ref={e => this.r.push(e)}
                     key='paterics'
                     name='paterics'
                     value={this.query.paterics}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <MemoryNamesCollection
                     ref={e => this.r.push(e)}
                     key='memory_names'
                     name='memory_names'
                     value={this.query.memory_names}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <EventsCollection
                     ref={e => this.r.push(e)}
                     key='events'
                     name='events'
                     value={this.query.events}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div></div>)}}

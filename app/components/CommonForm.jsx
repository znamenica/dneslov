import { Component } from 'react'
import PropTypes from 'prop-types'
import * as uuid from 'uuid/v1'
import * as assign from 'assign-deep'
import { mixin } from 'lodash-decorators'

import { matchCodes } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class CommonForm extends Component {
   static defaultProps = {
      validations: {},
      updateOnChange: null
   }

   static propTypes = {
      validations: PropTypes.object.isRequired,
   }

   // query has non-serialized form without '*_attributes' and with uuided hashes
   query = this.deserializedHash(this.props)

   valid = false

   constructor(props) {
      super(props)

      console.log(this.query, props)
   }

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

   componentWillUpdate() {
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
}

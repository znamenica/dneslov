import { Component } from 'react'
import PropTypes from 'prop-types'
import * as uuid from 'uuid/v1'
import { merge } from 'merge-anything'
import * as Axios from 'axios'
import { mixin } from 'lodash-decorators'

import Validation from 'Validation'
import { matchCodes } from 'matchers'
import { renderElement } from 'render'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class Form extends Component {
   static defaultProps = {
      data: null,
      meta: null,
      validations: {},
   }

   static propTypes = {
      validations: PropTypes.object
   }

   // state is treated as a query, which has non-serialized form without '*_attributes' and with uuided hashes
   state = { prevProps: null }

   valid = false

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return({
            prevProps: props,
            query: Form.deserializedHash(props.data),
            error: ""
         })
      } else {
         return null
      }
   }

   // system
   constructor() {
      super()

      this.onSubmit = this.onSubmit.bind(this)
      this.onChildChanged = this.onChildChanged.bind(this)
   }

   componentDidMount() {
      console.log("[componentDidMount] <<<")
      document.addEventListener('dneslov-update-path', this.onChildChanged)
      document.addEventListener('dneslov-record-submit', this.onSubmit)
   }

   componentWillUnmount() {
      console.log("[componentWillUnmount] <<<")
      document.removeEventListener('dneslov-update-path', this.onChildChanged)
      document.removeEventListener('dneslov-record-submit', this.onSubmit)
   }

   componentDidUpdate() {
      var valid = document.querySelectorAll('.error:not(:empty)').length == 0

      if (valid && !this.valid || !valid && this.valid) {
         let ce = new CustomEvent('dneslov-form-valid', { detail: { valid: valid }})

         this.valid = valid
         document.dispatchEvent(ce)
      }
   }

   // custom
   serializedQuery() {
      return Form.serializedHash(this.state.query)
   }

   // events
   onChildChanged(e) {
      console.log("[onChildChanged] <<<", e)

      let newState = { query: merge({}, this.state.query, e.detail) }
      console.log("[onChildChanged] > new state", newState)
      this.setState(newState)
   }

   onSubmitSuccess(response) {
      console.log("SUCCESS", response)
      let ce = new CustomEvent('dneslov-record-stored', { detail: response.data })

      document.dispatchEvent(ce)

      this.setState({ query: {}, error: "" })
   }

   onSubmitError(error) {
      let error_text

      if (error.response.responseJSON) {
         let errors = []

         Object.entries(error.response.responseJSON).forEach(([key, value]) => {
            errors.push(value.map((e) => { return key + " " + e }))
         })

         error_text = errors.join(", ")
      } else if (error.response.responseText) {
         error_text = error.response.responseText
      } else {
         error_text = error.response.statusText + ": " + error.response.data
      }

      this.setState({ error: error_text })
   }

   onSubmit(e) {
      e.stopPropagation()
      e.preventDefault()

      let record = this.serializedQuery(),
          request = { data: {}},
          request_url_base = '/' + this.props.remoteNames,
          id = this.state.query.id

      request.data[this.props.remoteName] = record

      if (id) {
         request.method = 'put'
         request.url = request_url_base + '/' + id + '.json'
      } else {
         request.method = 'post'
         request.url = request_url_base + '.json'
      }

      console.log("Form submit", request)

      Axios(request)
        .then(this.onSubmitSuccess.bind(this))
        .catch(this.onSubmitError.bind(this))
   }

   // converts {} to []
   static serializedHash(hash) {
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

   // converts [] to {}
   static deserializedHash(hash) {
      let result = {}
      console.log("[deserializedHash] >", hash)

      Object.entries(hash).forEach(([key, value], index) => {
         console.log("[deserializedHash] *", key, value, (value && value.constructor.name))
         switch(value && value.constructor.name) {
         case 'Array':
            console.log("[deserializedHash] **", value[0], value[0] && value[0].constructor.name)
            if (value[0] instanceof Object) {
               result[key] = value.reduce((s, v, index) => {
                  s[uuid()] = merge({ _pos: index }, Form.deserializedHash(v))
                  return s
               }, {})
            } else if (value[0]) {
               result[key] = value
            } else {
               result[key] = {}
            }
            break
         case 'Object':
            result[key] = merge({ _pos: index }, Form.deserializedHash(value))
            break
         default:
            result[key] = value
         }
      })

      console.log(result)
      return result
   }

   static getCleanState() {
      return {}
   }

   render() {
      console.log("[render] > state", this.state, "from props", this.props)

      return (
         <form>
            <div className='row'>
               {renderElement({value: this.state.query}, this.props.meta)}</div>
            <div className='row'>
               <ErrorSpan
                  error={this.state.error} /></div></form>)
   }
}

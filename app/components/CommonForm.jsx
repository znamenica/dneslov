import { Component } from 'react'
import PropTypes from 'prop-types'
import * as uuid from 'uuid/v1'
import * as assign from 'assign-deep'
import * as Axios from 'axios'
import { mixin } from 'lodash-decorators'

import { matchCodes } from 'matchers'
import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class CommonForm extends Component {
   static defaultProps = {
      validations: {},
      updateOnChange: null
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
            query: CommonForm.deserializedHash(props),
            error: ""
         })
      } else {
         return null
      }
   }

   componentDidMount() {
      document.addEventListener('dneslov-update-path', this.onChildChanged.bind(this))
      document.addEventListener('dneslov-record-submit', this.onSubmit.bind(this))
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
      return CommonForm.serializedHash(this.state.query)
   }

   // events
   onChildChanged(e) {
      console.log("new query path", e.detail)
      this.setState({ query: assign({}, this.state.query, e.detail) })
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
          id = this.props.id

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

      Object.entries(hash).forEach(([key, value]) => {
         console.log("[deserializedHash] *", key, value, (value && value.constructor.name))
         switch(value && value.constructor.name) {
         case 'Array':
            console.log("[deserializedHash] **", value[0], value[0] && value[0].constructor.name)
            if (value[0] instanceof Object) {
               result[key] = value.reduce((s, v) => {
                  s[uuid()] = CommonForm.deserializedHash(v)
                  return s
               }, {})
            } else if (value[0]) {
               result[key] = value
            } else {
               result[key] = {}
            }
            break
         case 'Object':
            result[key] = CommonForm.deserializedHash(value)
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

   renderContent() {
      return ""
   }

   render() {
      console.log("[render] > props", this.props)
      console.log("[render] > state", this.state)

      return (
         <form onSubmit={this.onSubmit.bind(this)}>
            <div className='row'>
               {this.renderContent()}</div>
            <div className='row'>
               <ErrorSpan
                  error={this.state.error} /></div></form>)
   }
}

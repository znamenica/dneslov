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
            query: Form.deserializedHash(props.data, Form.metaToScheme(props.meta)),
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
      document.addEventListener('dneslov-update-path', this.onChildChanged, { passive: true })
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
      console.debug("[onChildChanged] <<<", e)

      let newState = { query: merge({}, this.state.query, e.detail) }
      console.log("[onChildChanged] > new state", newState)
      this.setState(newState)
   }

   onSubmitSuccess(response) {
      let ce = new CustomEvent('dneslov-record-stored', { detail: response.data })

      document.dispatchEvent(ce)
   }

   onSubmitError(error) {
      console.debug("[onSubmitError] <<<", error)
      let error_text

      if (error.response.responseJSON) {
         console.log("[onSubmitError] * response json", error.response.responseJSON)
         let errors = []

         Object.entries(error.response.responseJSON).forEach(([key, value]) => {
            errors.push(value.map((e) => { return key + " " + e }))
         })

         error_text = errors.join(", ")
      } else if (error.response.responseText) {
         console.log("[onSubmitError] * response text", error.response.responseText)
         error_text = JSON.stringify(error.response.responseText)
      } else {
         console.log("[onSubmitError] * response data", error.response.data)
         error_text = error.response.statusText + ": " + JSON.stringify(error.response.data)
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

   // serialization to send the JSON out
   // converts {} to []
   static serializedHash(hash) {
      let result = {}, subkey

      Object.entries(hash).forEach(([key, value]) => {
         console.log(key, value, value && value.constructor.name)
         switch(value && value.constructor.name) {
         case 'Array':
            subkey = Object.keys(value)[0]
            if (subkey && subkey.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) {
               result[key + '_attributes'] = Object.values(value).map((v) => {
                  return value && value.constructor.name === "Object" && this.serializedHash(v) || v
               })
            } else {
               result[key + '_attributes'] = value
            }
            break
         case 'Object':
            subkey = Object.keys(value)[0]
            if (subkey && subkey.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/)) {
               result[key + '_attributes'] = Object.values(value).map((v) => {
                  return value && value.constructor.name === "Object" && this.serializedHash(v) || v
               })
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

   static deserializeArray(value, scheme) {
      console.debug("[deserializedArray] <<< value: ", value, ", scheme: ", scheme)
      let result = Object.entries(scheme).reduce((preResult, [target, subscheme]) => {
         let array
         console.debug("[deserializedArray] ** value class:", value[0] && value[0].constructor.name)
         console.debug("[deserializedArray] ** subscheme:", subscheme)
         if (subscheme && subscheme["_filter"]) {
            array = value.filter((v) => {
               console.debug("[deserializedArray] ** filter v:", v)
               return subscheme["_filter"].all(([sKey, sValue]) => {
                  return sKey.match(/^_/) || v[sKey] && v[sKey] == sValue
               })
            })
         } else {
            array = value
         }

         console.debug("[deserializedArray] ** array:", array)
         let resValue = array.reduce((s, v, index) => {
            s[uuid()] = merge({ _pos: index }, Form.deserializedHash(v, subscheme))
            return s
         }, {})

         console.debug("[deserializedArray] ** resValue:", resValue)

         if (resValue && !resValue.isBlank()) {
            return merge(preResult, { [target]: resValue })
         } else {
            return preResult
         }
      }, {})

      console.debug("[deserializedArray] >>>", result)

      return result
   }

   // deserialization of parsed JSON to fill the form
   // converts [] to {}
   static deserializedHash(hash, schemeIn) {
      console.debug("[deserializedHash] <<< hash:", hash, "schemeIn:", schemeIn)

      let entries = Object.entries(hash)
      let result = entries.reduce((preResult, [key, value]) => {
         let preValue = {}, tmpValue, scheme

         console.log("[deserializedHash] *", key, "[", (value && value.constructor.name), "]", value)

         switch(value && value.constructor.name) {
            case 'Array':
               if (schemeIn) {
                  if (value[0] instanceof Object) {
                     scheme = (schemeIn || { [key]: null }).select((keyIn, valueIn) => {
                        return keyIn == key || valueIn["_source"] == key
                     })
                     preValue = Form.deserializeArray(value, scheme)
                  } else if (value[0]) {
                     preValue = { [key]: value }
                  } else {
                     preValue = { [key]: {} }
                  }
               } else {
                  preValue = { [key]: value }
               }
               break
            case 'Object':
               if (schemeIn) {
                  tmpValue = merge({ _pos: entries.indexOf([key, value]) }, Form.deserializedHash(value, schemeIn[key]))
                  preValue = { [key]: tmpValue }
               } else {
                  preValue = { [key]: value }
               }
               break
            default:
               preValue = { [key]: value }
            }

         console.debug("[deserializedHash] (new) preResult:", merge(preResult, preValue))
         return merge(preResult, preValue)
      }, {})

      console.debug("[deserializedHash] >>>", result)
      return result
   }

   static metaToScheme(meta) {
      return Object.entries(meta).reduce((scheme, [key, value]) => {
         if (value["meta"]) {
            scheme[key] = Form.metaToScheme(value["meta"])
         }

         if (value["filter"] instanceof Object) {
            scheme[key] ||= {}
            scheme[key]["_filter"] = value["filter"]
         }

         if (value["source"]) {
            scheme[key] ||= {}
            scheme[key]["_source"] = value["source"]
         }

         return scheme
      }, {})
   }

   static getCleanState() {
      return {}
   }

   render() {
      console.log("[render] * this.state", this.state, "this.props", this.props)

      return (
         <form>
            <div className='row'>
               {renderElement({value: this.state.query}, this.props.meta)}</div>
            <div className='row'>
               <ErrorSpan
                  appendClassName='form'
                  error={this.state.error} /></div></form>)
   }
}

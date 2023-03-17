import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin, flow } from 'lodash-decorators'
import { CharacterCounter } from 'materialize-css'
import JSONInput from '@soon92/react-json-editor-ajrm/es'
import locale from '@soon92/react-json-editor-ajrm/locale/ru'

import ErrorSpan from 'ErrorSpan'
import Validation from 'Validation'
import Subscribed from 'mixins/Subscribed'

import { valueToObject } from 'support'

@mixin(Subscribed)
@mixin(Validation)
export default class JsonEditor extends Component {
   static defaultProps = {
      name: 'text',
      value: "",
      wrapperClassName: null,
      placeholder: null,
      data: {},
      validations: {},
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      wrapperClassName: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      data: PropTypes.object,
      validations: PropTypes.object.isRequired,
   }

   // system
   state = { value: this.props.value }

   @flow('componentDidMountBefore')
   componentDidMount() {}

   @flow('componentWillUnmountBefore')
   componentWillUnmount() {}

   // events
   onChange(valueIn) {
      console.debug("[onChange] <<< valueIn:", valueIn["json"], valueIn)
      let object = valueToObject(this.props.name, valueIn["json"]),
          ce = new CustomEvent('dneslov-update-path', { detail: { value: object, path: this.props.name }})

      document.dispatchEvent(ce)
   }

   className() {
      return [ "input-field",
               this.props.wrapperClassName,
               this.getErrorText(this.props.value) && 'invalid' ].
         filter((x) => { return x }).join(" ")
   }

   renderValue() {
      if (this.state.value) {
         switch (this.state.value.constructor.name) {
            case "String":
               try {
                  return JSON.parse(this.state.value)
               } catch (e) {}
            case "Object":
               return this.state.value
         }
      }

      return {}
   }

   // NOTE: reset: false is required for the avoiding internal JSONInput error
   render() {
      console.log("[render] * this.props:", this.props, "this.state", this.state)

      return (
         <div
            className={this.className()}>
            <JSONInput
               id={this.props.name}
               locale={locale}
               onChange={this.onChange.bind(this)}
               placeholder={this.renderValue()}
               reset={false}
               theme="light_mitsuketa_tribute"
               height='15em'
               width='inherited' />
            <label
               className="active"
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.error && this.getErrorText(this.props.value)} />
            </label>
         </div>)
   }
}

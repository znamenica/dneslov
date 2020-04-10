import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { CharacterCounter } from 'materialize-css'

import ErrorSpan from 'ErrorSpan'
import Validation from 'Validation'

import { valueToObject } from 'support'

@mixin(Validation)
export default class TextArea extends Component {
   static defaultProps = {
      name: 'text',
      value: null,
      subname: null,
      wrapperClassName: null,
      title: null,
      placeholder: null,
      data: {},
      validations: {},
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      data: PropTypes.object,
      validations: PropTypes.object.isRequired,
   }

   // system
   componentDidMount() {
      if (this.props.data && this.props.data['length']) {
         this.counter = CharacterCounter.init(this.$input)
      }
   }

   componentDidUpdate() {
      console.debug("[componentDidUpdate] **", this.props )

      if (this.props.textArea) {
         M.textareaAutoResize(this.$input)
      }
   }

   componentWillUnmount() {
      if (this.counter) {
         this.counter.destroy()
         this.counter = null
      }
   }

   // events
   onChange(e) {
      console.log("[onChange] <<<")
      let object = valueToObject(this.props.name, e.target.value),
          ce = new CustomEvent('dneslov-update-path', { detail: object })

      document.dispatchEvent(ce)

      console.log(e.target.value, object)
   }

   render() {
      console.log("[render] * props:", this.props)
     
      return (
         <div
            className={"input-field " + this.props.wrapperClassName}>
            <textarea
               type='text'
               className={'materialize-textarea ' + (this.error && 'invalid' || '')}
               key={this.props.name}
               id={this.props.name}
               name={this.props.name}
               ref={c => {this.$input = c}}
               placeholder={this.props.placeholder}
               value={this.props.value || ''}
               data-length={this.props.data && this.props.data['length']}
               onChange={this.onChange.bind(this)} />
            <label
               className='active'
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.getErrorText(this.props.value)} /></label></div>)}}

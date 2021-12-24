import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { FormSelect } from 'materialize-css'

import ErrorSpan from 'ErrorSpan'
import Validation from 'Validation'
import { valueToObject } from 'support'

@mixin(Validation)
export default class SelectField extends Component {
   static defaultProps = {
      name: null,
      wrapperClassName: null,
      codeNames: null,
      validations: {},
      title: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      codeNames: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
   }

   // system
   componentDidMount() {
      this.select = FormSelect.init(this.$select, {
         optionParent: this.$parent,
         dropdownOptions: {
            coverTrigger: true,
            container: document.querySelector(".modal-content"),
         }})
      this.$wrap = this.$parent.querySelector('.select-wrapper')
   }

   componentWillUnmount() {
      console.log("[componentWillUnmount] <<<")
      this.select.destroy()
   }

   shouldComponentUpdate(nextProps, nextState) {
      return this.props.value !== nextProps.value
   }

   // events
   onChange(e) {
      let object = valueToObject(this.props.name, e.target.value),
          ce = new CustomEvent('dneslov-update-path', { detail: object })

      document.dispatchEvent(ce)
   }

   className() {
      return [ "input-field",
               this.props.wrapperClassName,
               this.getErrorText(this.props.value) && 'invalid' ].
         filter((x) => { return x }).join(" ")
   }

   render() {
      console.log(this.props)

      return (
         <div
            ref={e => this.$parent = e}
            className={this.className()}>
            <select
               ref={e => this.$select = e}
               className={this.error && 'invalid'}
               key={this.props.name}
               id={this.props.name}
               name={this.props.name}
               defaultValue={this.props.value || ''}
               required='required'
               onChange={this.onChange.bind(this)} />
            {Object.keys(this.props.codeNames).map((option) =>
               <option
                  {...{[option.length == 0 && 'disabled']: 'disabled'}}
                  key={option}
                  value={option} >
                  {this.props.codeNames[option]}</option>)}
            <label
               className='active'
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.getErrorText(this.props.value)} /></label></div>)}}

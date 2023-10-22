import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin, flow } from 'lodash-decorators'
import { FormSelect } from 'materialize-css'

import ErrorSpan from 'ErrorSpan'
import Validation from 'Validation'
import Subscribed from 'mixins/Subscribed'
import { valueToObject } from 'support'

@mixin(Subscribed)
@mixin(Validation)
export default class SelectField extends Component {
   static defaultProps = {
      name: null,
      wrapperClassName: null,
      codeNames: null,
      validations: {},
      title: null,
      value: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      codeNames: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
   }

   // system
   @flow('componentDidMountBefore')
   componentDidMount() {
      // workaround to avoid bug in react to findout a proper option
      let selected = this.$select.parentElement.querySelector('option[value="' + this.props.value + '"]')

      if (selected) {
         selected.setAttribute("selected", "")
      }

      this.select = FormSelect.init(this.$select, {
         optionParent: this.$parent,
         dropdownOptions: {
            coverTrigger: true,
            container: document.querySelector(".modal-content"),
         }})
      this.$wrap = this.$parent.querySelector('.select-wrapper')
   }

   @flow('componentWillUnmountBefore')
   componentWillUnmount() {
      console.log("[componentWillUnmount] <<<")
      this.select.destroy()
   }

   shouldComponentUpdate(nextProps, nextState) {
      console.debug("[shouldComponentUpdate] <<< nextProps: ", nextProps, "nextState: ", nextState)
      return this.props.value !== nextProps.value
   }

   // events
   onChange(e) {
      let object = valueToObject(this.props.name, e.target.value),
          ce = new CustomEvent('dneslov-update-path', { detail: { value: object, path: this.props.name }})

      document.dispatchEvent(ce)
   }

   className() {
      return [ "input-field",
               this.props.wrapperClassName,
               this.getErrorText(this.props.value) && 'invalid' ].
         filter((x) => { return x }).join(" ")
   }

   render() {
      console.log("[render] * this.props: ", this.props)

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
                  key={option}
                  value={option} >
                  {this.props.codeNames[option]}</option>)}
            <label
               className='active'
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.getErrorText(this.props.value)} /></label></div>)}}

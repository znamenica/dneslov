import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import Validation from 'Validation'
import ErrorSpan from 'ErrorSpan'

@mixin(Validation)
export default class TextField extends Component {
   static defaultProps = {
      name: 'text',
      subname: null,
      wrapperClassName: null,
      title: null,
      placeholder: null,
      textArea: false,
      data: {},
      validations: {},
      onUpdate: null,
      allowChange: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      data: PropTypes.object,
      validations: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
      allowChange: PropTypes.func,
   }

   state = {
      [this.props.name]: this.props[this.props.name] || '',
   }

   // system
   componentWillReceiveProps(nextProps) {
      if (this.state[this.props.name] != nextProps[this.props.name]) {
         this.setState({[this.props.name]: nextProps[this.props.name] || ''})
      }
   }

   shouldComponentUpdate(nextProps, nextState) {
      return this.state != nextState
   }

   componentDidMount() {
      if (this.props.data && this.props.data['length']) {
         $(this.$input).characterCounter()
      }
   }

   componentWillMount() {
      this.updateError(this.value())
   }

   componentWillUpdate(_, nextState) {
      this.updateError(this.value(nextState))
   }

   componentDidUpdate() {
      let real = this.value()

      if (this.props.subname) {
         real = {[this.props.subname]: real} // TODO add text as variable subkey
      }
      this.props.onUpdate({[this.props.name]: real})

      if (this.props.textArea) {
         $(this.$input).trigger('autoresize') //TODO don't work
      }
   }

   // events
   onChange(e) {
      this.setState({[this.props.name]: e.target.value})
   }

   // support
   value(state = this.state) {
      return state[this.props.name]
   }

   render() {
      return (
         <div
            className={this.props.wrapperClassName}>
            {this.props.textArea &&
               <textarea
                  type='text'
                  className={'materialize-textarea ' + (this.error && 'invalid' || '')}
                  key={this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  ref={c => {this.$input = c}}
                  placeholder={this.props.placeholder}
                  value={this.state[this.props.name] || ''}
                  data-length={this.props.data && this.props.data['length']}
                  onChange={this.onChange.bind(this)} />}
            {!this.props.textArea &&
               <input
                  type='text'
                  className={this.error && 'invalid'}
                  key={this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  ref={c => {this.$input = c}}
                  placeholder={this.props.placeholder}
                  value={this.state[this.props.name] || ''}
                  data-length={this.props.data && this.props.data['length']}
                  onChange={this.onChange.bind(this)} />}
            <label
               className='active'
               htmlFor='text'>
               {this.props.title}
               <ErrorSpan
                  key='error'
                  error={this.error}
                  ref={e => this.$error = e} /></label></div>)}}

import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import Validation from 'Validation'

@mixin(Validation)
export default class TextField extends Component {
   static defaultProps = {
      name: 'text',
      postfix: null,
      text: '',
      wrapperClassName: null,
      title: null,
      placeholder: null,
      data: {},
      validations: {},
      onUpdate: null,
      allowChange: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      postfix: PropTypes.string,
      text: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      data: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
      onUpdate: PropTypes.func.isRequired,
      allowChange: PropTypes.func,
   }

   state = {
      [this.props.name]: this.props.text || '',
   }

   error = this.updateError(this.props.text || '')

   fullname = [this.props.name, this.props.postfix].filter((e) => { return e }).join("_")

   componentDidMount() {
      if (this.props.data['length']) {
         $(this.$input).characterCounter()
      }
   }

   onChange(e) {
      let name = this.props.name, value = e.target.value, real = value
      this.updateError(value)

      this.setState({[name]: value})
      if (this.props.postfix) {
         real = {text: value}
      }
      this.props.onUpdate({[this.fullname]: real})
   }

   render() {
      //console.log(this.props.name, this.state[this.props.name])
      //console.log(this.props.data)

      return (
         <div
            className={this.props.wrapperClassName}>
            <input
               type='text'
               className={this.error && 'invalid'}
               key={this.props.name}
               id={this.props.name}
               name={this.props.name}
               ref={c => {this.$input = c}}
               placeholder={this.props.placeholder}
               value={this.state[this.props.name]}
               data-length={this.props.data['length']}
               onChange={this.onChange.bind(this)} />
            <label
               className='active'
               htmlFor='text'>
               {this.props.title}
               <div className="error">
                  {this.error}</div></label></div>)}}

import { Component } from 'react'
import PropTypes from 'prop-types'

export default class TextField extends Component {
   static defaultProps = {
      name: 'text',
      postfix: null,
      text: '',
      wrapperClassName: null,
      title: null,
      placeholder: null,
      onUpdate: null,
      allowChange: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      postfix: PropTypes.string,
      text: PropTypes.string,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
      allowChange: PropTypes.func,
   }

   state = {
      [this.props.name]: this.props.text || '',
   }

   onChange(e) {
      let name = this.props.name, value = e.target.value
      let allowChange = this.props.allowChange || this.allowChange

      if (! allowChange || allowChange(name, value)) {
         this.setState({[name]: value})
         let fullname = [name, this.props.postfix].filter((e) => { return e }).join("_")
         this.props.onUpdate({[fullname]: value})
      }
   }

   render() {
      console.log(this.props.name, this.state[this.props.name])

      return (
         <div
            className={'validate ' + this.props.wrapperClassName}>
            <input
               type='text'
               id='text'
               name='text'
               placeholder={this.props.placeholder}
               value={this.state[this.props.name]}
               onChange={this.onChange.bind(this)} />
            <label
               className='active'
               htmlFor='text'>
               {this.props.title}</label></div>)}}

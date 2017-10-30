import { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from 'TextField'
import LanguageField from 'LanguageField'
import AlphabethField from 'AlphabethField'

export default class LanguagedTextField extends Component {
   static defaultProps = {
      _id: null,
      text: '',
      language_code: 'цс',
      alphabeth_code: 'цс',
      title: 'Текст',
      placeholder: 'Введи текст',
      onUpdate: null,
   }

   static propTypes = {
      _id: PropTypes.string.isRequired,
      text: PropTypes.string,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.string,
      onUpdate: PropTypes.func.isRequired,
   }

   onChange(property) {
      this.props.onUpdate({[this.props._id]: property})
   }

   render() {
      return (
         <div className='row'>
            <TextField
               ref={'text'}
               key={'text'}
               title={this.props.title}
               placeholder={this.props.placeholder}
               text={this.props.text}
               validations={{[this.props.title + " отсутствует"]: /^$/}}
               wrapperClassName='input-field col xl6 l6 m12 s12'
               onUpdate={this.onChange.bind(this)} />
            <LanguageField
               ref={'language_code'}
               key={'language_code'}
               language_code={this.props.language_code}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChange.bind(this)} />
            <AlphabethField
               ref={'alphabeth_code'}
               key={'alphabeth_code'}
               alphabeth_code={this.props.alphabeth_code}
               wrapperClassName='input-field col xl3 l3 m6 s12'
               onUpdate={this.onChange.bind(this)} /></div>)}}

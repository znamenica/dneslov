import { Component } from 'react'
import PropTypes from 'prop-types'
import { merge } from 'merge-anything'
import { mixin } from 'lodash-decorators'

import TextField from 'TextField'
import LanguageField from 'LanguageField'
import AlphabethField from 'AlphabethField'
import ErrorSpan from 'ErrorSpan'
import { matchCodes, matchLetters } from 'matchers'
import Validation from 'Validation'

@mixin(Validation)
export default class LanguagedTextField extends Component {
   static defaultProps = {
      _id: null,
      key_name: null,
      textField: false,
      name: null,
      title: 'Текст',
      placeholder: 'Введи текст',
      validations: {},
      value_validations: {
         'Текст отсутствует': /^$/,
      },
   }

   static propTypes = {
      key_name: PropTypes.string.isRequired,
      name: PropTypes.string,
      value_validations: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
   }

   getTextClass() {
      if (this.props.textField) {
         return 'input-field col xl12 l12 m12 s12'
      } else {
         return 'input-field col xl6 l6 m12 s12'
      }
   }

   getSelectClass() {
      if (this.props.textField) {
         return 'input-field col xl6 l6 m12 s12'
      } else {
         return 'input-field col xl3 l3 m6 s12'
      }
   }

   nameForKey(key_name) {
      let name

      if (this.props.name) {
         name = this.props.name + '.' + key_name
      } else {
         name = key_name
      }

      return name
   }

   render() {
      console.log(this.props)

      return [
         <TextField
            key='value'
            title={this.props.title}
            placeholder={this.props.placeholder}
            name={this.nameForKey(this.props.key_name)}
            textArea={this.props.textField}
            validations={this.props.value_validations}
            wrapperClassName={this.getTextClass()}
            value={this.props.value[this.props.key_name]} />,
         <LanguageField
            key='languageCode'
            name={this.nameForKey('language_code')}
            value={this.props.value['language_code']}
            wrapperClassName={this.getSelectClass()} />,
         <AlphabethField
            key='alphabethCode'
            name={this.nameForKey('alphabeth_code')}
            value={this.props.value['alphabeth_code']}
            wrapperClassName={this.getSelectClass()} />,
         <ErrorSpan
            appendClassName='col xl12 l12 m12 s12'
            error={this.getErrorText(this.props.value)} />]}}

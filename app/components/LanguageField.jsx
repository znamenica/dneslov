import SelectField from 'SelectField'

export default class LanguageField extends SelectField {
   static defaultProps = {
      name: 'language_code',
      title: 'Язык',
      codeNames: {
         '': 'Избери язык...',
         'цс': 'Церковнославянский',
         'ру': 'Русский'
      },
   }
}

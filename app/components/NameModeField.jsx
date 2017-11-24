import SelectField from 'SelectField'

export default class NameModeField extends SelectField {
   static defaultProps = {
      name: 'mode',
      title: 'Связка',
      codeNames: {
         undefined: 'Без связки',
         'ored': 'Или...',
         'prefix': 'Префикс',
      },
   }
}

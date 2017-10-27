import SelectField from 'SelectField'

export default class AlphabethField extends SelectField {
   static defaultProps = {
      name: 'alphabeth_code',
      title: 'Азбука',
      codeNames: {
         '': 'Избери азбуку...',
         'цс': 'Церковнославянская кириллица',
         'ру': 'Русская азбука'
      },
      validations: {
         'Пункт из списка должен быть выбран': /^$/,
      }
   }
}

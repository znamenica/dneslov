import TextField from 'TextField'

export default class DateField extends TextField {
   static defaultProps = {
      name: 'date',
      title: 'Пора',
      placeholder: 'Введи пору',
      validations: {
         "Пора отсутствует": /^$/,
      }
   }
}

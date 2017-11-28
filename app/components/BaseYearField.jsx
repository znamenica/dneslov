import TextField from 'TextField'

export default class BaseYearField extends TextField {
   static defaultProps = {
      name: 'base_year',
      text: '',
      title: 'Опорный год',
      placeholder: 'Введи опорный год',
      data: {length: '5'},
      validations: {
         "Слишком длинное значение опорного года": /^.{6,}$/,
         "Опорный год отсутствует": /^$/,
         "В значении опорного года допустимы только цифры и знак минус": /[^0-9\\-]/,
         "Минус может только предварять число": /^.[\\-]{1,4}$/,
         "Цифры должны быть введены обязательно": /^-$/,
      }
   }
}

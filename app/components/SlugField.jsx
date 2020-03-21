import TextField from 'TextField'

export default class SlugField extends TextField {
   static defaultProps = {
      name: 'slug.text',
      value: '',
      title: 'Жетон',
      placeholder: 'Введи имя жетона',
      data: {length: '6'},
      validations: {
         "Слишком большое имя жетона": /^.{7,}$/,
         "Жетон отсутствует": /^$/,
         "В имени жетона допустимы только русская кириллица и цифры": /[^ёа-я0-9]/
      }
   }
}

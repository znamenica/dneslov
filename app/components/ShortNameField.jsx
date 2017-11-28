import TextField from 'TextField'

export default class ShortNameField extends TextField {
   static defaultProps = {
      name: 'short_name',
      text: '',
      title: 'Краткое имя',
      placeholder: 'Введи краткое имя',
      validations: {
         "Краткое имя отсутствует": /^$/,
         "В кратком имени допустимы только русские кириллические буквы, цифры и пробел": /[^А-Яа-яЁё0-9 ]/,
         "Все слова должны начинаться либо с заглавной буквы, либо с цифры": /(\b|^)[^А-Я0-9]/,
      }
   }
}

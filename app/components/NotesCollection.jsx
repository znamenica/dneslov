import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters } from 'matchers'

export default class NotesCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'notes',
      key_name: 'text',
      title: 'Заметки',
      action: 'Добавь заметку',
      single: 'Заметка',
      placeholder: 'Введи заметку',
      textField: true,
      validations: {
         "Языки в заметках не могут совпадать": matchLanguages,
         "Азбуки в заметках не могут совпадать": matchAlphabeths,
      },
      child_validations: {
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_value_validations: {
         "Заметка отсутствует": /^$/
      },
   }
}

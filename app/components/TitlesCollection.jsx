import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters } from 'matchers'

export default class TitlesCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'titles',
      key_name: 'text',
      title: 'Заголовки',
      action: 'Добавь заголовок',
      single: 'Заголовок',
      placeholder: 'Введи заголовок',
      textField: true,
      validations: {
         "Языки в заголовках не могут совпадать": matchLanguages,
         "Азбуки в заголовках не могут совпадать": matchAlphabeths,
      },
      child_validations: {
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_value_validations: {
         "Заголовок отсутствует": /^$/
      },
   }
}

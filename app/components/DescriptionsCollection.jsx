import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters } from 'matchers'

export default class DescriptionsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'descriptions',
      key_name: 'text',
      title: 'Описания',
      action: 'Добавь описание',
      single: 'Описание',
      placeholder: 'Введи описание',
      textField: true,
      validations: {
         "Языки в описаниях не могут совпадать": matchLanguages,
         "Азбуки в описаниях не могут совпадать": matchAlphabeths,
      },
      child_validations: {
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_value_validations: {
         "Описание отсутствует": /^$/
      },
   }
}

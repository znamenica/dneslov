import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters } from 'matchers'

export default class DescriptionsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'descriptions',
      title: 'Описания',
      action: 'Добавь описание',
      single: 'Описание',
      placeholder: 'Введи описание',
      validations: {
         "Языки в описаниях не могут совпадать": matchLanguages,
         "Азбуки в описаниях не могут совпадать": matchAlphabeths,
      },
      child_validations: {
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_text_validations: {
         "Описание отсутствует": /^$/
      },
   }
}

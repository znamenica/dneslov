import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes } from 'matchers'

export default class DescriptionsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'descriptions',
      key_name: 'text',
      title: 'Описания',
      action: 'Добавь описание',
      single: 'Описание',
      placeholder: 'Введи описание',
      textField: true,
      validations: {},
      child_validations: {
         'Избранный язык не соотвествует избранной азбуке': matchCodes,
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
       child_value_validations: {
         "Описание отсутствует": /^$/
      },
   }

   static validations = {
      "Языки в описаниях не могут совпадать": matchLanguages,
      "Азбуки в описаниях не могут совпадать": matchAlphabeths,
   }
}

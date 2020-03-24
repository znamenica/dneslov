import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes } from 'matchers'

export default class ShortNamesAsDescriptionsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'names',
      key_name: 'text',
      title: 'Короткие имена',
      action: 'Добавь короткое имя',
      single: 'Короткое имя',
      placeholder: 'Введи короткое имя',
      validations: {
         "Должно быть задано как минимум одно короткое имя": matchEmptyObject,
         "Языки в коротких именах не могут совпадать": matchLanguages,
         "Азбуки в коротких именах не могут совпадать": matchAlphabeths,
      },
      child_validations: {
         'Избранный язык не соотвествует избранной азбуке': matchCodes,
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_value_validations: {
         "Короткое имя отсутствует": /^$/
      },
   }
}

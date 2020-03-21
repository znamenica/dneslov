import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes } from 'matchers'

export default class NamesAsDescriptionsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'names',
      key_name: 'text',
      title: 'Имена',
      action: 'Добавь имя',
      single: 'Имя',
      placeholder: 'Введи имя',
      validations: {
         "Должно быть задано как минимум одно имя": matchEmptyObject,
         "Языки в именах не могут совпадать": matchLanguages,
         "Азбуки в именах не могут совпадать": matchAlphabeths,
      },
      child_validations: {
         'Избранный язык не соотвествует избранной азбуке': matchCodes,
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_value_validations: {
         "Имя отсутствует": /^$/
      },
   }
}

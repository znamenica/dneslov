import LanguagedCollection from 'LanguagedCollection'
import { matchLanguages, matchAlphabeths, matchLetters } from 'matchers'

export default class NamesCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'names',
      title: 'Имена',
      action: 'Добавь имя',
      single: 'Имя',
      placeholder: 'Введи имя',
      validations: {
         "Должно быть задано как минимум одно имя": (a) => { return a.length === 0 },
         "Языки в именах не могут совпадать": matchLanguages,
         "Азбуки в именах не могут совпадать": matchAlphabeths,
      },
      child_validations: {
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_text_validations: {
         "Имя отсутствует": /^$/
      },
   }
}

import LanguagedCollection from 'LanguagedCollection'
import UrlRegexp from 'UrlRegexp'
import { matchLanguages, matchAlphabeths } from 'matchers'

export default class PatericsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'paterics',
      key_name: 'url',
      title: 'Отечники',
      action: 'Добавь отечник',
      single: 'Отечник',
      placeholder: 'Введи ссылку на отечник',
      validations: {
         "Языки в ссылках не могут совпадать": matchLanguages,
         "Азбуки в ссылках не могут совпадать": matchAlphabeths,
      },
      child_value_validations: {
         "Ссылка отсутствует": /^$/,
         "Неверный формат ссылки на отечник": [ "!", UrlRegexp ],
      }
   }
}

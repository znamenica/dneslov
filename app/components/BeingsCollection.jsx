import LanguagedCollection from 'LanguagedCollection'
import UrlRegexp from 'UrlRegexp'
import { matchLanguages, matchAlphabeths } from 'matchers'

export default class BeingsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'beings',
      key_name: 'url',
      title: 'Бытия',
      action: 'Добавь ссылку на бытие',
      single: 'Ссылка',
      placeholder: 'Введи ссылку на бытие',
      validations: {
         "Языки в ссылках не могут совпадать": matchLanguages,
         "Азбуки в ссылках не могут совпадать": matchAlphabeths,
      },
      child_value_validations: {
         "Ссылка отсутствует": /^$/,
         "Неверный формат ссылки на бытие": [ "!", UrlRegexp ],
      }
   }
}

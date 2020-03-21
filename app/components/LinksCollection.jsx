import LanguagedCollection from 'LanguagedCollection'
import UrlRegexp from 'UrlRegexp'
import { matchLanguages, matchAlphabeths } from 'matchers'

export default class LinksCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'links',
      key_name: 'url',
      title: 'Ссылки',
      action: 'Добавь ссылку',
      single: 'Ссылка',
      placeholder: 'Введи ссылку',
      validations: {
         "Языки в ссылках не могут совпадать": matchLanguages,
         "Азбуки в ссылках не могут совпадать": matchAlphabeths,
      },
      child_value_validations: {
         "Ссылка отсутствует": /^$/,
         "Неверный формат ссылки": [ "!", UrlRegexp ],
      }
   }
}

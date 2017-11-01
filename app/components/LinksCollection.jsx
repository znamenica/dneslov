import LanguagedCollection from 'LanguagedCollection'
import UrlRegexp from 'UrlRegexp'
import { matchLanguages, matchAlphabeths } from 'matchers'

export default class LinksCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'links',
      title: 'Ссылки',
      action: 'Добавь ссылку',
      single: 'Ссылка',
      placeholder: 'Введи ссылку',
      validations: {
         "Языки в ссылках не могут совпадать": matchLanguages,
         "Азбуки в ссылках не могут совпадать": matchAlphabeths,
      },
      child_text_validations: {
         "Ссылка отсутствует": /^$/,
         "Неверный формат вики-ссылки": [ "!", UrlRegexp ],
      }
   }
}

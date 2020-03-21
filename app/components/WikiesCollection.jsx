import LanguagedCollection from 'LanguagedCollection'
import UrlRegexp from 'UrlRegexp'
import { matchLanguages, matchAlphabeths } from 'matchers'

export default class WikiesCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'wikies',
      key_name: 'url',
      title: 'Вики-ссылки',
      action: 'Добавь вики-ссылку',
      single: 'Вики-ссылка',
      placeholder: 'Введи вики-ссылку',
      validations: {
         "Языки в вики-ссылках не могут совпадать": matchLanguages,
         "Азбуки в вики-ссылках не могут совпадать": matchAlphabeths,
      },
      child_value_validations: {
         "Вики-ссылка отсутствует": /^$/,
         "Неверный формат вики-ссылки": [ "!", UrlRegexp ],
      }
   }
}

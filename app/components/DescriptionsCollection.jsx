import LanguagedCollection from 'LanguagedCollection'

export default class DescriptionsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'descriptions',
      title: 'Описания',
      action: 'Добавь описание',
      single: 'Описание',
      placeholder: 'Введи описание',
      validations: {
         "Языки в описаниях не могут совпадать": (array) => {
            let languages = array.map(c => {return c.language_code}).filter(c => { return c })
            languages.forEach((l, i) => {if (languages.indexOf(l, i + 1)) { return true }})
            return false
         },
         "Азбуки в описаниях не могут совпадать": (array) => {
            let alphabeths = array.map(c => {return c.alphabeth_code}).filter(c => { return c })
            alphabeths.forEach((a, i) => {if (alphabeths.indexOf(a, i + 1)) { return true }})
            return false
         },
      }
   }
}

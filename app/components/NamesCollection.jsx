import LanguagedCollection from 'LanguagedCollection'

export default class NamesCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'names',
      title: 'Имена',
      action: 'Добавь имя',
      single: 'Имя',
      placeholder: 'Введи имя',
      validations: {
         "Имена не могут отсутствовать": (a) => { return a.length === 0 },
         "Языки в именах не могут совпадать": (array) => {
            let languages = array.map(c => {return c.language_code}).filter(c => { return c })
            languages.forEach((l, i) => {if (languages.indexOf(l, i + 1)) { return true }})
            return false
         },
         "Азбуки в именах не могут совпадать": (array) => {
            let alphabeths = array.map(c => {return c.alphabeth_code}).filter(c => { return c })
            alphabeths.forEach((a, i) => {if (alphabeths.indexOf(a, i + 1)) { return true }})
            return false
         },
      }
   }
}

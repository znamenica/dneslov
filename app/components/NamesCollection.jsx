import LanguagedCollection from 'LanguagedCollection'

export default class NamesCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'names',
      title: 'Имена',
      action: 'Добавь имя',
      single: 'Имя',
      placeholder: 'Введи имя',
   }
}

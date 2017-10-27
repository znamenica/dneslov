import LanguagedCollection from 'LanguagedCollection'

export default class DescriptionsCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'descriptions',
      title: 'Описания',
      action: 'Добавь описание',
      single: 'Описание',
      placeholder: 'Введи описание',
   }
}

import LanguagedCollection from 'LanguagedCollection'

export default class LinksCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'links',
      title: 'Ссылки',
      action: 'Добавь ссылку',
      single: 'Ссылка',
      placeholder: 'Введи ссылку',
   }
}

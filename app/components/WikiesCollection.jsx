import LanguagedCollection from 'LanguagedCollection'

export default class WikiesCollection extends LanguagedCollection {
   static defaultProps = {
      name: 'wikies',
      title: 'Вики-ссылки',
      action: 'Добавь вики-ссылку',
      single: 'Вики-ссылка',
      placeholder: 'Введи вики-ссылку',
   }
}

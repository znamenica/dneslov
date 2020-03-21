import Records from 'Records'
import NameForm from 'NameForm'
import NameRow from 'NameRow'

export default class Names extends Records {
   static defaultProps = {
      keyName: 'name',
      keyNames: 'names',
      remoteNames: 'names',
      i18n: {
         title: 'Имена',
         new: 'Новое имя',
         headers: [ 'Написание',
                    'Язык',
                    'Азбука',
                    'Связка',
                    'Связано с...',
                    'Корневое имя' ],
         form: {
            close: 'Закрой',
            update: 'Обнови имя',
            create: 'Создай имя',
         }
      },
      form: NameForm,
      row: NameRow,
      names: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}

import Records from 'Records'
import CalendaryForm from 'CalendaryForm'
import CalendaryRow from 'CalendaryRow'

export default class Calendaries extends Records {
   static defaultProps = {
      keyName: 'calendary',
      keyNames: 'calendaries',
      remoteNames: 'calendaries',
      i18n: {
         title: 'Календари',
         new: 'Новый календарь',
         headers: [ 'Имя',
                    'thumb_up',
                    'Язык',
                    'Азбука',
                    'Автор',
                    'Дата',
                    'Собор' ],
         form: {
            close: 'Закрой',
            update: 'Обнови календарь',
            create: 'Создай календарь',
         }
      },
      form: CalendaryForm,
      row: CalendaryRow,
      calendaries: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}

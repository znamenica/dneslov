import Records from 'Records'
import CalendaryModal from 'CalendaryModal'
import CalendaryRow from 'CalendaryRow'

export default class Calendaries extends Records {
   static defaultProps = {
      keyName: 'calendary',
      keyNames: 'calendaries',
      remoteNames: 'calendaries',
      title: 'Календари',
      headers: [ 'Имя',
                 'thumb_up',
                 'Язык',
                 'Азбука',
                 'Автор',
                 'Дата',
                 'Собор' ],
      modal: CalendaryModal,
      row: CalendaryRow,
      calendaries: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}

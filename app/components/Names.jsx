import Records from 'Records'
import NameModal from 'NameModal'
import NameRow from 'NameRow'

export default class Names extends Records {
   static defaultProps = {
      keyName: 'name',
      keyNames: 'names',
      remoteNames: 'names',
      title: 'Имена',
      headers: [ 'Написание',
                 'Язык',
                 'Азбука',
                 'Связка',
                 'Связано с...',
                 'Корневое имя' ],
      modal: NameModal,
      row: NameRow,
      names: {
         list: [],
         page: 1,
         total: 0,
      },
   }
}

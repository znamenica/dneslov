import TextField from 'TextField'

export default class SlugField extends TextField {
   static defaultProps = {
      name: 'slug',
      postfix: 'attributes',
      title: 'Жетон',
      placeholder: 'Введи имя жетона'}

   allowChange(_, value) {
      return value.match(/^[ёа-я0-9]{0,6}$/)}}

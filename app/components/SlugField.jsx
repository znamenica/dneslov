import TextField from 'TextField'

export default class SlugField extends TextField {
   static defaultProps = {
      name: 'slug',
      postfix: 'attributes',
      slug: {text: ''},
      title: 'Жетон',
      placeholder: 'Введи имя жетона',
      data: {length: '6'},
      validations: {
         "Слишком большое имя жетона": /^.{7,}$/,
         "Жетон отсутствует": /^$/,
         "В имени жетона допустимы только кириллица и цифры": /[^ёа-я0-9]/
      }
   }

   state = {
      slug: this.props.slug.text
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.slug && this.state.slug != nextProps.slug.text) {
         this.setState({slug: nextProps.slug.text || ''})
         this.updateError(nextProps.slug.text || '')
      }
   }
}

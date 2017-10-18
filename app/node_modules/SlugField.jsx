import { Component } from 'react/lib/React'
import Input from 'react-materialize/src/Input'

export default class SlugField extends Component {
   static defaultProps = {
      slug: '',
      onUpdate: null,
   }

   constructor(props) {
      super(props)

      this.onChange = this.onChange.bind(this)
      this.state = {
         slug: this.props.slug,
      }
   }

   onChange = (e) => {
      this.setState({ slug: e.target.value })
      this.props.onUpdate('slug', { text: e.target.value })
   }

   render = () => {
      return (
            <Input
               type='text'
               id='text'
               name='text'
               divClassName='validate input-field col xl2 l2 m2 s6'
               labelClassName='active'
               label='Жетон'
               placeholder='Введи жетон'
               value={this.state.text}
               onChange={this.onChange} />)}}

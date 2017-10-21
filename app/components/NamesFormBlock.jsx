import { Component } from 'react/lib/React'
import TextField from 'TextField'

export default class NamesFormBlock extends Component {
   static defaultProps = {
      names: [],
      onUpdate: null,
   }

   constructor(props) {
      super(props)
      this.onAddName = this.onAddName.bind(this)

      this.state = {
         names: this.props.names,
      }
   }

   onAddName = (e) => {
      this.state.names.push({
         key: require('uuid/v1'),
         idx: this.state.names.length,
         id: '',
         text: '',
         language_code: '',
         alphabeth_code: '',
      })

      this.setState({
         names: this.state.names
      })
      this.props.onUpdate('names', this.state.names)
   }

   onChildUpdate = (idx, key, value) => {
      let name = this.state.names[idx]

      name[key] = value
      this.props.onUpdate('names', this.state.names)
   }

   render = () => {
      return (
         <div className='row'>
            <h5>Имена</h5>
            <div id="names">
               {this.state.names.map((name) => 
                  <TextField
                     key={name.key}
                     idx={name.idx}
                     text={name.text}
                     language_code={name.language_code}
                     alphabeth_code={name.alphabeth_code}
                     onUpdate={this.onChildUpdate} />)}
            </div>
            <button
               className='btn btn-primary'
               onClick={this.onAddName}
               type='button'>
               <i className='small material-icons'>add_to_photos</i>Добавь имя
            </button>
         </div>)}}

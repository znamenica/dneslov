import { Component } from 'react/lib/React'
import TextField from 'TextField'

export default class DescriptionsFormBlock extends Component {
   static defaultProps = {
      descriptions: []
   }

   constructor(props) {
      super(props)
      this.handleAddDescription = this.handleAddDescription.bind(this)

      this.state = {
         descriptions: this.props.descriptions,
      }
   }

   handleAddDescription = (e) => {
      this.state.descriptions.push({ id: this.state.descriptions.length })

      this.setState({
         descriptions: this.state.descriptions
      });
   }

   render = () => {
      return (
         <div className='row'>
            <h5>Описания</h5>
            <div id="descriptions">
               {this.state.descriptions.map((description) => <TextField key={description.id} description={description} />)}
            </div>
            <button
               className='btn btn-primary'
               onClick={this.handleAddDescription}
               type='button'>
               <i className='small material-icons'>add_to_photos</i>Добавь описание
            </button>
         </div>)}}

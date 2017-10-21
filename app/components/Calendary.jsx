import { Component } from 'react/lib/React'
import util from 'util'

export default class Calendary extends Component {
   static defaultProps = {
      calendary: {
         licit: false,
         language_code: '',
         alphabeth_code: '',
         author_name: '',
         date: '',
         council: ''
      }
   }

   constructor(props) {
      super(props)}

   render() {
      return (
         <tr>
            <td>{this.props.calendary.licit}</td>
            <td>{this.props.calendary.language_code}</td>
            <td>{this.props.calendary.alphabeth_code}</td>
            <td>{this.props.calendary.author_name}</td>
            <td>{this.props.calendary.date}</td>
            <td>{this.props.calendary.council}</td>
         </tr>)}}

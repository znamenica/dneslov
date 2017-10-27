import { Component } from 'react'

export default class Calendary extends Component {
   static defaultProps = {
      id: null,
      licit: null,
      language_code: null,
      alphabeth_code: null,
      author_name: '',
      date: '',
      council: '',
      onEdit: null,
      onRemove: null }

   static propTypes = {
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      licit: PropTypes.boolean.isRequired,
      language_code: PropTypes.string.isRequired,
      language_code: PropTypes.string.isRequired,
      author_name: PropTypes.string,
      date: PropTypes.string,
      council: PropTypes.string,
      onEdit: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
   }

   edit() {
      this.props.onEdit(this.props.id) }

   remove() {
      this.props.onRemove(this.props.id) }

   render() {
      return (
         <tr>
            <td>{this.props.name}</td>
            <td>
               {this.props.licit &&
                  <i className='tiny material-icons'>check</i>}</td>
            <td>{this.props.language_code}</td>
            <td>{this.props.alphabeth_code}</td>
            <td>{this.props.author_name}</td>
            <td>{this.props.date}</td>
            <td>{this.props.council}</td>
            <td className='actions'>
               <i
                  className='small material-icons'
                  onClick={this.edit.bind(this)}>
                  edit</i>
               <i
                  className='small material-icons'
                  onClick={this.remove.bind(this)}>
                  delete</i></td></tr>)}}

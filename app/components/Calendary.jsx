import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Calendary extends Component {
   static defaultProps = {
      locales: [],
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
      locales: PropTypes.array.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      licit: PropTypes.boolean.isRequired,
      language_code: PropTypes.string.isRequired,
      alphabeth_code: PropTypes.string.isRequired,
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

   getName() {
      console.log(this.props)
      let names = this.props.locales.map((locale) => {
         return this.props.names.reduce((res, name) => {
            return res || locale === name.language_code && name.text }, null)
      }).filter((e) => { return e })

      return names[0] || ''
   }

   render() {
      return (
         <tr>
            <td>{this.getName()}</td>
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

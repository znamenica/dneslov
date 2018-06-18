import { Component } from 'react'
import PropTypes from 'prop-types'

export default class CalendaryRow extends Component {
   static defaultProps = {
      locales: [],
      id: null,
      slug: null,
      licit: null,
      language_code: null,
      alphabeth_code: null,
      author_name: '',
      date: '',
      council: '',
      onEdit: null,
      onRemove: null
   }

   static propTypes = {
      locales: PropTypes.array.isRequired,
      id: PropTypes.number.isRequired,
      slug: PropTypes.string.isRequired,
      names: PropTypes.array.isRequired,
      licit: PropTypes.bool.isRequired,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.string,
      author_name: PropTypes.string,
      date: PropTypes.string,
      council: PropTypes.string,
      onEdit: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
   }

   componentWillMount() {
      this.name = this.makeName()
   }

   componentWillReceiveProps(nextProps) {
      if (this.props.names != nextProps.names) {
         this.name = this.makeName()
      }
   }

   edit() {
      this.props.onEdit(this.props.id)
   }

   remove() {
      let toast = document.querySelector('.toast-wrapper.id' + this.props.id).parentElement

      this.toast.dismiss()
      toast.remove()
      this.props.onRemove(this.props.id)
   }

   removeQuery() {
      let toast = {
         displayLength: 10000,
         classes: 'rounded',
         html: this.$toast.innerHTML,
      }

      this.toast = M.toast(toast)

      document.querySelector('.toast.rounded > .toast-action')
              .addEventListener('click', this.remove.bind(this))
   }

   makeName() {
      let names = this.props.locales.map((locale) => {
         return this.props.names.reduce((res, name) => {
            return res || locale === name.language_code && name.text }, null)
      }).filter((e) => { return e })
      
      console.log("NAMES", names, this.props.names, this.props.locales)
      return names[0] || ''
   }

   render() {
      return (
         <tr>
            <td>{this.name}</td>
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
                  onClick={this.removeQuery.bind(this)}>
                  delete</i>
               <div
                  className={'toast-wrapper id' + this.props.id}
                  key='toast'
                  ref={e => this.$toast = e} >
                  <span>Точно ли удалить календарь "{this.name}"?</span>
                  <button
                     className="btn-flat toast-action"
                     onClick={this.remove.bind(this)}>
                     Да</button></div>
                  </td></tr>)}}

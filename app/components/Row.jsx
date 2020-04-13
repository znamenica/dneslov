import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Row extends Component {
   shouldComponentUpdate(nextProps, nextState) {
      return this.props.value !== nextProps.value
   }

   // custom
   edit() {
      this.props.onEdit(this.props.value.id)
   }

   remove() {
      let toast = document.querySelector('.toast-wrapper.id' + this.props.value.id).parentElement

      this.toast.dismiss()
      toast.remove()
      this.props.onRemove(this.props.value.id)
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

   default() {
      return this.props.meta[this.props.default].title
   }

   t(title) {
      return title.replace(/%default/, () => { return this.default() })
   }

   render() {
      console.log("[render] * props", this.props)

      return (
         <tr>
            {Object.entries(this.props.meta).map(([name, element]) => {
               return <td>{element.value &&
                           element.value(this.props.value, this.props) ||
                           this.props.value[name]}</td>
            })}
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
                  className={'toast-wrapper id' + this.props.value.id}
                  key='toast'
                  ref={e => this.$toast = e} >
                  <span>{this.t(this.props.remove.title)}</span>
                  <button
                     className="btn-flat toast-action"
                     onClick={this.remove.bind(this)}>
                     {this.props.remove.yes}</button></div>
                  </td></tr>)}}

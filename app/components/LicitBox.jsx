import { Component } from 'react'
import PropTypes from 'prop-types'

export default class LicitBox extends Component {
   static defaultProps = {
      licit: null,
      wrapperClassName: null,
      onUpdate: null,
   }

   static propTypes = {
      licit: PropTypes.boolean.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      licit: this.props.licit
   }

   componentWillReceiveProps(nextProps) {
      this.setState({licit: nextProps.licit})
   }

   onCheck(e) {
      this.setState({licit: e.target.checked})
      this.props.onUpdate('licit', e.target.checked)
   }

   render() {
      return (
         <div
            className={this.props.wrapperClassName}>
            <input
               key='licit'
               type='checkbox'
               id='licit'
               name='licit'
               onChange={this.onCheck.bind(this)}
               checked={this.state.licit} />
            <label
               htmlFor='licit'>
               Опубликовать</label></div>)}}

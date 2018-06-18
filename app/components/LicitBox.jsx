import { Component } from 'react'
import PropTypes from 'prop-types'

export default class LicitBox extends Component {
   static defaultProps = {
      licit: null,
      wrapperClassName: null,
      onUpdate: null,
   }

   static propTypes = {
      licit: PropTypes.bool.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      licit: this.props.licit || false
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps != this.props) {
         this.setState({licit: nextProps.licit || false})
      }
   }

   onCheck(e) {
      let value = e.target.checked

      this.setState({licit: value})
      this.props.onUpdate({licit: value})
   }

   render() {
      return (
         <div
            className={this.props.wrapperClassName}>
            <label>
               <input
                  type='checkbox'
                  onChange={this.onCheck.bind(this)}
                  checked={this.state.licit} />
               <span>
                  Опубликовать</span></label></div>)}}

import { Component } from 'react'
import PropTypes from 'prop-types'

export default class BooleanBox extends Component {
   static defaultProps = {
      name_key: null,
      title: null,
      wrapperClassName: null,
      onUpdate: null,
   }

   static propTypes = {
      name_key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      [this.props.name_key]: this.props[this.props.name_key] || false
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps != this.props) {
         this.setState({[this.props.name_key]: nextProps[nextProps.name_key] || false})
      }
   }

   onCheck(e) {
      let value = e.target.checked

      this.setState({[this.props.name_key]: value})
      this.props.onUpdate({[this.props.name_key]: value})
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div
            className={this.props.wrapperClassName}>
            <label>
               <input
                  type='checkbox'
                  onChange={this.onCheck.bind(this)}
                  checked={this.state[this.props.name_key]} />
               <span>
                  {this.props.title}</span></label></div>)}}

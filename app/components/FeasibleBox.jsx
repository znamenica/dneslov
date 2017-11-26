import { Component } from 'react'
import PropTypes from 'prop-types'

export default class FeasibleBox extends Component {
   static defaultProps = {
      feasibly: null,
      wrapperClassName: null,
      onUpdate: null,
   }

   static propTypes = {
      feasibly: PropTypes.boolean.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      feasibly: this.props.feasibly
   }

   componentWillReceiveProps(nextProps) {
      this.setState({feasibly: nextProps.feasibly})
   }

   onCheck(e) {
      console.log(11111)
      let value = e.target.checked

      this.setState({feasibly: value})
      this.props.onUpdate('feasibly', value)
   }

   render() {
      console.log(22222, this.state.feasibly)

      return (
         <div
            className={this.props.wrapperClassName}>
            <input
               key='feasibly'
               type='checkbox'
               id='feasibly'
               name='feasibly'
               onChange={this.onCheck.bind(this)}
               checked={this.state.feasibly} />
            <label
               htmlFor='feasibly'>
               Вероятное</label></div>)}}

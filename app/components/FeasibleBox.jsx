import { Component } from 'react'
import PropTypes from 'prop-types'

// TODO this can't be used in arrays since the only first box is checked at all
export default class FeasibleBox extends Component {
   static defaultProps = {
      feasible: null,
      wrapperClassName: null,
      onUpdate: null,
   }

   static propTypes = {
      feasible: PropTypes.bool.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      feasible: this.props.feasible || false
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps != this.props) {
         this.setState({feasible: nextProps.feasible || false})
      }
   }

   onCheck(e) {
      let value = e.target.checked

      this.setState({feasible: value})
      this.props.onUpdate({feasible: value})
   }

   render() {
      console.log(this.props)
      console.log(this.state)

      return (
         <div
            className={this.props.wrapperClassName}>
            <input
               key='feasible'
               type='checkbox'
               id='feasible'
               name='feasible'
               onChange={this.onCheck.bind(this)}
               checked={this.state.feasible} />
            <label
               htmlFor='feasible'>
               Вероятное</label></div>)}}

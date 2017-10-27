import { Component } from 'react'
import PropTypes from 'prop-types'

export default class SelectField extends Component {
   static defaultProps = {
      name: null,
      value: null,
      wrapperClassName: null,
      codeNames: null,
      title: null,
      onUpdate: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      codeNames: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

   state = {
      value: this.props.value || ''
   }

   componentDidMount() {
      $(this.$el).material_select()
      $(this.$el).on('change', this.onChange.bind(this))
   }

   componentWillUnmount() {
      $(this.$el).off('change', this.onChange.bind(this))
      $(this.$el).material_select('destroy')
   }

   componentWillReceiveProps(nextProps) {
      this.setState({[this.props.name]: nextProps.value})
   }

   onChange(e) {
      let value = e.target.value

      this.setState({[this.props.name]: value})
      this.props.onUpdate({[this.props.name]: value})
   }

   render() {
      return (
         <div
            className={this.props.wrapperClassName}>
            <select
               ref={$el => this.$el = $el}
               key={this.props.name}
               id={this.props.name}
               name={this.props.name}
               value={this.state.value}
               required='required'>
               {Object.keys(this.props.codeNames).map((option) =>
                  <option
                     {...{[option.length == 0 && 'disabled']: 'disabled'}}
                     key={option}
                     value={option} >
                     {this.props.codeNames[option]}</option>)}</select>
            <label
               htmlFor={this.props.name}>
               {this.props.title}</label></div>)}}

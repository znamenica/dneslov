import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Name extends Component {
   static defaultProps = {
      names: [],
      short_name: null,
      default_name_in_calendary: null,
   }

   static propTypes = {
      names: PropTypes.array.isRequired,
   }

   getFirstName() {
      let names = [
         'благословенное',
         'схимное',
         'иноческое',
         'чернецкое',
         'покаянное',
         'крещенское',
         'самоданное',
         'наречёное' ]

      return this.getNameFor(names)
   }

   getNickName() {
      let names = [
         'прозвание' ]

      return this.getNameFor(names)
   }
    
   getPatronymicName() {
      let names = [
         'отчество_принятое',
         'отчество' ]

      return this.getNameFor(names)
   }

   getLastName() {
      let names = [
         'мужнина',
         'наречёная',
         'самоданная',
         'отечья',
         'матерня', ]

      return this.getNameFor(names)
   }

   getFeatName() {
      let names = [
         'подвига_святительства',
         'подвига҆_отшельничества',
         'подвига_пастырства',
         'подвига_мученичества',
         'подвига_страстотерпчества',
         'подвига_исповедничества',
         'подвига_дияконства',
         'подвига_чтецтва',
         'подвига_учительства',
         'подвига_мученичества',
         'подвига_страстотерпчества',
         'подвига_исповедничества', ]

      return this.getNameFor(names)
   }

   getNameFor(names) {
      let name = this.props.names.find((name) => {
         return names.find((n) => { return n == name.state })})

      return name && name.name
   }

   hasName() {
      return this.props.names.reduce((s, name) => { return s || name.state }, false)
   }

   render() {
      return (
         <span>
            {this.props.default_name_in_calendary &&
               <span
                  className='name short'>
               {this.props.default_name_in_calendary}</span>}
            {!this.props.default_name_in_calendary && this.hasName() &&
               [
                  <span
                     className='name first'>
                     {this.getFirstName()}</span>,
                  <span
                     className='name nick'>
                     {this.getNickName()}</span>,
                  <span
                     className='name last'>
                     {this.getLastName()}</span>,
                  <span
                     className='name feat'>
                     {this.getFeatName()}</span>]}
            {!this.props.default_name_in_calendary && !this.hasName() &&
               <span
                  className='name short'>
                  {this.props.short_name}</span>}</span>)}}

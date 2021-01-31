import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Name extends Component {
   static defaultProps = {
      names: [],
      klugs: [],
      short_name: null,
      defaultNameInCalendary: null,
   }

   static propTypes = {
      names: PropTypes.array.isRequired,
   }

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return {
            prevProps: props,
            fullName: Name.generateFullName(props),
         }
      }

      return null
   }

   static generateFullName(props) {
      //return 
      let fullName = [
         this.getFirstName(props),
         this.getNickName(props),
         this.getLastName(props),
         this.getFeatName(props)
      ].compact()

      return fullName.isPresent && fullName.slice(0, 2).join(" ") || props.defaultNameInCalendary
   }

   static getFirstName(props) {
      let preprios = [
         'благословенное',
         'схимное',
         'иноческое',
         'чернецкое',
         'покаянное',
         'крещенское',
         'самоданное',
         'наречёное' ]

      let prios = this.priorities.reduce((pp, prio) => {
         let _prios = props.klugs.reduce((p, nameKlug) => {
            return p.isBlank && prio['klugs'].includes(nameKlug) && prio['states'] || p
         }, [])

         return _prios.concat(pp)
      }, preprios).uniq()

      let names = this.getNamesFor(prios, props.names)
      //console.log("QQQQQQQQQQQQQ1", prios, names)

      return names.isPresent() && (names[0] && names[0].text + (names[1] && " (" + names[1].text + ")" || ""))
   }

   static getNickName(props) {
      let prios = [
         'прозвание' ]

      return this.getNameFor(prios, props.names)
   }

   static getLastName(props) {
      let prios = [
         'мужнина',
         'наречёная',
         'самоданная',
         'отечья',
         'матерня', ]

      return this.getNameFor(prios, props.names)
   }

   static getFeatName(props) {
      let prios = [
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

      return this.getNameFor(prios, props.names)
   }

   static priorities = [
      {
         klugs: ['свщмч', 'свмчр', 'прав', 'правж', 'сщпр', 'муч', 'муц', 'мучр', 'муцр', 'вмч', 'вмц', 'смчр', 'блж', 'блжц', 'блгв', 'блгвц', 'бср', 'испв', 'стц', 'стца', 'сщстц', 'испв', 'иср', 'исц', 'ицр', 'свщисп', 'свщиср'],
         states: [ 'покаянное', 'крещенское' ],
      },
      {
         klugs: ['прпжн', 'прпк', 'прпп', 'прпмч', 'прмчр', 'прпмц', 'прмцр', 'блпр', 'мчсвт', 'мчсвтр', 'стцсвт', 'прстц', 'прстца', 'прписп', 'прписр', 'прписц', 'прпицр', 'исвт', 'иссвтр', 'прпст', 'прпсж', 'свтл', 'прпсвт'],
         states: [ 'схимное', 'иноческое', 'чернецкое' ],
      },
      {
         klugs: ['прор', 'апс'],
         states: [ 'наречёное' ],
      },
      {
         klugs: ['рапс', 'рапж'],
         states: [ 'наречёное', 'покаянное', 'крещенское' ],
      }
   ]

   static getNamesFor(prios, names_in) {
      let names = prios.map((prio) => {
      //console.log("WWWWEEEE", prio, names_in)
         return names_in.find((name) => { 
      //console.log("WWWWEEEE", prio, name)
            return prio == name.state_code })
      }).compact()

      //console.log("WWWWWWWWWWWwww", names, prios)

      return names
   }

   static getNameFor(prios, props) {
      let names = this.getNamesFor(prios, props)

      return names.isPresent() && names[0] && names[0].text
   }

   state = {}

   render() {
      console.log("[render] *", { 'this.props': this.props, 'this.state': this.state })

      return (
         <span
            className='name'>
               {this.state.fullName}</span>
      )
   }}

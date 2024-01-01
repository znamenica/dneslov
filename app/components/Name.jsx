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
         let fullName = Name.generateFullName(props)

         return {
            prevProps: props,
            fullName: fullName,
            autoName: fullName || props.defaultNameInCalendary || props.short_name,
         }
      }

      return null
   }

   static generateFullName(props) {
      let names = props.names.sort((a, b) => { return a.level < b.level }),
          fullName = [
         this.getFirstName(props, names),
         this.getNickName(props, names),
         this.getLastName(props, names),
         this.getFeatName(props, names)
      ].compact().flat()

      console.debug("[generateFullName] **", fullName, "from:", names)

      return fullName.slice(0, 3).join(" ")
   }

   static getFirstName(props, namesIn) {
      let preprios = [
         'благословенное',
         'схимное',
         'иноческое',
         'чернецкое',
         'покаянное',
         'крещенское',
         'самоданное' ]

      let prios = this.priorities.reduce((pp, prio) => {
         let _prios = props.klugs.reduce((p, nameKlug) => {
            return p.isBlank() && prio['klugs'].includes(nameKlug) && prio['states'] || p
         }, [])

         return _prios.concat(pp)
      }, preprios).uniq()

      let names = this.getNamesFor(prios, namesIn),
          secondaries = [] // namesIn.slice(1,-1).map((n) => n.name_text).compact()

      return names.isPresent() ? (names[0] && names[0].name_text + " " + (secondaries.isPresent() ? "(" + secondaries.join(", ") + ")" : "")) : ""
   }

   static getNickName(props, namesIn) {
      let prios = [
         'прозвание',
         'наречёное' ]

      console.debug("[getNickName] <<< *********** ", namesIn)
      console.debug("[getNickName] <<< *********** ", this.getNameFor(prios, namesIn, 4))
      return this.getNameFor(prios, namesIn, 4)
   }

   static getLastName(props, namesIn) {
      let prios = [
         'мужнина',
         'наречёная',
         'самоданная',
         'отечья',
         'матерня', ]

      return this.getNameFor(prios, namesIn)
   }

   static getFeatName(props, namesIn) {
      let prios = [
         'подвига_святительства',
         'подвига_отшельничества',
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

      return this.getNameFor(prios, namesIn)
   }

   static kinds = [
         "переложеное",
         "прилаженое",
         "переводное",
         "несвязаное",
      ]

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

   static getNamesFor(prios, namesIn) {
      console.debug("[getNamesFor] <<< prios:", prios, "namesIn:", namesIn)

      let names = prios.filterMap((prio) => {
         return Name.kinds.filterMap((k) => {
            return namesIn.find((name) => {
               return prio == name.state_code && name.name_bind_kind_name == k
            })
         })
      }).flat()

      console.debug("[getNamesFor] >>>", names)

      return names
   }

   static getNameFor(prios, props, count = 1) {
      let names = this.getNamesFor(prios, props)

      return names.slice(0, count - 1).map((n) => { return n.name_text }).join(", ")
   }

   state = {}

   properUrl() {
      let url = this.props.url.replace(/^http:\/\//, 'https://')

      return url
   }

   render() {
      console.log("[render] *", { 'this.props': this.props, 'this.state': this.state })

      return (
         <span
            className='name'>
            {this.props.url &&
               <a
                  href={this.properUrl()}
                  target='_self' >
                  {this.state.autoName}</a>}
            {! this.props.url && this.state.autoName}</span>
      )
   }
}

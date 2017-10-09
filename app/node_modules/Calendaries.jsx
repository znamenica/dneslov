import { Component } from 'react/lib/React'
import CalendaryForm from 'CalendaryForm'
import Calendary from 'Calendary'

export default class Calendaries extends Component {
   static defaultProps = {
      data: []
   }

   state = {
      calendaries: this.props.data
   }

   addCalendary(calendary) {
      calendaries = this.state.calendaries.slice()
      calendaries.push(calendary)
      this.setState({ calendaries: calendaries }) }

   render() {
      return (
         <div className='calendaries'>
            <h4 className='title'>Календари</h4>
            <CalendaryForm />
            <hr />
            <table className='striped responsive-table'>
               <thead>
                  <tr>
                     <th>Опубликован</th>
                     <th>Язык</th>
                     <th>Азбука</th>
                     <th>Автор</th>
                     <th>Дата</th>
                     <th>Собор</th>
                  </tr>
               </thead>
               <tbody>
                  {this.state.calendaries.map((calendary) => <Calendary key={calendary.id} calendary={calendary} />)}
               </tbody>
            </table>
         </div>
      )}}

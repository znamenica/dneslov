import { Component } from 'react'
import CalendaryModal from 'CalendaryModal'
import Calendary from 'Calendary'

export default class Calendaries extends Component {
   static defaultProps = {
      data: []
   }

   state = {
      calendaries: this.props.data,
      current: {}
   }

   addCalendary(calendary) {
      calendaries = this.state.calendaries.slice()
      calendaries.push(calendary)
      this.setState({ calendaries: calendaries })}

   onCalendaryEdit(id) {
      let calendary = this.state.calendaries.find((c) => { return c.id === id })
      this.setState({current: calendary})
   }

   onCalendaryRemove(id) {
      let index = this.state.calendaries.findIndex((c) => { return c.id === id })
      delete calendaries[index]
   }

   render() {
      console.log(this.state)

      return (
         <div className='calendaries'>
            <div className="row">
               <div className="col m8 s6">
                  <h4
                     className='title'>
                     Календари</h4></div>
               <div className="col m4 s6">
                  <CalendaryModal
                     open={this.state.current.length !== 0}
                     {...this.state.current}
                     ref={$form => this.$form = $form} /></div></div>
            <hr />
            <table className='striped responsive-table'>
               <thead>
                  <tr>
                     <th>Имя</th>
                     <th><i className='tiny material-icons'>thumb_up</i></th>
                     <th>Язык</th>
                     <th>Азбука</th>
                     <th>Автор</th>
                     <th>Дата</th>
                     <th>Собор</th>
                     <th><i className='tiny material-icons'>near_me</i></th></tr></thead>
               <tbody>
                  {this.state.calendaries.map((calendary) =>
                     <Calendary
                        key={calendary.id}
                        {...calendary}
                        onEdit={this.onCalendaryEdit.bind(this)}
                        onRemove={this.onCalendaryRemove.bind(this)} />)}</tbody></table></div>)}}

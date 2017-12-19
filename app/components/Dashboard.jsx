import { Component } from 'react'

import Calendaries from 'Calendaries'
import Memories from 'Memories'
import Names from 'Names'
import Memoes from 'Memoes'

export default class Dashboard extends Component {
   state = { form: null }

   onClick(list, e) {
      console.log("list", list, e)

      this.setState({ form: list })
   }

   render() {
      console.log("state", this.state)

      return (
         [<header>
            <nav className='terracota'>
               <div className="nav-wrapper">
                  <a className='brand-logo'
                     href='/'>
                     Днесловъ</a>
                  <ul id="nav-mobile" className="right hide-on-med-and-down">
                     <li>
                        <a
                           href="#calendaries"
                           onClick={this.onClick.bind(this, Calendaries)} >
                           Календари</a></li>
                     <li>
                        <a
                           href="#memories"
                           onClick={this.onClick.bind(this, Memories)} >
                           Памяти</a></li>
                     <li>
                        <a
                           href="#names"
                           onClick={this.onClick.bind(this, Names)} >
                           Имена</a></li>
                     <li>
                        <a
                           href="#memoes"
                           onClick={this.onClick.bind(this, Memoes)} >
                           Помины</a></li></ul></div></nav></header>,
      <main>
         <div className='container admin'>
            <div className='row'>
               <div className='col s12 m12 l12 xl12'>
                  <div id='page'>
                     {this.state.form &&
                        <this.state.form
                           locales={this.props.locales} />}</div></div></div></div></main>])}}

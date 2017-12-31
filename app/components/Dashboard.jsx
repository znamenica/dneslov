import { Component } from 'react'
import GitHubLogin from 'react-github-login'
import * as assign from 'assign-deep'

import Calendaries from 'Calendaries'
import Memories from 'Memories'
import Names from 'Names'
import Memoes from 'Memoes'

export default class Dashboard extends Component {
   state = assign({}, this.props, { form: null })

   // system
   componentDidMount() {
      this.$$avatarTap = $(this.$avatarTap)
   }

   componentDidUpdate() {
      this.$$avatarTap = $(this.$avatarTap)
   }

   // events
   onClick(list, e) {
      console.log("list", list, e)

      this.setState({ form: list })
   }

   onLoginSuccess(data) {
      this.setState(data)
   }

   onLoginFailure(e) {
      console.error("Sign-in error: " + e.error)
   }

   onAvatarClick(e) {
      this.$$avatarTap.tapTarget('open')
   }

   // props
   isAvatarTappen() {
      return !!this.$avatarSignIn.querySelector('.tap-target-wrapper.open')
   }

   name() {
      let name

      if (this.state.name) {
         name = this.state.name + ' {' + this.state.login + '}'
      } else {
         name = this.state.login
      }

      return name
   }

   info() {
      return [ this.state.info, this.state.location ].filter(e => { return e }).join("\n")
   }

   render() {
      console.log("state", this.state)

      return (
         [<header>
            <nav className='terracota'>
               <div className="nav-wrapper admin">
                  <a className='brand-logo'
                     href='/'
                     alt="Днеслов">
                     <img
                        src="dneslov-title.png" /></a>
                  {this.state.login &&
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
                              Помины</a></li>
                        <li>
                           <div
                              ref={e => this.$avatarSignIn = e}
                              key='avatarSignIn'
                              className='sign-in circle'>
                              <img
                                 id='avatar'
                                 className='circle z-depth-1 waves-effect'
                                 onClick={this.onAvatarClick.bind(this)}
                                 src={this.state.avatar_url} />
                              <div
                                 key='avatarTap'
                                 ref={e => this.$avatarTap = e}
                                 className='tap-target'
                                 data-activates='avatar'>
                                 <div
                                    className='tap-target-content'>
                                    <h5>
                                       {this.name()}</h5>
                                    <p>
                                       {this.info()}</p></div></div></div></li></ul>}
                  {!this.state.login && this.state.client_id &&
                     <div className="right">
                        <GitHubLogin
                           clientId={this.state.client_id}
                           redirectUri={this.state.redirect_url}
                           className='sign-in btn-floating btn-large waves-effect waves-light'
                           requireCode={false}
                           onSuccess={this.onLoginSuccess.bind(this)}
                           onFailure={this.onLoginFailure.bind(this)}>
                           <i
                              className="material-icons">
                              perm_identity</i></GitHubLogin></div>}
                  </div></nav></header>,
      <main>
         <div className='container admin'>
            <div className='row'>
               <div className='col s12 m12 l12 xl12'>
                  <div id='page'>
                     {this.state.form &&
                        <this.state.form
                           locales={this.state.locales} />}</div></div></div></div></main>])}}

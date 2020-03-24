import { Component } from 'react'
import GitHubLogin from 'react-github-login'
import { merge } from 'merge-anything'

import Calendaries from 'Calendaries'
import Memories from 'Memories'
import Names from 'Names'
import Memoes from 'Memoes'
import Orders from 'Orders'

const Pages = {
   'calendaries': {
      object: Calendaries,
      title: "Календари",
   },
   'memories': {
      object: Memories,
      title: "Памяти",
   },
   'names': {
      object: Names,
      title: "Имена",
   },
   'memoes': {
      object: Memoes,
      title: "Помины",
   },
   'orders': {
      object: Orders,
      title: "Чины",
   }
}

export default class Dashboard extends Component {
   state = merge({}, this.props, { form: null })

   // system
   static getDerivedStateFromProps(_, state) {
      if (! state.form) {
         let parts = window.location.href.split("#")

         if (parts[1]) {
            return { form: Pages[parts[1].object] }
         }
      }

      return null
   }

   componentDidMount() {
      this.avatarTap = M.TapTarget.init(this.$avatarTap, {})
   }

   componentWillUnmount() {
      if (this.avatarTap) {
         this.avatarTap.destroy()
      }
   }

   componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo)
   }

   // events
   onClick(list, e) {
      this.setState({ form: list })
   }

   onLoginSuccess(data) {
      this.setState(data)
   }

   onLoginFailure(e) {
      console.error("Sign-in error: " + e.error)
   }

   onAvatarClick(e) {
      this.avatarTap.open()
   }

   // props
   isAvatarTappen() {
      return !!this.$avatarSignIn.querySelector('.tap-target-wrapper.open')
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
                        {Object.entries(Pages).map(([path, data]) =>
                           <li>
                              <a
                                 href={"#" + path}
                                 onClick={this.onClick.bind(this, data.object)} >
                                 {data.title}</a></li>)}
                        <li>
                           <div
                              ref={e => this.$avatarSignIn = e}
                              key='avatarSignIn'
                              className='sign-in circle'>
                              <img
                                 id='avatar'
                                 className='circle z-depth-1 responsive-img'
                                 onClick={this.onAvatarClick.bind(this)}
                                 src={this.state.avatar_url} />
                              <div
                                 key='avatarTap'
                                 ref={e => this.$avatarTap = e}
                                 className='tap-target'
                                 data-target='avatar'>
                                 <div
                                    className='tap-target-content'>
                                    <h6>
                                       @{this.state.login}</h6>
                                    <h5>
                                       {this.state.name}</h5>
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
      <main key='main'>
         <div className='container admin'>
            <div className='row'>
               <div className='col s12 m12 l12 xl12'>
                  <div id='page'>
                     {this.state.form && this.state.login &&
                        <this.state.form
                           locales={this.state.locales} />}</div></div></div></div></main>])}}

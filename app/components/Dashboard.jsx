import { Component } from 'react'
import GitHubLogin from 'react-github-login'
import { merge } from 'merge-anything'

import { calendaryMeta } from 'calendaryMeta'
import { memoryMeta } from 'memoryMeta'
import { nameMeta } from 'nameMeta'
import { memoMeta } from 'memoMeta'
import { orderMeta } from 'orderMeta'
import { subjectMeta } from 'subjectMeta'
import { scriptumMeta } from 'scriptumMeta'
import { readingMeta } from 'readingMeta'
import Records from 'Records'

const Metas = {
   'calendaries': calendaryMeta,
   'memories': memoryMeta,
   'names': nameMeta,
   'memoes': memoMeta,
   'scripta': scriptumMeta,
   'readings': readingMeta,
   'orders': orderMeta,
   'subjects': subjectMeta,
}

export default class Dashboard extends Component {
   state = merge({}, this.props, { meta: null })

   // system
   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         let parts = window.location.href.split("#")

         if (parts[1]) {
            return {
               prevProps: props,
               meta: Metas[parts[1]],
               page: parts[1]
            }
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
   onClick(meta, page) {
      this.setState({ meta: meta, page: page })
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
      console.log("[Dashboard] * state", this.state)

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
                     <ul id="nav-mobile" className="right">
                        {Object.entries(Metas).map(([path, meta]) =>
                           <li>
                              <a
                                 href={"#" + path}
                                 onClick={this.onClick.bind(this, meta, path)} >
                                 {meta.title}</a></li>)}
                        <li>
                           <div
                              ref={e => this.$avatarSignIn = e}
                              key='avatarSignIn'
                              className='sign-in circle signed'>
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
                        {this.state.meta && this.state.login &&
                           <Records
                              page={this.state.page}
                              meta={this.state.meta}
                              locales={this.state.locales} />}</div></div></div></div></main>,
         <div className="progress">
            <div className="indeterminate"></div></div> ])}}

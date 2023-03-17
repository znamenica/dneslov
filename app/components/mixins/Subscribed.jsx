const Subscribed = {
   onSubscribedChanged(e) {
      console.debug("[onSubscribedChanged] <<< ", e.detail)
      console.debug("[componentDidMount1]ccc:path ** ", e.detail, this.subscribeTo)
      let relaPath = this.subscribeTo.find((v) => { return e.detail == v })

      console.debug("[componentDidMount1]ccc:rela:", relaPath)
      if (relaPath) {
         console.debug("[componentDidMount1]ccc:up ** ", this.props, this.state)
         this.forceUpdate()
      }
   },
   componentDidMountBefore() {
      console.debug("[componentDidMount1]2 ** ", this, this.props.name, this.props.value)

      if (this.props.subscribeTo) {
         console.debug("[componentDidMount1]2a ** SUBS ")
         let parentPath = this.props.name.split(".").slice(0, -1).join('.')
         parentPath = parentPath ? parentPath + '.' : parentPath

         this.subscribeTo = [this.props.subscribeTo].flat().map((v) => {
            return v.replace(/@/, parentPath)
         })

         this.onSubscribedChanged = this.onSubscribedChanged.bind(this)
         // NOTE new event type is required because it happened here before target component is updated with new state
         document.addEventListener('dneslov-path-stored', this.onSubscribedChanged, { passive: true })
         console.debug("[componentDidMount1]2b ** SUBS ")
      }
   },
   componentWillUnmountBefore() {
      if (this.props.subscribeTo) {
         document.removeEventListener('dneslov-path-stored', this.onSubscribedChanged)
      }
   },
}

export default Subscribed

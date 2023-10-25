const Subscribed = {
   onSubscribedChanged(e) {
      console.debug("[onSubscribedChanged] <<< ", e.detail)
      console.debug("[onSubscribedChanged] **", this.subscribeTo)
      let relaPath = this.subscribeTo.find((v) => { return e.detail == v })

      console.debug("[onSubscribedChanged] ** relaPath:", relaPath)
      if (relaPath) {
         console.debug("[onSubscribedChanged] ** update to ", this, this.props)
         this.forceUpdate()
      }
   },
   componentDidMountBefore() {
      console.debug("[componentDidMountBefore] ** ", this, this.props.name, this.props.value)

      if (this.props.subscribeTo) {
         let parentPath = this.props.name.split(".").slice(0, -1).join('.')
         parentPath = parentPath ? parentPath + '.' : parentPath
         console.debug("[componentDidMountBefore] ** subscribed to:", parentPath)

         this.subscribeTo = [this.props.subscribeTo].flat().map((v) => {
            return v.replace(/@/, parentPath)
         })

         this.onSubscribedChanged = this.onSubscribedChanged.bind(this)
         // NOTE new event type is required because it happened here before target component is updated with new state
         document.addEventListener('dneslov-path-stored', this.onSubscribedChanged, { passive: true })
      }
   },
   componentWillUnmountBefore() {
      if (this.props.subscribeTo) {
         document.removeEventListener('dneslov-path-stored', this.onSubscribedChanged)
      }
   },
}

export default Subscribed

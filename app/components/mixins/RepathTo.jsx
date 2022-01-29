const RepathTo = {
   repathTo(path, value) {
      let parts = path.split(/\./)
          path = parts.slice(0, -1).concat([value]).join(".")

      return path
   }
}

export default RepathTo

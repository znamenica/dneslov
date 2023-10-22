const ValueToObject = {
   valueToObject(path, value) {
      let parts = path.split(/\./)
      let object = parts.reverse().reduce((val, part) => {
         return { [part]: val }
      }, value)

      return object
   }
}

export default ValueToObject

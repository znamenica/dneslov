const ValueToObject = {
   valueToObject(path, value) {
      console.log("TO", path,value)
      let parts = path.split(/\./)
      let object = parts.reverse().reduce((val, part) => {
         return { [part]: val }
      }, value)

      console.log("v", object)

      return object
   }
}

export default ValueToObject

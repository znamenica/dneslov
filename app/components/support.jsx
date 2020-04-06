const wrapperLetters = ['s', 'm', 'l', 'xl' ]

export function valueToObject(path, value) {
   console.log("[valueToObject] <<<", path,value)

   let parts = path.split(/\./)
   let object = parts.reverse().reduce((val, part) => {
      return { [part]: val }
   }, value)

   return object
}

export function propsAsArray(props) {
   return Object.entries(props.value).sort(([_a, a], [_b, b]) => {
      return a._pos - b._pos
   }).map(([key, element], index) => {
      return {
         key: key,
         _pos: index,
         _id: props.name + '.' + key,
         name: props.name + '.' + key,
         value: element,
         meta: props.meta || {},
   }})
}

export function displaySchemeToWrapperClass(scheme) {
   if (scheme) {
      let tokens = scheme.split("-"),
          klass = wrapperLetters.map((letter, index) => {
             return letter + (tokens[index] || tokens[-1] || 12)
         })

      return "col " + klass.join(" ")
   }

   return ""
}

const wrapperLetters = ['s', 'm', 'l', 'xl' ]

export function yearDateFromDate(date_in) {
   console.debug("[yearDateFromDate] <<<", date_in)

   let date, yearDate

   if (!date_in) {
      date = new Date(Date.now())
   } else if (date_in.constructor.name == "Date") {
      date = date_in
   } else if (date_in.constructor.name == "Integer") {
      date = new Date(date)
   } else if (date_in.constructor.name == "String") {
      //let date_tmp = date_in.split(".").reverse().join("-")
      //date = new Date(Date.parse(date_tmp))
   } else {
      date = date_in && new Date(Date.parse(date_in))
   }

   let f = new Intl.DateTimeFormat('ru-RU', {month: "2-digit", day: "2-digit"})

   console.debug("[yearDateFromDate] **", date_in, "->", date, "->", f.format(date))

   return f.format(date)
}

export function getCalendariesString(props) {
   let c_a = props.calendaries_used && props.calendaries_used.slice()

    return c_a && c_a.join(",") || null
}

export function getDateString(props) {
   return props.date && (props.measure == "юлианский" && "ю" || "н") + props.date || null
}

export function parseCalendariesString(string) {
   return string && string.split(",") || null
}

export function parseDateString(string) {
   console.debug("[parseDateString] <<<", string)

   if (string) {
      let r = string.match(/([юн])?([0-9\-\.]+)/)
      if (r) {
         return r.slice(2,3).reverse()
      }
   }

   return []
}

export function getPathsFromState(state) {
   let path = "/" + (state.memory?.slug || ""),
       json_path = (path === '/' && 'index' || path) + '.json',
       args = "",
       anchor = null,
       params = Object.entries(state.query).reduce((line, [key, value]) => {
         console.log("[getPathFromState] *", "key:", key, "value:", value, "query:", line)
         if (value && value.length > 0) {
            let part = key + "=" + encodeURIComponent(value)
            return line && line + "&" + part || part
         } else {
            return line
         }
      }, "")

   if (anchor) {
      args += "#" + anchor
   }

   if (params) {
      args += "?" + params
   }

   return [ path + args, json_path + args ]
}

export function getTitleFromState(state) {
   let [ date, style ] = parseDateString(state.query.d),
       cals = "[ " + state.query.c + " ]",
       data = [ "Днеслов", state.memory?.short_name, date, style, cals ]

   return data.filter((e) => { return e}).join(" / ")
}

export function yeardateToMs(yeardate, msDateIn) {
   let date = new Date(msDateIn || Date.now())

   console.debug("[yeardateToMs] <<<", yeardate, date)

   return yeardate && Date.parse(date.getFullYear() + "-" + yeardate.split(".").reverse().join("-"))
}

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

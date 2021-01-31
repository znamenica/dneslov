Array.prototype.transpose = function() {
   return this.reduce((prev, next) => next.map((item, i) =>
      (prev[i] || []).concat(next[i])
   ), [])
}

Array.prototype.selectByKey = function(key_name, key_value) {
   let array = this.filter(r => { return r[key_name] == key_value })

   return array
}

Array.prototype.isBlank = function() {
   return this.length == 0
}

Array.prototype.isPresent = function() {
   return this.length > 0
}

Array.prototype.compact = function() {
   return this.filter(r => { return r })
}

Array.prototype.intersectTo = function(array) {
   return this.reduce((res, value) => {
      return array.includes(value) && res.concat([value]) || res
   }, [])
}

Array.prototype.uniq = function() {
   return this.reduce((res, value) => {
      return res.includes(value) && res || res.concat([value])
   }, [])
}

Array.prototype.sortByArray = function(array, field) {
   return this.sort((x, y) => {
      let xi = array.indexOf(field ? x[field] : x),
          yi = array.indexOf(field ? y[field] : y)

      if (xi > yi) {
         return -1
      } else if (xi < yi) {
         return 1
      } else {
         return 0
      }
   })
}

String.prototype.populateTo = function(string) {
   let from = this.charCodeAt(0),
       to = string.charCodeAt(0),
       res = []

   if (from < to) {
      for (let i = from; i <= to; i++) { res.push(String.fromCharCode(i)) }
   } else {
      for (let i = from; i >= from; i--) { res.push(String.fromCharCode(i)) }
   }

   return res
}

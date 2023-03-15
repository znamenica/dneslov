Text.prototype.getElementIndex = function() {
   return Array.prototype.indexOf.call(this.parentNode.children, this)
}

Number.prototype.populateDownTo = function(number) {
   let count = number - self,
       array = new Array()

   if (count < 0) {
      for (let i = self; i >= number; i--) {
         array.push(step)
      }
   }

   return array
}

Number.prototype.populateTo = function(number) {
   let count = number - self,
       array = new Array()

   if (count > 0) {
      for (let i = self; i <= number; i++) {
         array.push(step)
      }
   }

   return array
}

Date.at = function(milliseconds) {
   let date = new Date(milliseconds),
       userTimezoneOffset = Math.abs(date.getTimezoneOffset() * 60000)

   return new Date(date.getTime() - userTimezoneOffset)
}

Date.prototype.dayshifted = function(number) {
   const newDate = new Date(this)
   return new Date(newDate.setDate(newDate.getDate() + number))
}

Array.prototype.first = function() {
   return this[0]
}

Array.prototype.last = function() {
   return this[this.length - 1]
}

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

Array.prototype.all = function (func) {
   let res

   if (func && func.constructor.name === "Function") {
      res = this.reduce((r, key) => { return r && !!func(key) }, true)
   } else {
      res = this.length > 0
   }

   return !!res
}

Object.defineProperty(Object.prototype, 'isBlank', {
   value: function (func) {
      return Object.keys(this).length == 0
   },
   writable: true,
})

Object.defineProperty(Object.prototype, 'isPresent', {
   value: function (func) {
      return Object.keys(this).length > 0
   },
   writable: true,
})

Object.defineProperty(Object.prototype, 'all', {
   value: function (func) {
      let res

      if (func && func.constructor.name === "Function") {
         res = Object.keys(this).reduce((r, key) => { return r && !!func([key, this[key]]) }, true)
      } else {
         res = Object.keys(this).length > 0
      }

      return !!res
   },
   writable: true,
})

Object.defineProperty(Object.prototype, 'select', {
   value: function (filter) {
      let res = filter &&
         Object.keys(this).reduce((r, key) => {
            let cond = true

            if (filter.constructor.name === "Object") {
               cond = filter.all((_key, _value) => {
                  return this[_key] == _value
               })
            } else if (filter.constructor.name === "Function") {
               cond = filter(key, this[key])
            }

            return cond && r.merge({ [key]: this[key] }) || r
         }, {}) || this

      return res
   },
   writable: true,
})

Object.defineProperty(Object.prototype, 'purify', {
   value: function (other) {
      let newHash = Object.assign({}, this)

      Object.keys(newHash).forEach((key) => {
         delete newHash[key]
      })

      return newHash
   },
   writable: true,
})

Object.defineProperty(Object.prototype, '|', {
   value: function (other) {
      return Object.assign({}, this, other || {})
   },
   writable: true,
})

Object.defineProperty(Object.prototype, 'merge', {
   value: function (other) {
      return Object.assign({}, this, other || {})
   },
   writable: true,
})

Object.defineProperty(Object.prototype, 'intersectWith', {
   value: function (other = {}) {
      return Object.keys(this).reduce((r, key) => {
         return Object.keys(other).includes(key) && this[key] == other[key] ? r.merge({ [key]: this[key] }) : r
      }, {}) || this
   },
   writable: true,
})

Object.defineProperty(Object.prototype, 'isPresent', {
   value: function () {
      return Object.values(this).length > 0
   },
   writable: true,
})

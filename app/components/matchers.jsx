export function matchLetters(e) {
   let res = false

   if (e.text) {
      switch (e.alphabeth_code) {
      case 'ру':
         res = ! e.text.match(/^[А-ЯЁа-яё:,.!;\-\/* ]+$/)
         break
      case 'цс':
         res = ! e.text.match(/^[А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѼѾꙖꙊа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѽѿꙗꙋ:,.!;\-\/* ]+$/)
         break
      }
   }

   return res
}

export function matchCodes(e) {
   const language_tree = {
      ру: ['рп', 'ру'],
      цс: ['цс', 'рп', 'ру', 'цр' ],
   }
   let alphabeth_codes = language_tree[e.language_code]

   return alphabeth_codes &&
          e.alphabeth_code &&
          alphabeth_codes.indexOf(e.alphabeth_code) < 0
}

export function matchLanguages(hash) {
   let languages = []

   Object.entries(hash).forEach(([key, value]) => {
      languages.push(value.language_code)
   })

   languages.forEach((l, i) => {if (languages.indexOf(l, i + 1)) { return true }})
   return false
}

export function matchAlphabeths(hash) {
   let alphabeths = []

   Object.entries(hash).forEach(([key, value]) => {
      alphabeths.push(value.alphabeth_code)
   })

   alphabeths.forEach((a, i) => {if (alphabeths.indexOf(a, i + 1)) { return true }})
   return false
}

export function matchEmptyObject(e) {
   return Object.values(e).length == 0
}

const event_types = ['Resurrection', 'Repose', 'Writing', 'Appearance', 'Translation', 'Sanctification']

export function makeTweet(value, locales, source = 'tweets', filter = null) {
   let tweets = locales.map((locale) => {
      return value[source].reduce((res, text) => {
         return res ||
            locale === text.language_code &&
            (!filter || Object.keys(filter).reduce((r, key) => {
               return r || text[key] === filter[key]
            }, null)) &&
            text.text
      }, null)
   }).filter((e) => { return e })

   if (tweets[0] && tweets[0].length > 27) {
      return tweets[0].slice(0, 27) + '...'
   } else {
      return tweets[0] || ''
   }
}

export function makeNote(value, locales, source = 'notes', filter = null) {
   let notes = locales.map((locale) => {
      return value[source].reduce((res, text) => {
         return res ||
            locale === text.language_code &&
            (!filter || Object.keys(filter).reduce((r, key) => {
               return r || text[key] === filter[key]
            }, null)) &&
            text.text
      }, null)
   }).filter((e) => { return e })

   if (notes[0] && notes[0].length > 27) {
      return notes[0].slice(0, 27) + '...'
   } else {
      return notes[0] || ''
   }
}

export function makeName(value, locales, source = 'names', filter = null) {
   let names = locales.map((locale) => {
      return value[source].reduce((res, text) => {
         return res ||
            locale === text.language_code &&
            (!filter || Object.keys(filter).reduce((r, key) => {
               return r || text[key] === filter[key]
            }, null)) &&
            text.text
      }, null)
   }).filter((e) => { return e })

   return names[0] || ''
}

// filter: hash of key: value pairs to filter out the source
export function makeTitle(value, locales, source = 'titles', filter = null) {
   let titles = locales.map((locale) => {
      return value[source].reduce((res, text) => {
         return res ||
            locale === text.language_code &&
            (!filter || Object.keys(filter).reduce((r, key) => {
               return r || text[key] === filter[key]
            }, null)) &&
            text.text
      }, null)
   }).filter((e) => { return e })

   return titles[0] || ''
}

export function makeDate(value) {
   let dates = [...event_types].map((event_type) => {
      return value.events.reduce((res, event) => { return event.type == event_type && event.happened_at || res }, null)
   }).filter((e) => { return e })

   return dates[0] || ''
}

export function makeCouncil(value) {
   if (value.council && value.council.length > 17) {
      return value.council.slice(0, 17) + '...'
   } else {
      return value.council || ''
   }
}

export function makeDescription(value, locales, source = 'descriptions', filter = null) {
   let descriptions = locales.map((locale) => {
      return value[source].reduce((res, text) => {
         return res ||
            locale === text.language_code &&
            (!filter || Object.keys(filter).reduce((r, key) => {
               return r || text[key] === filter[key]
            }, null)) &&
            text.text
      }, null)
   }).filter((e) => { return e })

   if (descriptions[0] && descriptions[0].length > 27) {
      return descriptions[0].slice(0, 27) + '...'
   } else {
      return descriptions[0] || ''
   }
}

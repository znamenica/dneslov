export function matchLetters(e) {
   let res = false

   if (e.text) {
      switch (e.alphabeth_code) {
      case 'ру':
         res = ! e.text.match(/^[А-ЯЁа-яё:,.!?;\-\/* ]+$/)
         break
      case 'цс':
         res = ! e.text.match(/^[А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѼѾꙖꙊа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѽѿꙗꙋ:,.!;\-\/* ]+$/)
      case 'рп':
         res = ! e.text.match(/^[А-ЯЁІѢѲѴа-яёіѣѳѵ:,.!;\-\/* ]+$/)
         break
      case 'цр':
         res = ! e.text.match(/^[А-ЯЁа-яё_<>:,.!;\-\/* ]+$/) //TODO
         break
      case 'сс':
         res = ! e.text.match(/^[А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѾꙖа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѿꙗ.,;* ]+$/) //TODO
         break
      case 'ук':
         res = ! e.text.match(/^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ:,.!?\- ]+$/)
         break
      case 'бл':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'мк':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'ср':
         res = ! e.text.match(/^[ЂЈ-ЋЏА-ИК-Шђј-ћа-ик-ш:,.!?\-\/ ]+$/)
         break
      case 'хр':
         res = ! e.text.match(/^[A-PR-VZČĆŽĐŠa-pr-vzčćžđš:,. ]+$/) //TODO
         break
      case 'со':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'бг':
         res = ! e.text.match(/^[А-ЪЬЮЯа-ъьюя:,.!?\-\/ ]+$/)
         break
      case 'чх':
         res = ! e.text.match(/^[A-PR-VX-ZÁÉĚÍÓÚŮÝČĎŇŘŠŤŽa-pr-vx-záéěíóúůýčďňřšťž:,.!?\- ]+$/) //TOOD
         break
      case 'сл':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'по':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'ар':
         res = ! e.text.match(/^[Ա-Ֆա-և:,.!?\- ]+$/)
         break
      case 'ив':
         res = ! e.text.match(/^[ა-ჺჽა-ჺჽ:,.!?\- ]+$/)
         break
      case 'рм':
         res = ! e.text.match(/^[A-ZĂÂÎȘȚa-zăâîșț:,.!?\- ]+$/)
         break
      case 'цу':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'гр':
         res = ! e.text.match(/^[ͶͲΑ-ΫϏϒϓϔϘϚϜϠϞϴϷϹϺϾϿἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙ-ὟὨ-Ὧᾈ-ᾏᾘ-ᾟᾨ-ᾯᾸ-ᾼῈ-ῌῘ-ΊῨ-ῬῸ-ῼΩΆ-Ώά-ώϐϑϕ-ϗϙϛϝ-ϟϡ-ϳϵ-϶ϸϻϼᴦ-ᴪἀ-ἇἐ-ἕἠ-ἧἰ-ἷὀ-ὅὐ-ὗὠ-ὧὰ-ᾇᾐ-ᾗᾠ-ᾧᾰ-ᾷῂ-ῇῐ-ῗῠ-ῧῲ-ῷͻ-ͽͷΐά-ΰ:,. ]+$/)
         break
      case 'ла':
         res = ! e.text.match(/^[A-IK-TVX-ZÆa-ik-tvx-zæ:,.\- ]+$/)
         break
      case 'ит':
         res = ! e.text.match(/^[A-IL-VZa-il-vz:,.!?\- ]+$/)
         break
      case 'фр':
         res = ! e.text.match(/^[A-ZŒÆÇÀÂÎÏÛÙÜÉÈÊËÔŸÑa-zœæçàâîïûùüéèêëôÿñ:,.!?\- ]+$/)
         break
      case 'ис':
         res = ! e.text.match(/^[A-ZÑÁÉÍÓÚÜÏa-zñáéíóúüï:,. ]+$/)
         break
      case 'не':
         res = ! e.text.match(/^[A-ZÄÖÜẞa-zäöüßſ:,. ]+$/)
         break
      case 'ир':
         res = ! e.text.match(/^[A-IL-PR-Ua-il-pr-u:,. ]+$/)
         break
      case 'си':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'ан':
         res = ! e.text.match(/^[A-Za-z:,.!?\- ]+$/)
         break
      case 'са':
         res = ! e.text.match(/^[:,. ]+$/) //TODO
         break
      case 'ра':
         res = ! e.text.match(/^[A-IL-PR-UW-YÆÐꝽÞǷĊĠĀĒĪŌŪa-il-pr-uw-yæðᵹſþƿċġāēīūō:,.!?\- ]+$/) //TODO
         break
      }
   }

   return res
}

export function matchCodes(e) {
   const language_tree = {
      ру: ['рп', 'ру'],
      цс: ['цс', 'рп', 'ру', 'цр' ],
      сс: ['сс'],
      ук: ['ук'],
      бл: ['бл'],
      мк: ['мк'],
      сх: ['ср', 'хр'],
      со: ['со'],
      бг: ['бг'],
      чх: ['чх'],
      сл: ['сл'],
      по: ['по'],
      кш: ['кш'],
      вл: ['вл'],
      нл: ['нл'],
      ар: ['ар'],
      ив: ['ив'],
      рм: ['рм', 'цу', 'цр'],
      гр: ['гр'],
      ла: ['ла'],
      ит: ['ит'],
      фр: ['фр'],
      ис: ['ис'],
      не: ['не'],
      ир: ['ир'],
      си: ['си'],
      ан: ['ан', 'са', 'ра'],
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

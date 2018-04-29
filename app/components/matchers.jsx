export function matchLetters(e) {
   let res = false

   if (e.text) {
      switch (e.alphabeth_code) {
      case 'ру':
         res = ! e.text.match(/^[А-ЯЁа-яё:,.!?;\-\/*()0-9«»́–—\r\n†№IVXLCDM \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'цс':
         res = ! e.text.match(/^[А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѼѾꙖꙊа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѽѿꙗꙋ:,.!;\-\/*\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      case 'рп':
         res = ! e.text.match(/^[А-ЯЁІѢѲѴа-яёіѣѳѵ:,.!;\-\/*()0-9«»́–—\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'цр':
         res = ! e.text.match(/^[А-ЯЁа-яё_<>:,.!;\-\/*\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'сс':
         res = ! e.text.match(/^[А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѾꙖа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѿꙗ.,;*\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'ук':
         res = ! e.text.match(/^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ:,.!?\-()0-9́«»–—\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'бл':
         res = ! e.text.match(/^[:,.()0-9«»–\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'мк':
         res = ! e.text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'ср':
         res = ! e.text.match(/^[ЂЈ-ЋЏА-ИК-Шђј-ћа-ик-ш:,.!?\-\/()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'хр':
         res = ! e.text.match(/^[A-PR-VZČĆŽĐŠa-pr-vzčćžđš:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'со':
         res = ! e.text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'бг':
         res = ! e.text.match(/^[А-ЪЬЮЯа-ъьюя:,.!?\-\/()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'чх':
         res = ! e.text.match(/^[A-PR-VX-ZÁÉĚÍÓÚŮÝČĎŇŘŠŤŽa-pr-vx-záéěíóúůýčďňřšťž:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TOOD
         break
      case 'сл':
         res = ! e.text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'по':
         res = ! e.text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'ар':
         res = ! e.text.match(/^[Ա-Ֆա-և:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'ив':
         res = ! e.text.match(/^[ა-ჺჽა-ჺჽ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'рм':
         res = ! e.text.match(/^[A-ZĂÂÎȘȚa-zăâîșț:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'цу':
         res = ! e.text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'гр':
         res = ! e.text.match(/^[ͶͲΑ-ΫϏϒϓϔϘϚϜϠϞϴϷϹϺϾϿἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙ-ὟὨ-Ὧᾈ-ᾏᾘ-ᾟᾨ-ᾯᾸ-ᾼῈ-ῌῘ-ΊῨ-ῬῸ-ῼΩΆ-Ώά-ώϐϑϕ-ϗϙϛϝ-ϟϡ-ϳϵ-϶ϸϻϼᴦ-ᴪἀ-ἇἐ-ἕἠ-ἧἰ-ἷὀ-ὅὐ-ὗὠ-ὧὰ-ᾇᾐ-ᾗᾠ-ᾧᾰ-ᾷῂ-ῇῐ-ῗῠ-ῧῲ-ῷͻ-ͽͷΐά-ΰ«»'’"`,;;:.·˙©~\-\+\.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'ла':
         res = ! e.text.match(/^[A-IK-TVX-ZÆa-ik-tvx-zæ:,.\-\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'ит':
         res = ! e.text.match(/^[A-IL-VZa-il-vz:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'фр':
         res = ! e.text.match(/^[A-ZŒÆÇÀÂÎÏÛÙÜÉÈÊËÔŸÑa-zœæçàâîïûùüéèêëôÿñ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'ис':
         res = ! e.text.match(/^[A-ZÑÁÉÍÓÚÜÏa-zñáéíóúüï:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'не':
         res = ! e.text.match(/^[A-ZÄÖÜẞa-zäöüßſ:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'ир':
         res = ! e.text.match(/^[A-IL-PR-Ua-il-pr-u:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'си':
         res = ! e.text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'ан':
         res = ! e.text.match(/^[A-Za-z:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
         break
      case 'са':
         res = ! e.text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
         break
      case 'ра':
         res = ! e.text.match(/^[A-IL-PR-UW-YÆÐꝽÞǷĊĠĀĒĪŌŪa-il-pr-uw-yæðᵹſþƿċġāēīūō:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
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

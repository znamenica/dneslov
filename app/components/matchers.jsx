import { merge } from 'merge-anything'
import UrlRegexp from 'UrlRegexp'

export function matchValidUrl(text) {
   return !text || !text.match(UrlRegexp) && !text.match(/^\//)
}

export function matchValidJson(text) {
   if (text) {
      switch (text.constructor.name) {
         case "String":
            try {
               text && JSON.parse(text)
               return false
            } catch (e) {
               return true
            }
         case "Object":
            return false
      }
   } else {
      return false
   }
}

export function matchLetters(textIn, context) {
   let res = false, text = textIn || ""

   console.debug("[matchLetters] ** text:", text, "context:", context)

   if (!text) {
      return res
   }

   switch (context.alphabeth_code) {
   case 'РО':
      res = ! text.match(/^[А-ЯЁа-яё:,.!?;\-\/*()0-9«»́–—\r\n†№IVXLCDM \*~`\+\-#=\[\]\(\)!\|\<\>]+$/)
      break
   case 'ЦС':
      res = ! text.match(/^[҂҃҄҇꙼꙾ⷣⷮ꙽ꙿ̀̾҅҆̑́А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѼѾꙖꙊа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѽѿꙗꙋ:,.!;\-\/*\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'РУ':
      res = ! text.match(/^[А-ЯЁІѢѲѴа-яёіѣѳѵ:,.!;\-\/*()0-9«»́–—\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ЦР':
      res = ! text.match(/^[А-ЯЁа-яё_<>:,.!;\-\/*\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'СС':
      res = ! text.match(/^[꙯꙰꙲꙱ⷠⷡⷢⷣⷤⷥⷦⷧⷨⷩⷪⷫⷬⷭⷮⷯⷰⷱⷲⷳⷴⷵⷶⷷⷸⷹⷺⷻⷼⷽⷾⷿꙴꙵꙶꙷꙸꙹꙺꙻ꙽ꙿꚜꚝꚞꚟ︮︯꙳꙼꙾҂҃҄҇҈҉А-ЬЮЅІѠѢѦѤѪѮѰѲѴѶѸѺѾꙖа-ьюєѕіѡѣѧѫѯѥѱѳѵѷѹѻѿꙗѨѩѬѭѸѹҀҁꙀꙁꙂꙃꙄꙅꙆꙇꙈꙉꙊꙋꙌꙍꙎꙏꙐꙑꙒꙓꙔꙕꙘꙙꙚꙛꙜꙝꙨꙩꙪꙫꙬꙭꙮꚘꚙꚚꚛ.́,;*\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'УК':
      res = ! text.match(/^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ:,.!?\-()0-9́«»–—\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'БЛ':
      res = ! text.match(/^[:,.()0-9«»–\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'МК':
      res = ! text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'СЕ':
      res = ! text.match(/^[ЂЈ-ЋЏА-ИК-Шђј-ћа-ик-ш:,.!?\-\/()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ХР':
      res = ! text.match(/^[A-PR-VZČĆŽĐŠa-pr-vzčćžđš:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'СО':
      res = ! text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'БГ':
      res = ! text.match(/^[А-ЪЬЮЯа-ъьюя:,.!?\-\/()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ЧХ':
      res = ! text.match(/^[A-PR-VX-ZÁÉĚÍÓÚŮÝČĎŇŘŠŤŽa-pr-vx-záéěíóúůýčďňřšťž:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TOOD
      break
   case 'СЛ':
      res = ! text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'ПО':
      res = ! text.match(/^[A-ZÓĘĆĄŚŹŻŃŁa-zóęćąśźżńł:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'АР':
      res = ! text.match(/^[Ա-Ֆա-և:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ИВ':
      res = ! text.match(/^[ა-ჺჽა-ჺჽ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'РМ':
      res = ! text.match(/^[A-ZĂÂÎȘȚa-zăâîșț:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ЦУ':
      res = ! text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'ГР':
      res = ! text.match(/^[ό-ώΆ-ώ΄«»'’"`,;;:.·˙©~\-\+\.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'СГ':
      res = ! text.match(/^[Α-Ϋα-ϋϏ-ϡϰ-Ͽἀ-῾«»'’"`,;;:.·˙©~\-\+\.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ДГ':
      res = ! text.match(/^[Α-Ϋα-ϋϏ-ϡϰ-Ͽἀ-῾«»'’"`,;;:.·˙©~\-\+\.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ЛА':
      res = ! text.match(/^[A-IK-TVX-ZÆa-ik-tvx-zæ:,.\-\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ИТ':
      res = ! text.match(/^[A-IL-VZa-il-vz:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ФР':
      res = ! text.match(/^[A-ZŒÆÇÀÂÎÏÛÙÜÉÈÊËÔŸÑa-zœæçàâîïûùüéèêëôÿñ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ИС':
      res = ! text.match(/^[A-ZÑÁÉÍÓÚÜÏa-zñáéíóúüï:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'НЕ':
      res = ! text.match(/^[A-ZÄÖÜẞa-zäöüßſ:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'ИР':
      res = ! text.match(/^[A-IL-PR-Ua-il-pr-u:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'СИ':
      res = ! text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'АН':
      res = ! text.match(/^[A-Za-z:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/)
      break
   case 'СА':
      res = ! text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'РА':
      res = ! text.match(/^[A-IL-PR-UW-YÆÐꝽÞǷĊĠĀĒĪŌŪa-il-pr-uw-yæðᵹſþƿċġāēīūō:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   case 'ЕВ':
      res = ! text.match(/^[א-ת׳״שׁ-זּטּ-לּמּנּסּףּפּצּ-ﭏ֑-ׇ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!\|]+$/) //TODO
      break
   }

   return res
}

export function matchCodes(eIn, context) {
   let e = eIn || {}

   const language_tree = {
      ру: ['РУ', 'РО'],
      ср: ['СР'],
      др: ['ДР'],
      цс: ['ЦС', 'РУ', 'РО', 'ЦР'],
      сс: ['СС', 'ЦР'],
      ук: ['УК'],
      бл: ['БЛ'],
      мк: ['МК'],
      сх: ['СЕ', 'ХР'],
      со: ['СО'],
      бг: ['БГ'],
      чх: ['ЧХ'],
      сл: ['СЛ'],
      по: ['ПО'],
      кш: ['КШ'],
      вл: ['ВЛ'],
      нл: ['НЛ'],
      ар: ['АР'],
      ив: ['ИВ'],
      рм: ['РМ', 'ЦУ', 'ЦР'],
      гр: ['ГР'],
      сг: ['СГ'],
      дг: ['ДГ'],
      ла: ['ЛА'],
      ит: ['ИТ'],
      фр: ['ФР'],
      ис: ['ИС'],
      не: ['НЕ'],
      ир: ['ИР'],
      си: ['СИ'],
      ан: ['АН', 'АМ'],
      са: ['СА'],
      ра: ['РА'],
      аб: ['АБ'],
      но: ['НО'],
      да: ['ДА'],
      шв: ['ШВ'],
      ил: ['ИЛ'],
      фа: ['ФА'],
      нз: ['НЗ'],
      пг: ['ПГ'],
      го: ['ГО'],
      ко: ['КО'],
      фи: ['ФИ'],
      ес: ['ЕС'],
      лт: ['ЛТ'],
      ли: ['ЛИ'],
      вн: ['ВН'],
      нн: ['НН'],
      аа: ['АА'],
   }

   console.debug("[matchCodes] ** e:", e, "context:", context)
   if (e) {
      let alphabeth_codes = language_tree[context.language_code]

      return alphabeth_codes &&
             context.alphabeth_code &&
             alphabeth_codes.indexOf(context.alphabeth_code) < 0
   }
}

export function matchLanguages(objectIn) {
   let languages = [], object = objectIn || {}

   Object.entries(object).forEach(([key, value]) => {
      languages.push(value.language_code)
   })

   languages.forEach((l, i) => {if (languages.indexOf(l, i + 1)) { return true }})
   return false
}

export function matchAlphabeths(objectIn) {
   let alphabeths = [], object = objectIn || {}

   Object.entries(object).forEach(([key, value]) => {
      alphabeths.push(value.alphabeth_code)
   })

   alphabeths.forEach((a, i) => {if (alphabeths.indexOf(a, i + 1)) { return true }})
   return false
}

export function matchSelection(value, _context, state) {
   return !Number.isInteger(state.start) || !Number.isInteger(state.end)
}

export function matchEmptyCollection(value) {
   return value.reduce((res, v) => { return res && v.value._destroy }, true)
}

export function matchEmptyObject(value) {
   let res = false

   console.debug("[matchEmptyObject] ** value:", value)

   if (value === null || value === undefined) {
      res = true
   } else {
      switch(value.constructor.name) {
      case 'Number':
         break
      case 'Array':
         res = value.length == 0

         break
      case 'Object':
         res = Object.values(value).length == 0

         break
      default:
         res = !value
      }
   }

   return res
}

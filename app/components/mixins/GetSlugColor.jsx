const GetSlugColor = {
   getSlugColor(order) {
      const poses = [ "0".populateTo("9"), "а".populateTo("е"), "ё", "ж".populateTo("я") ].flat().reverse()

      let coeff = 4.0 / poses.length,
          colors = order.split("").map(chr => { return 12 + coeff * poses.indexOf(chr)}),
          codes = colors.map(c => {
            return c < 10 && (c + "0".charCodeAt(0)) || (c - 10 + "a".charCodeAt(0))
          }),
          letters = String.fromCharCode(...codes).concat(['fffff']).slice(0, 6).split(""),
          color = [ letters.slice(0, letters.length / 2), letters.slice(letters.length / 2, letters.length) ].transpose().flat().join("")

      console.log("COLOR *", color)
      return color
   }
}

export default GetSlugColor

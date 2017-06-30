// http://stackoverflow.com/a/30652110/873870
function requireAll (r) { r.keys().forEach(r) }

//import 'pickmeup/dist/pickmeup.min'
//import 'pickmeup/js/pickmeup'

requireAll(require.context('./behaviors/', true, /\.js$/))

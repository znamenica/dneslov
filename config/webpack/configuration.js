// Common configuration for webpacker loaded from config/webpacker.yml

const { join } = require('path')
const { env } = require('process')
const { safeLoad } = require('js-yaml')
const { readFileSync } = require('fs')

const configPath = join(global.rootpath, 'config', 'webpacker.yml')

console.log("Config file: ", configPath)
console.log("Env: ", global.env)

const loadersDir = join(__dirname, 'loaders')
const settings = safeLoad(readFileSync(configPath), 'utf8')[global.env]

function removeOuterSlashes(string) {
  return string.replace(/^\/*/, '').replace(/\/*$/, '')
}

function formatPublicPath(host = '', path = '') {
  let formattedHost = removeOuterSlashes(host)
  if (formattedHost && !/^http/i.test(formattedHost)) {
    formattedHost = `//${formattedHost}`
  }
  const formattedPath = removeOuterSlashes(path)
  return `${formattedHost}/${formattedPath}/`
}

const output = {
  path: join(global.rootpath, 'public', settings.public_output_path),
  publicPath: formatPublicPath(env.ASSET_HOST, settings.public_output_path)
}

module.exports = {
  settings,
  env,
  loadersDir,
  output
}

module.exports = function jssLoader (source) {
  let sheet
  this._compiler.applyPlugins('jss-stylesheet', (sheets) => {
    sheet = sheets[this.resourcePath]
  })
  return `
    export let classes = ${JSON.stringify(sheet.classes)}
    export let rules = ${JSON.stringify(sheet.rules.raw)}
  `
}

const glob = require('glob')
const Util = require('spike-util')
const jss = require('jss')
const path = require('path')

module.exports = class SpikeJSSPlugin {
  constructor (config) {
    Object.assign(this, config)
  }

  apply (compiler) {
    // set up utilities
    this.util = new Util(compiler.options)
    this.sheets = new jss.SheetsRegistry()
    this.sheetsRaw = {}

    // pull, register, and attach jss stylesheets
    this.createStyleSheets(compiler)

    // add the custom jss loader to webpack, so jss files can be required
    this.addLoader(compiler)

    // compile to string and write to css file
    compiler.plugin('emit', this.emit.bind(this, compiler))
  }

  createStyleSheets (compiler) {
    // pull the file paths from files option glob
    this.filePaths = glob.sync(this.files, {
      cwd: compiler.options.context,
      realpath: true,
      nodir: true,
      ignore: this.util.getSpikeOptions().ignore
    })
    // create a jss stylesheet from each file
    this.filePaths.map((f) => {
      const sheet = jss.default.createStyleSheet(require(f))
      sheet.attach()
      this.sheetsRaw[f] = sheet
      this.sheets.add(sheet)
    })
    // add plugin so that the loader can pick up the stylesheet obj
    compiler.plugin('jss-stylesheet', (cb) => cb(this.sheetsRaw))
  }

  addLoader (compiler) {
    // add loader alias so that frontmatter loader can be resolved
    const resolveLoader = compiler.options.resolveLoader
    if (!resolveLoader.alias) resolveLoader.alias = {}
    resolveLoader.alias.jss = path.join(__dirname, 'jss-loader.js')

    // add jss loader with pattern converted to regex
    compiler.options.module.rules.push({
      test: this.util.pathsToRegex(this.filePaths),
      use: [{
        loader: 'jss',
        options: { _skipSpikeProcessing: true }
      }]
    })
  }

  emit (compiler, compilation, done) {
    const src = this.sheets.toString()
    compilation.assets[this.output] = {
      source: () => src,
      size: () => src.length
    }
    done()
  }
}

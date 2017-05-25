const glob = require('glob')
const Util = require('spike-util')
const jss = require('jss')

module.exports = class SpikeJSSPlugin {
  constructor (config) {
    Object.assign(this, config)
  }

  apply (compiler) {
    // set up utilities
    this.util = new Util(compiler.options)
    this.sheets = new jss.SheetsRegistry()

    // pull, register, and attach jss stylesheets
    this.util.runAll(compiler, this.run.bind(this, compiler))

    // compile to string and write to css file
    compiler.plugin('emit', this.emit.bind(this, compiler))
  }

  run (compiler, compilation, done) {
    glob(this.files, { cwd: compiler.options.context, realpath: true }, (err, files) => {
      if (err) return done(err)
      this.filePaths = files
      files.map((f) => {
        const sheet = jss.default.createStyleSheet(require(f))
        sheet.attach()
        this.sheets.add(sheet)
      })
      done()
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

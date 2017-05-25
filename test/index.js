const Jss = require('..')
const Spike = require('spike-core')
const test = require('ava')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf-promise')
const fixturesPath = path.join(__dirname, 'fixtures')

test('basic', (t) => {
  return compileFixture('basic', {
    entry: { main: './index.js' },
    plugins: [new Jss({ files: 'styles.js', output: 'main.css' })]
  }).then(({ publicPath }) => {
    const src = fs.readFileSync(path.join(publicPath, 'main.css'), 'utf8')
    t.regex(src, /color: red;/)
    return rimraf(publicPath)
  })
})

//
// utilities
//

function compileFixture (name, config) {
  return new Promise((resolve, reject) => {
    const root = path.join(fixturesPath, name)
    const proj = new Spike(Object.assign({ root }, config))

    proj.on('error', reject)
    proj.on('compile', (stats) => {
      const publicPath = path.join(root, 'public')
      resolve({ publicPath, stats })
    })

    proj.compile()
  })
}

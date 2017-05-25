const Jss = require('..')
const Spike = require('spike-core')
const test = require('ava')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf-promise')
const {JSDOM} = require('jsdom')
const fixturesPath = path.join(__dirname, 'fixtures')

test('basic', (t) => {
  return compileFixture('basic', {
    entry: { main: './component.js' },
    plugins: [new Jss({ files: 'styles.js', output: 'main.css' })]
  }).then(({ publicPath }) => {
    const src = fs.readFileSync(path.join(publicPath, 'main.css'), 'utf8')
    t.regex(src, /color: red;/)
    const dom = new JSDOM(`
      <script>${fs.readFileSync(path.join(publicPath, 'main.js'))}</script>
    `, { runScripts: 'dangerously' })
    t.is(dom.window.out.button, 'button-0-0')
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

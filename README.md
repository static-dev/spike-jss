# Spike JSS

[![npm](https://img.shields.io/npm/v/spike-jss.svg?style=flat-square)](https://npmjs.com/package/spike-jss)
[![tests](https://img.shields.io/travis/static-dev/spike-jss.svg?style=flat-square)](https://travis-ci.org/static-dev/spike-jss?branch=master)
[![dependencies](https://img.shields.io/david/static-dev/spike-jss.svg?style=flat-square)](https://david-dm.org/static-dev/spike-jss)
[![coverage](https://img.shields.io/codecov/c/github/static-dev/spike-jss.svg?style=flat-square)](https://codecov.io/gh/static-dev/spike-jss)

A simple static render for jss.

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

### Installation

`npm install spike-jss -S`

### Usage

```js
// app.js
jss({
  files: 'assets/jss/*.js',
  output: 'css/main.css'
})
```

With this config, you get your jss files processed and the stylesheet output to the path as specified. In order to access the classes, you will need to `require` or `import` the jss files into a component - they will be imported as a jss stylesheet by default. Here's an example with react:

```js
import sheet from '../jss/hero'

export default () => {
  return (<p className={sheet.classes.hello}>Hello world!</p>)
}
```

### Extractions & Critical CSS

This plugin is built with the ability to extract critical css in any way you'd like, but it won't do it for you using phantomjs etc because everyone has a different size screen and as such this is a very imprecise method. You can do something like this to extract chunks of css:

```js
// app.js
jss({
  files: 'assets/jss/*.js',
  output: 'css/main.css',
  extract: {
    layout: 'assets/jss/critical/*.js'
    index: ['assets/jss/hero.js', 'assets/jss/index-slider.js'],
    about: 'assets/jss/special-about-component.js'
  },
  addDataTo: locals // optional
})
```

You can find the extracted css chunks on your locals object under `_extractedCss` followed by the key you used for the extraction chunk. So for example you might do this in your layout:

```
html
  head
    title My cool demo page
    style {{ _extractedCss.layout }}
    block css
    script loadCss('/css/main.css')
  body
    nav
      a(href='/') Home
      a(href='/about') About
    block content
```

And this in the index file (sugarml):

```
block css
  style {{ _extractedCss.index }}
block content
  p hello world!
```

This would ensure that only your critical css for each page is rendered in the head. For more details on critical CSS stuff, see [this article](https://www.smashingmagazine.com/2015/08/understanding-critical-css/). Also note that the perf gain from using critical css is *very* small and absolutely not worth it until you have exhausted all other performance optimizations, especially images and javascript.

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)

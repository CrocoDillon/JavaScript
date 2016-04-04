const path = require('path')
const fs   = require('fs')

// Non-globals can’t be accessed directly from the global object
const nonGlobals = [
  '%TypedArray%',
  'TypedArray',
  'GeneratorFunction',
  'Generator'
]

const specs = [
  require('../specifications/ECMAScript 1.json'),
  require('../specifications/ECMAScript 2.json'),
  require('../specifications/ECMAScript 3.json'),
  require('../specifications/ECMAScript 5.1.json'),
  require('../specifications/ECMAScript 2015.json'),
  require('../specifications/ECMAScript 2016.json')
]

const latest = specs.length - 1
const tableHeader = `&nbsp;|${specs.map(spec =>
    `[${spec.shortname}](${spec.baseUrl})`
  ).join('|')}\n---${new Array(specs.length + 1).join('|---')}`
const tableData =
    specs[latest].sections.map(section => {
      const root = section.name.split(/[.[]/)[0]
      const name = nonGlobals.indexOf(root) === -1 ?
        `**\`${section.name}\`**` :
        `*\`${section.name}\`*`
      const data = specs.map(spec => getSectionData(spec, section.name))
      return `|${name}|${data.join('|')}|`
    }).join('\n')


function getSectionData(spec, name) {
  const section = spec.sections.find(section => section.name === name)
  if (!section) {
    return ''
  }
  return section.url ?
    `[\`${section.id}\`](${spec.baseUrl + section.url})` :
    `\`${section.id}\``
}

const stages = require('../specifications/ECMAScript Stages.json')
const tableStages = stages.map(p => `[**\`${p.name}\`**](${p.url})|${p.stage}`).join('\n')

const readme = path.join(__dirname, '../README.md')
const data = `\
# JavaScript

## ECMAScript Stages

These are proposals that are not yet in any finished ECMAScript Specification. The stages describe how advanced the proposal is in the [TC39 release process](https://tc39.github.io/process-document/). There is stage 0 (strawman), stage 1 (proposal), stage 2 (draft), stage 3 (candidate) and finally stage 4 (finished). Stage 4 means the proposal will probably be part of the next ECMAScript Specification. At any time in this release process a proposal can be dropped.

Proposal|Stage
--------|-----
${tableStages}

## ECMAScript Specification Overview

${tableHeader}
${tableData}
`
fs.writeFileSync(readme, data)

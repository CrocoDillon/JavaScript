const path = require('path')
const fs   = require('fs')

const specs = [
  require('../specifications/ECMAScript 1.json'),
  require('../specifications/ECMAScript 2.json'),
  require('../specifications/ECMAScript 3.json'),
  require('../specifications/ECMAScript 5.1.json'),
  require('../specifications/ECMAScript 2015.json')
]

const latest = specs.length - 1
const tableHeader = `&nbsp;|${specs.map(spec =>
    `[${spec.shortname}](${spec.baseUrl})`
  ).join('|')}\n---${new Array(specs.length + 1).join('|---')}`
const tableData =
    specs[latest].sections.map(section =>
      `|**\`${section.name}\`**|${
        specs.map(spec => getSectionData(spec, section.name)).join('|')
      }|`
    ).join('\n')


function getSectionData(spec, name) {
  const section = spec.sections.find(section => section.name === name)
  if (!section) {
    return ''
  }
  return section.url ?
    `[\`${section.id}\`](${spec.baseUrl + section.url})` :
    `\`${section.id}\``
}

const readme = path.join(__dirname, '../README.md')
const data = `\
# JavaScript

## ECMAScript Specification Overview

${tableHeader}
${tableData}
`
fs.writeFileSync(readme, data)

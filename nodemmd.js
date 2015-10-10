var mmd = require('./micromarkdown.js'),
  colors = require('colors'),
  tests = [];

console.log(mmd.parse('*foobar*\n**lorem** ***ipsum***\n\n* this\n* is a\n* list\n'));

tests = [
  {'name': 'header 1', 'input': '#Header1', 'output': '<h1>Header1</h1>'},
  {'name': 'header 2', 'input': '##Header2', 'output': '<h2>Header2</h2>'},
  {'name': 'header 3', 'input': '###Header3', 'output': '<h3>Header3</h3>'},
  {'name': 'link 1', 'input': '[SimonWaldherr](http://simon.waldherr.eu/)', 'output': '<a href="http://simon.waldherr.eu/">SimonWaldherr</a>'},
  {'name': 'link 2', 'input': '[SimonWaldherr][1]\n[1]: http://simon.waldherr.eu/', 'output': '<a href="http://simon.waldherr.eu/">SimonWaldherr</a>'},
  {'name': 'link 3', 'input': '[foobar $& example](http://google.de)', 'output': '<a href="http://google.de">foobar &#x0024&amp; example</a>'},
  {'name': 'bold', 'input': '**bold** text', 'output': '<b>bold</b> text'},
  {'name': 'italic', 'input': '*italic* test', 'output': '<i>italic</i> test'},
  {'name': 'bold+italic', 'input': '*italic and **bold** text*', 'output': '<i>italic and <b>bold</b> text</i>'},
  {'name': 'ordered list', 'input': '1. this\n2. is a\n3. list', 'output': '<ol><li>this</li>\n<li>is a</li>\n<li>list</li>\n</ol>'},
  {'name': 'unordered list', 'input': '* this\n* is a\n* list', 'output': '<ul><li>this</li>\n<li>is a</li>\n<li>list</li>\n</ul>'},
  {'name': 'nested list', 'input': '* this\n* is a\n  1. test\n  1. and\n  1. demo\n* list', 'output': '<ul><li>this</li>\n<li>is a</li>\n<ol><li>test</li>\n<li>and</li>\n<li>demo</li>\n</ol><li>list</li>\n</ul>'},
  {'name': 'table', 'input': 'this | is a   | table  \n-----|--------|--------\nwith | sample | content\nlorem| ipsum  | dolor  \nsit  | amet   | sed    \ndo   | eiusom | tempor ', 'output': '<table><tr><th>this</th><th>is a</th><th>table</th></tr><tr><td>with</td><td>sample</td><td>content</td></tr>\n<tr><td>lorem</td><td>ipsum</td><td>dolor</td></tr>\n<tr><td>sit</td><td>amet</td><td>sed</td></tr>\n<tr><td>do</td><td>eiusom</td><td>tempor</td></tr>\n</table>'}];

for(i in tests) {
  if(mmd.parse(tests[i].input, true).trim() === tests[i].output) {
    console.log(tests[i].name.green);
  } else {
    console.log(tests[i].name.red);
  }
}

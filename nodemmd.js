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
  {'name': 'bold', 'input': '**bold** text', 'output': '<b>bold</b> text'},
  {'name': 'italic', 'input': '*italic* test', 'output': '<i>italic</i> test'},
  {'name': 'bold+italic', 'input': '*italic and **bold** text*', 'output': '<i>italic and <b>bold</b> text</i>'}];

for(i in tests) {
  if(mmd.parse(tests[i].input, true).trim() === tests[i].output) {
    console.log(tests[i].name.green);
  } else {
    console.log(tests[i].name.red);
  }
}

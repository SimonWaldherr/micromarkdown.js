var mmd = require('./micromarkdown.js'),
  colors = require('colors');

console.log(mmd.parse('*foobar*\n**lorem** ***ipsum***\n\n* this\n* is a\n* list\n'));

if (mmd.parse('#Header1').trim() === '<h1>Header1</h1>') {
  console.log('* header 1'.green);
} else {
  console.log('* header 1'.red);
}

if (mmd.parse('##Header2').trim() === '<h2>Header2</h2>') {
  console.log('* header 2'.green);
} else {
  console.log('* header 2'.red);
}

if (mmd.parse('###Header3').trim() === '<h3>Header3</h3>') {
  console.log('* header 3'.green);
} else {
  console.log('* header 3'.red);
}

if (mmd.parse('[SimonWaldherr](http://simon.waldherr.eu/)', true).trim() === '<a href="http://simon.waldherr.eu/">SimonWaldherr</a>') {
  console.log('* link 1'.green);
} else {
  console.log('* link 1'.red);
}

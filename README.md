# ![micromarkdown.js](http://simonwaldherr.de/umd.png)

[![Build Status](https://travis-ci.org/SimonWaldherr/micromarkdown.js.svg?branch=master)](https://travis-ci.org/SimonWaldherr/micromarkdown.js)
[![Flattr donate button](https://raw.github.com/balupton/flattr-buttons/master/badge-89x18.gif)](https://flattr.com/submit/auto?user_id=SimonWaldherr&url=http%3A%2F%2Fgithub.com%2FSimonWaldherr%2Fmicromarkdown.js "Donate monthly to this project using Flattr")

convert [markdown](http://en.wikipedia.org/wiki/Markdown) to [HTML](http://en.wikipedia.org/wiki/HTML) in under 5kb  
take a look at the to PHP translated version: https://github.com/SimonWaldherr/micromarkdown.php

## about

License:   MIT  
Version: 0.3.4  
Date:  10.2015  

## howto

### browser

```html
<script type="text/javascript" src="//simonwaldherr.github.io/micromarkdown.js/dist/micromarkdown.min.js"></script>
```

```js
var input = document.getElementById('input').value,
    outputEle = document.getElementById('outEle');

outputEle.innerHTML = micromarkdown.parse(input);
```

### node

install via npm

```sh
npm install micromarkdown
```

```node
var mmd = require('micromarkdown');
console.log(mmd.parse('*foobar*\n**lorem** ***ipsum***\n\n* this\n* is a\n* list\n'));
```

or take a look at the ***nodemmd.js*** node example

```sh
node nodemmd.js
```

## demo

Test this code on the associated github page [simonwaldherr.github.io/micromarkdown.js/](http://simonwaldherr.github.io/micromarkdown.js/).  
There is also a [Testpage](http://simonwaldherr.github.io/micromarkdown.js/test.html) and a [diff between the php and the js version](http://simonwaldherr.github.io/micromarkdown.js/diff.html).

## contact

Feel free to contact me via [eMail](mailto:contact@simonwaldherr.de) or on [Twitter](http://twitter.com/simonwaldherr). This software will be continually developed. Suggestions and tips are always welcome.

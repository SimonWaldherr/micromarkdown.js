/*
* µmarkdown.js
* markdown in under 5kb
*
* Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
* Released under the MIT Licence
* http://simon.waldherr.eu/license/mit/
*
* Github:  https://github.com/simonwaldherr/micromarkdown.js/
* Version: 0.1.5
*/

/*jslint browser: true, plusplus: true, indent: 2, regexp: true, ass: true */
/*global ActiveXObject */

var micromarkdown = {
  useajax: false,
  regexobject: {
    headline:   /^(\#{1,6})([^\#\n]+)\n/m,
    code:       /\s\`\`\`\n?([^`]+)\`\`\`/g,
    hr:         /\n(?:([\*\-_] ?)+)\1\1\n/gm,
    lists:      /^(( *(\*|\d\.) [^\n]+)\n)+/gm,
    bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
    links:      /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
    reflinks:   /\[([^\]]+)\]\[([^\]]+)\]/g,
    mail:       /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
    tables:     /\n(([^|\n]+ *\| *)+([^|\n]+\n))(\-+\|)+(\-+\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
    include:    /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,
    url:        /<([a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g
  },
  parse: function (str) {
    'use strict';
    var line, nstatus, status, helper, helper1, helper2, count, repstr, stra, trashgc = [], casca = 0, i = 0, j = 0;
    str = '\n' + str + '\n';

    /* code */
    while ((stra = micromarkdown.regexobject.code.exec(str)) !== null) {
      str = str.replace(stra[0], '<code>\n' + micromarkdown.htmlEncode(stra[1]).replace(/\n/gm, '<br/>').replace(/\ /gm, '&nbsp;') + '</code>\n');
    }

    /* headlines */
    while ((stra = micromarkdown.regexobject.headline.exec(str)) !== null) {
      count = stra[1].length;
      str = str.replace(stra[0], '<h' + count + '>' + stra[2] + '</h' + count + '>' + '\n');
    }

    /* horizontal line */
    while ((stra = micromarkdown.regexobject.hr.exec(str)) !== null) {
      str = str.replace(stra[0], '\n<hr/>\n');
    }

    /* lists */
    while ((stra = micromarkdown.regexobject.lists.exec(str)) !== null) {
      casca = 0;
      if (stra[0].trim().substr(0, 1) === '*') {
        repstr = '<ul>';
      } else {
        repstr = '<ol>';
      }
      helper = stra[0].split('\n');
      status = 0;
      for (i = 0; i < helper.length; i++) {
        if ((line = /^(( )*(\*|\d\.) ([^\n]+))/.exec(helper[i])) !== null) {
          if (line[2] === undefined) {
            nstatus = 0;
          } else {
            nstatus = line[2].length;
          }
          if (status > nstatus) {
            repstr += '</ul>';
            status = nstatus;
            casca--;
          }
          if (status < nstatus) {
            repstr += '<ul>';
            status = nstatus;
            casca++;
          }
          repstr += '<li>' + line[4] + '</li>' + '\n';
        }
      }
      while (casca > 0) {
        repstr += '</ul>';
        casca--;
      }
      if (stra[0].trim().substr(0, 1) === '*') {
        repstr += '</ul>';
      } else {
        repstr += '</ol>';
      }
      str = str.replace(stra[0], repstr + '\n');
    }

    /* bold and italic */
    for (i = 0; i < 3; i++) {
      while ((stra = micromarkdown.regexobject.bolditalic.exec(str)) !== null) {
        repstr = [];
        if (stra[1] === '~~') {
          str = str.replace(stra[0], '<del>' + stra[2] + '</del>');
        } else {
          switch (stra[1].length) {
          case 1:
            repstr = ['<i>', '</i>'];
            break;
          case 2:
            repstr = ['<b>', '</b>'];
            break;
          case 3:
            repstr = ['<i><b>', '</b></i>'];
            break;
          }
          str = str.replace(stra[0], repstr[0] + stra[2] + repstr[1]);
        }
      }
    }

    /* tables */
    while ((stra = micromarkdown.regexobject.tables.exec(str)) !== null) {
      repstr = '<table><tr>';
      helper = stra[1].split('|');
      for (i = 0; i < helper.length; i++) {
        repstr += '<th>' + helper[i] + '</th>';
      }
      repstr += '</tr>';
      helper1 = stra[6].split('\n');
      for (i = 0; i < helper1.length; i++) {
        helper2 = helper1[i].split('|');
        if (helper2[0].length !== 0) {
          repstr += '<tr>';
          for (j = 0; j < helper2.length; j++) {
            repstr += '<td>' + helper2[j] + '</td>';
          }
          repstr += '</tr>' + '\n';
        }
      }
      repstr += '</table>';
      str = str.replace(stra[0], repstr);
    }

    /* links */
    while ((stra = micromarkdown.regexobject.links.exec(str)) !== null) {
      if (stra[0].substr(0, 1) === '!') {
        str = str.replace(stra[0], '<img src="' + stra[2] + '" alt="' + stra[1] + '" title="' + stra[1] + '" />\n');
      } else {
        str = str.replace(stra[0], '<a href="' + stra[2] + '">' + stra[1] + '</a>\n');
      }
    }
    while ((stra = micromarkdown.regexobject.mail.exec(str)) !== null) {
      str = str.replace(stra[0], '<a href="mailto:' + stra[1] + '">' + stra[1] + '</a>');
    }
    while ((stra = micromarkdown.regexobject.url.exec(str)) !== null) {
      repstr = stra[1];
      if (repstr.indexOf('://') === -1) {
        repstr = 'http://' + repstr;
      }
      str = str.replace(stra[0], '<a href="' + repstr + '">' + repstr.replace(/(https:\/\/|http:\/\/|mailto:|ftp:\/\/)/gmi, '') + '</a>');
    }
    while ((stra = micromarkdown.regexobject.reflinks.exec(str)) !== null) {
      helper1 = new RegExp('\\[' + stra[2] + '\\]: ?([^ \n]+)', "gi");
      if ((helper = helper1.exec(str)) !== null) {
        str = str.replace(stra[0], '<a href="' + helper[1] + '">' + stra[1] + '</a>');
        trashgc.push(helper[0]);
      }
    }
    for (i = 0; i < trashgc.length; i++) {
      str = str.replace(trashgc[i], '');
    }

    /* include */
    if (micromarkdown.useajax !== false) {
      while ((stra = micromarkdown.regexobject.include.exec(str)) !== null) {
        helper = stra[2].replace(/[\.\:\/]+/gm, '');
        helper1 = '';
        if (document.getElementById(helper)) {
          helper1 = document.getElementById(helper).innerHTML.trim();
        } else {
          micromarkdown.ajax(stra[2]);
        }
        if ((stra[1] === 'csv') && (helper1 !== '')) {
          helper2 = {};
          helper2[';'] = [];
          helper2[','] = [];
          helper2[0] = [';', ','];
          helper1 = helper1.split('\n');
          for (j = 0; j < helper2[0].length; j++) {
            for (i = 0; i < helper1.length; i++) {
              helper2[helper2[0][j]][i] = helper1[i].split(helper2[0][j]).length;
              if (i > 0) {
                if (helper2[helper2[0][j]] !== false) {
                  if ((helper2[helper2[0][j]][i] !== helper2[helper2[0][j]][i - 1]) || (helper2[helper2[0][j]][i] === 1)) {
                    helper2[helper2[0][j]] = false;
                  }
                }
              }
            }
          }
          if ((helper2[','] !== false) || (helper2[';'] !== false)) {
            if (helper2[';'] !== false) {
              helper2 = ';';
            } else {
              helper2 = ',';
            }
            repstr = '<table>';
            for (i = 0; i < helper1.length; i++) {
              helper = helper1[i].split(helper2);
              repstr += '<tr>';
              for (j = 0; j < helper.length; j++) {
                repstr += '<td>' + micromarkdown.htmlEncode(helper[j]) + '</td>';
              }
              repstr += '</tr>';
            }
            repstr += '</table>';
            str = str.replace(stra[0], repstr);
          } else {
            str = str.replace(stra[0], '<code>' + helper1.join('\n') + '</code>');
          }
        } else {
          str = str.replace(stra[0], '');
        }
      }
    }

    str = str.replace(/ {2,}[\n]{1,}/gmi, '<br/><br/>');
    return str;
  },
  ajax: function (str) {
    'use strict';
    var xhr;
    if (document.getElementById(str.replace(/[\.\:\/]+/gm, ''))) {
      return false;
    }
    if (window.ActiveXObject) {
      try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        xhr = null;
        return e;
      }
    } else {
      xhr = new XMLHttpRequest();
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var ele = document.createElement('code');
        ele.innerHTML = xhr.responseText;
        ele.id = str.replace(/[\.\:\/]+/gm, '');
        ele.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(ele);
        micromarkdown.useajax();
      }
    };
    xhr.open('GET', str, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
  },
  countingChars: function (string, split) {
    'use strict';
    string = string.split(split);
    if (typeof string === 'object') {
      return string.length - 1;
    }
    return 0;
  },
  htmlEncode: function (str) {
    'use strict';
    return str.replace(/[^a-zA-Z0-9\.:\n]/g, function (c) {
      return '&' + (micromarkdown.entityTable[c.charCodeAt(0)] || '#' + c.charCodeAt(0)) + ';';
    });
  },
  entityTable: {32: 'nbsp', 34: 'quot', 38: 'amp', 39: 'apos', 60: 'lt', 62: 'gt', 161: 'iexcl', 162: 'cent', 163: 'pound', 164: 'curren', 165: 'yen', 166: 'brvbar', 167: 'sect', 168: 'uml', 169: 'copy', 170: 'ordf', 171: 'laquo', 172: 'not', 173: 'shy', 174: 'reg', 175: 'macr', 176: 'deg', 177: 'plusmn', 178: 'sup2', 179: 'sup3', 180: 'acute', 181: 'micro', 196: 'Auml', 203: 'Euml', 207: 'Iuml', 214: 'Ouml', 220: 'Uuml', 223: 'szlig', 228: 'auml', 235: 'euml', 239: 'iuml', 246: 'ouml', 252: 'uuml', 255: 'yuml', 913: 'Alpha', 914: 'Beta', 915: 'Gamma', 916: 'Delta', 917: 'Epsilon', 918: 'Zeta', 919: 'Eta', 920: 'Theta', 921: 'Iota', 922: 'Kappa', 923: 'Lambda', 924: 'Mu', 925: 'Nu', 926: 'Xi', 927: 'Omicron', 928: 'Pi', 929: 'Rho', 931: 'Sigma', 932: 'Tau', 933: 'Upsilon', 934: 'Phi', 935: 'Chi', 936: 'Psi', 937: 'Omega', 945: 'alpha', 946: 'beta', 947: 'gamma', 948: 'delta', 949: 'epsilon', 950: 'zeta', 951: 'eta', 952: 'theta', 953: 'iota', 954: 'kappa', 955: 'lambda', 956: 'mu', 957: 'nu', 958: 'xi', 959: 'omicron', 960: 'pi', 961: 'rho', 962: 'sigmaf', 963: 'sigma', 964: 'tau', 965: 'upsilon', 966: 'phi', 967: 'chi', 968: 'psi', 969: 'omega', 8364: 'euro'}
};

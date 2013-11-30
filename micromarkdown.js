/*
* µmarkdown.js
* markdown in under 5kb
*
* Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
* Released under the MIT Licence
* http://simon.waldherr.eu/license/mit/
*
* Github:  https://github.com/simonwaldherr/micromarkdown.js/
* Version: 0.1.1
*/

/*jslint browser: true, plusplus: true, indent: 2, regexp: true, ass: true */
/*global ActiveXObject */

var micromarkdown = {
  useajax: false,
  regexobject: {
    code: /\n\`\`\`\n([^`]+)\`\`\`/g,
    headline: /^(\#{1,6})([^\#\n]+)\n/m,
    bolditalic: /(?:([\*_]+))([^\s\*_]+)\1/g,
    tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))(\-+\|)+(\-+\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
    lists: /^(( *\* [^\n]+)\n)+/gmi,
    lists2: /^(( )*\* ([^\n]+))/g,
    links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
    include: /\[include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)\]/gi
  },
  parse: function (str) {
    'use strict';
    var line, nstatus, status, helper, helper1, helper2, count, repstr, stra, i = 0, j = 0;
    str = '\n' + str + '\n';

    /* code */
    while ((stra = micromarkdown.regexobject.code.exec(str)) !== null) {
      str = str.replace(stra[0], '<code>\n' + micromarkdown.htmlencode(stra[1]).replace(/\n/gm, '<br/>').replace(/\ /gm, '&nbsp;') + '</code>\n');
    }

    /* headlines */
    while ((stra = micromarkdown.regexobject.headline.exec(str)) !== null) {
      count = stra[1].length;
      str = str.replace(stra[0], '<h' + count + '>' + stra[2] + '</h' + count + '>' + '\n');
    }

    /* bold and italic */
    while ((stra = micromarkdown.regexobject.bolditalic.exec(str)) !== null) {
      repstr = [];
      switch (stra[1].length) {
      case 1:
        repstr = ['<i>', '</i>\n'];
        break;
      case 2:
        repstr = ['<b>', '</b>\n'];
        break;
      case 3:
        repstr = ['<i><b>', '</b></i>\n'];
        break;
      }
      str = str.replace(stra[0], repstr[0] + stra[2] + repstr[1]);
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

    /* lists */
    while ((stra = micromarkdown.regexobject.lists.exec(str)) !== null) {
      repstr = '<ul>';
      helper = stra[0].split('\n');
      status = 0;
      for (i = 0; i < helper.length; i++) {
        if ((line = micromarkdown.regexobject.lists2.exec(helper[i])) !== null) {
          if (line[2] === undefined) {
            nstatus = 0;
          } else {
            nstatus = line[2].length;
          }
          if (status > nstatus) {
            repstr += '<ul>';
            status = nstatus;
          }
          repstr += '<li>' + line[3] + '</li>' + '\n';
          if (status < nstatus) {
            repstr += '</ul>';
            status = nstatus;
          }
        }
      }
      repstr += '</ul>';
      str = str.replace(stra[0], repstr + '\n');
    }

    /* links */
    while ((stra = micromarkdown.regexobject.links.exec(str)) !== null) {
      str = str.replace(stra[0], '<a href="' + stra[2] + '">' + stra[1] + '</a>\n');
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
          helper1 = helper1.split('\n');
          for (i = 0; i < helper1.length; i++) {
            helper2[';'][i] = helper1[i].split(';').length;
            if (i > 0) {
              if (helper2[';'] !== false) {
                if ((helper2[';'][i] !== helper2[';'][i - 1]) || (helper2[';'][i] === 1)) {
                  helper2[';'] = false;
                }
              }
            }
            helper2[','][i] = helper1[i].split(',').length;
            if (i > 0) {
              if (helper2[','] !== false) {
                if ((helper2[','][i] !== helper2[','][i - 1]) || (helper2[','][i] === 1)) {
                  helper2[','] = false;
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
                repstr += '<td>' + helper[j] + '</td>';
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

    str = str.replace(/ {2,}[\n]{1,}/gmi, '</br></br>');
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
  htmlencode: function (str) {
    'use strict';
    return str.replace(/[\u00A0-\u2666<>\&]/g, function (c) {
      return '&' + (micromarkdown.entityTable[c.charCodeAt(0)] || '#' + c.charCodeAt(0)) + ';';
    });
  },
  entityTable: {34: 'quot', 38: 'amp', 39: 'apos', 60: 'lt', 62: 'gt', 160: 'nbsp', 161: 'iexcl', 162: 'cent', 163: 'pound', 164: 'curren', 165: 'yen', 166: 'brvbar', 167: 'sect', 168: 'uml', 169: 'copy', 170: 'ordf', 171: 'laquo', 172: 'not', 173: 'shy', 174: 'reg', 175: 'macr', 176: 'deg', 177: 'plusmn', 178: 'sup2', 179: 'sup3', 180: 'acute', 181: 'micro', 182: 'para', 183: 'middot', 184: 'cedil', 185: 'sup1', 186: 'ordm', 187: 'raquo', 188: 'frac14', 189: 'frac12', 190: 'frac34', 191: 'iquest', 192: 'Agrave', 193: 'Aacute', 194: 'Acirc', 195: 'Atilde', 196: 'Auml', 197: 'Aring', 198: 'AElig', 199: 'Ccedil', 200: 'Egrave', 201: 'Eacute', 202: 'Ecirc', 203: 'Euml', 204: 'Igrave', 205: 'Iacute', 206: 'Icirc', 207: 'Iuml', 208: 'ETH', 209: 'Ntilde', 210: 'Ograve', 211: 'Oacute', 212: 'Ocirc', 213: 'Otilde', 214: 'Ouml', 215: 'times', 216: 'Oslash', 217: 'Ugrave', 218: 'Uacute', 219: 'Ucirc', 220: 'Uuml', 221: 'Yacute', 222: 'THORN', 223: 'szlig', 224: 'agrave', 225: 'aacute', 226: 'acirc', 227: 'atilde', 228: 'auml', 229: 'aring', 230: 'aelig', 231: 'ccedil', 232: 'egrave', 233: 'eacute', 234: 'ecirc', 235: 'euml', 236: 'igrave', 237: 'iacute', 238: 'icirc', 239: 'iuml', 240: 'eth', 241: 'ntilde', 242: 'ograve', 243: 'oacute', 244: 'ocirc', 245: 'otilde', 246: 'ouml', 247: 'divide', 248: 'oslash', 249: 'ugrave', 250: 'uacute', 251: 'ucirc', 252: 'uuml', 253: 'yacute', 254: 'thorn', 255: 'yuml', 402: 'fnof', 913: 'Alpha', 914: 'Beta', 915: 'Gamma', 916: 'Delta', 917: 'Epsilon', 918: 'Zeta', 919: 'Eta', 920: 'Theta', 921: 'Iota', 922: 'Kappa', 923: 'Lambda', 924: 'Mu', 925: 'Nu', 926: 'Xi', 927: 'Omicron', 928: 'Pi', 929: 'Rho', 931: 'Sigma', 932: 'Tau', 933: 'Upsilon', 934: 'Phi', 935: 'Chi', 936: 'Psi', 937: 'Omega', 945: 'alpha', 946: 'beta', 947: 'gamma', 948: 'delta', 949: 'epsilon', 950: 'zeta', 951: 'eta', 952: 'theta', 953: 'iota', 954: 'kappa', 955: 'lambda', 956: 'mu', 957: 'nu', 958: 'xi', 959: 'omicron', 960: 'pi', 961: 'rho', 962: 'sigmaf', 963: 'sigma', 964: 'tau', 965: 'upsilon', 966: 'phi', 967: 'chi', 968: 'psi', 969: 'omega', 977: 'thetasym', 978: 'upsih', 982: 'piv', 8226: 'bull', 8230: 'hellip', 8242: 'prime', 8243: 'Prime', 8254: 'oline', 8260: 'frasl', 8472: 'weierp', 8465: 'image', 8476: 'real', 8482: 'trade', 8501: 'alefsym', 8592: 'larr', 8593: 'uarr', 8594: 'rarr', 8595: 'darr', 8596: 'harr', 8629: 'crarr', 8656: 'lArr', 8657: 'uArr', 8658: 'rArr', 8659: 'dArr', 8660: 'hArr', 8704: 'forall', 8706: 'part', 8707: 'exist', 8709: 'empty', 8711: 'nabla', 8712: 'isin', 8713: 'notin', 8715: 'ni', 8719: 'prod', 8721: 'sum', 8722: 'minus', 8727: 'lowast', 8730: 'radic', 8733: 'prop', 8734: 'infin', 8736: 'ang', 8743: 'and', 8744: 'or', 8745: 'cap', 8746: 'cup', 8747: 'int', 8756: 'there4', 8764: 'sim', 8773: 'cong', 8776: 'asymp', 8800: 'ne', 8801: 'equiv', 8804: 'le', 8805: 'ge', 8834: 'sub', 8835: 'sup', 8836: 'nsub', 8838: 'sube', 8839: 'supe', 8853: 'oplus', 8855: 'otimes', 8869: 'perp', 8901: 'sdot', 8968: 'lceil', 8969: 'rceil', 8970: 'lfloor', 8971: 'rfloor', 9001: 'lang', 9002: 'rang', 9674: 'loz', 9824: 'spades', 9827: 'clubs', 9829: 'hearts', 9830: 'diams', 338: 'OElig', 339: 'oelig', 352: 'Scaron', 353: 'scaron', 376: 'Yuml', 710: 'circ', 732: 'tilde', 8194: 'ensp', 8195: 'emsp', 8201: 'thinsp', 8204: 'zwnj', 8205: 'zwj', 8206: 'lrm', 8207: 'rlm', 8211: 'ndash', 8212: 'mdash', 8216: 'lsquo', 8217: 'rsquo', 8218: 'sbquo', 8220: 'ldquo', 8221: 'rdquo', 8222: 'bdquo', 8224: 'dagger', 8225: 'Dagger', 8240: 'permil', 8249: 'lsaquo', 8250: 'rsaquo', 8364: 'euro'}
};

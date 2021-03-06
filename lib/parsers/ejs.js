"use strict";

// strips everything but the javascript bits
function parseEJS(str, options) {
  options = options || {};
  var open = options.open || '<%',
    close = options.close || '%>';

  var buf = [];

  for (var i = 0, len = str.length; i < len; ++i) {
    if (str.slice(i, open.length + i) === open) {
      i += open.length;
      switch (str.substr(i, 1)) {
        case '=':
        case '-':
          ++i;
          break;
      }

      var end = str.indexOf(close, i), js = str.substring(i, end), start = i, n = 0;
      if ('-' === js[js.length - 1]) {
        js = js.substring(0, js.length - 2);
      }

      while ((n = js.indexOf("\n", n)) > -1) {
        n += 1;
        buf.push("\n");
      }

      // skip EJS include statements which are not valid javascript
      if (/^\s*include\s*[^\s]+\s*$/.test(js)) js = "";
      buf.push(js, ';');
      i += end - start + close.length - 1;

    } else if (str.substr(i, 1) === "\n") {
      buf.push("\n");
    }
  }

  return buf.join('');
}

// generate extracted strings file from EJS
exports.ejs = function EJS(ejsSources, options) {
  Object.keys(ejsSources).forEach(function (filename) {
    ejsSources[filename] = parseEJS(ejsSources[filename]);
  });

  return [ejsSources, options];
};

// generate extracted strings file from Jinja2 templates
exports.jinja = function Jinja(jinjaSources, options) {
  Object.keys(jinjaSources).forEach(function (filename) {
    jinjaSources[filename] = parseEJS(jinjaSources[filename], {open: "{{", close: "}}"});
  });

  return [jinjaSources, options];
};
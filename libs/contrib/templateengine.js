/**
 * @see: http://ejohn.org/blog/javascript-micro-templating/
 * @see: https://www.manning.com/books/secrets-of-the-javascript-ninja
 */

var cache = {};

module.exports = function tmpl(str, data) {

//
// Figure out if we're getting a template, or if we need to
// load the template - and be sure to cache the result.
//
var fn = !/\W/.test(str) ?
    cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

  //
  // Generate a reusable function that will serve as a template
  // generator (and which will be cached).
  //
    new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

          // Introduce the data as local variables using with
            "with(obj){p.push('" +

          // Convert the template into pure JavaScript
            str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'")
            + "');}return p.join('');");

// Provide some basic currying to the user
return data ? fn(data) : fn;
};


/**
 * @source: https://github.com/krasimir/absurd/blob/master/lib/processors/html/helpers/TemplateEngine.js
 * @see: http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
module.exports = function(html, options) {
	var re = /<%(.+?)%>/g,
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
		code = 'with(obj) { var r=[];\n',
		cursor = 0,
		result;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
	try { result = new Function('obj', code).apply(options, [options]); }
	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
}
*/

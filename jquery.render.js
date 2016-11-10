;(function($) {
	var caches = {};

	String.prototype.toJSON = function() {
		ret = '"';
		var c;
		for (var i = 0; i < this.length; i++) {
			if (this.charCodeAt(i) > 128) {
				c = escape(this.charAt(i)).replace('%u', '\\u');
			} else {
				switch (this.charAt(i)) {
				case '\b':
					c = '\\b';
					break;
				case '\f':
					c = '\\f';
					break;
				case '\n':
					c = '\\n';
					break;
				case '\r':
					c = '\\r';
					break;
				case '\t':
					c = '\\t';
					break;
				case '\'':
					c = '\\\'';
					break;
				case '\"':
					c = '\\\"';
					break;
				case '\\':
					c = '\\\\';
					break;
				default:
					c = this.charAt(i);
				}
			}
			ret += c;
		}
		ret += '"';
		return ret;
	};

	$.render = function(options) {
		this.options = $.extend({}, this.options, options);
	};

	$.render.prototype = {
		options: {
			debug: false
		},
		parse: function(html) {
			var codes = [];
			var k = 0;

			// {loop list value} 或 {loop list key value}
			html = $.trim(html).replace(/\s*[\r\n]\s*/g,'').replace(/\{loop\s+([^\s]+)\s+(([^\s\}]+)\s+)?([^\}]+)\}/ig, function($0, $1, $2, $3, $4) {
				if(typeof($3) === 'undefined' || $3 === '') {
					$3 = '__key' + (++k);
				}
				codes.push('");\nvar ' + $3 + ';\nfor(' + $3 + ' in ' + $1 + ') {\nvar ' + $4 + ' = ' + $1 + '[' + $3 + '];\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			// {else if exp} 或 {if exp}
			html = html.replace(/\{(else\s*)?if\s+([^\}]+)\}/ig, function($0, $1, $2) {
				codes.push('");\n' + ($1 ? '} ' + $.trim($1) + ' ' : '') + 'if(' + $2 + ') {\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			// {else}
			html = html.replace(/\{else\}/ig, function() {
				codes.push('");\n} else {\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			// {/loop} 或 {/if} 或 {/func}
			html = html.replace(/\{\/(loop|if|func)\}/ig, function() {
				codes.push('");\n}\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			// ${var}
			html = html.replace(/\$\{([^\}]+)\}/ig, function($0, $1) {
				codes.push('");\n__stack.push(' + $1 + ');\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			// {func:name $1, $2}
			html = html.replace(/\{func\:([^\s]+)\s+([^\}]+)\}/ig, function($0, $1, $2) {
				codes.push('");\nfunction ' + $1 + '(' + $2 + ') {\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			// {call:name $1, $2}
			html = html.replace(/\{call\:([^\s]+)\s+([^\}]+)\}/ig, function($0, $1, $2) {
				codes.push('");\n' + $1 + '.call(this, ' + $2 + ');\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			// {%js code%} 或 /*{%js code%}*/
			html = html.replace(/(\/\*)?\{\%(%?!\}|[^%]+)+\%\}(\*\/)?/g, function($0, $1, $2) {
				codes.push('");\n' + $2 + '\n__stack.push("');
				return '<{' + (codes.length - 1) + '}>';
			});

			var js = 'var __stack = [];\n__stack.push(' + html.toJSON() + ');\nreturn __stack.join("");';
			js = js.replace(/\<\{(\d+)\}\>/g, function($0, $1) {
				return codes[parseInt($1)];
			}).replace(/__stack\.push\(""\);\s+/g,'');

			if(this.options.debug) {
				var lines = js.split('\n');
				var i, depth = "", line;

				for(i = 0; i<lines.length; i++) {
					line = lines[i];
					if(line.charAt(0) === '}') {
						if(depth) {
							depth = depth.substr(0, depth.length-1);
						}
					}
					lines[i] = depth + line;
					if(line.charAt(line.length - 1) === '{') {
						depth += '\t';
					}
				}

				js = lines.join($.browser.msie && $.browser.version <= "7.0" ? '\r\n' : '\n');

				$('<pre style="border:1px gray solid;padding:5px;">').attr('title', "模板 " + this.tpl + " 的编译结果！").text(js).appendTo(document.body);
			}
			this.run = new Function('data', js);
		},
		run: function() {
			return '还没有执行过this.parse()方法！';
		}
	};

	$.fn.render = function(tpl, data, isReturn, isAppend, options) {
		var $tpl = $('#' + tpl);
		if($tpl.size() == 0) {
			alert('没找到模板“' + tpl + '”！');
			return false;
		}else if(caches[tpl]) {
			r = caches[tpl];
		} else {
			var r = new $.render(options);
			r.tpl = tpl;
			r.parse($tpl.html());
			caches[tpl] = r;
		}

		var html = r.run(data);

		if(isReturn) {
			return isReturn;
		} else if(isAppend) {
			this.append(html);
		} else {
			this.html(html);
		}

		return this;
	};
})(jQuery);
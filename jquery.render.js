(function($) {
	$.renderParse = function(tpl, html, debug) {
		const codes = [];
		let k = 0;

		// {loop list value} 或 {loop list key value}
		html = $.trim(html).replace(/\s*[\r\n]\s*/g,'').replace(/\{loop\s+([^\s]+)\s+(([^\s\}]+)\s+)?([^\}]+)\}/ig, function($0, $1, $2, $3, $4) {
			if(typeof($3) === 'undefined' || $3 === '') {
				$3 = '__key' + (++k);
			}
			const code = codes.length;
			codes.push('");\nlet ' + $3 + ';\nfor(' + $3 + ' in ' + $1 + ') {\nlet ' + $4 + ' = ' + $1 + '[' + $3 + '];\n__stack.push("');
			return '<{' + code + '}>';
		});

		// {else if exp} 或 {if exp}
		html = html.replace(/\{(else\s*)?if\s+([^\}]+)\}/ig, function($0, $1, $2) {
			const code = codes.length;
			codes.push('");\n' + ($1 ? '} ' + $.trim($1) + ' ' : '') + 'if(' + $2 + ') {\n__stack.push("');
			return '<{' + code + '}>';
		});

		// {else}
		html = html.replace(/\{else\}/ig, function() {
			const code = codes.length;
			codes.push('");\n} else {\n__stack.push("');
			return '<{' + code + '}>';
		});

		// {/loop} 或 {/if} 或 {/func}
		html = html.replace(/\{\/(loop|if|func)\}/ig, function() {
			const code = codes.length;
			codes.push('");\n}\n__stack.push("');
			return '<{' + code + '}>';
		});

		// ${var}
		html = html.replace(/\$\{([^\}]+)\}/ig, function($0, $1) {
			const code = codes.length;
			codes.push('");\n__stack.push(' + $1 + ');\n__stack.push("');
			return '<{' + code + '}>';
		});

		// {func:name $1, $2}
		html = html.replace(/\{func\:([^\s]+)\s+([^\}]+)\}/ig, function($0, $1, $2) {
			const code = codes.length;
			codes.push('");\nfunction ' + $1 + '(' + $2 + ') {\n__stack.push("');
			return '<{' + code + '}>';
		});

		// {call:name $1, $2}
		html = html.replace(/\{call\:([^\s]+)\s+([^\}]+)\}/ig, function($0, $1, $2) {
			const code = codes.length;
			codes.push('");\n' + $1 + '.call(this, ' + $2 + ');\n__stack.push("');
			return '<{' + code + '}>';
		});

		// {%js code%} 或 /*{%js code%}*/
		html = html.replace(/(\/\*)?\{\%(%?!\}|[^%]+)+\%\}(\*\/)?/g, function($0, $1, $2) {
			const code = codes.length;
			codes.push('");\n' + $2 + '\n__stack.push("');
			return '<{' + code + '}>';
		});

		let js = 'let __stack = [];\n__stack.push(' + JSON.stringify(html) + ');\nreturn __stack.join("");';
		js = js.replace(/\<\{(\d+)\}\>/g, function($0, $1) {
			return codes[parseInt($1)];
		}).replace(/__stack\.push\(""\);\s+/g,'');

		if(debug) {
			const lines = js.split('\n'), sz = lines.length.toString().length;
			let i, depth = '';

			for(i = 0; i<lines.length; i++) {
				const line = lines[i];
				if(line.charAt(0) === '}') {
					if(depth) {
						depth = depth.substring(0, depth.length-4);
					}
				}
				lines[i] = depth + line;
				if(line.charAt(line.length - 1) === '{') {
					depth += '    ';
				}
			}

			js = lines.join('\n');

			const code = lines.map(function(v,i) {
				return (i + 3).toString().padStart(sz, ' ') + ' ' + v;
			}).join('\r\n');
			$('<pre style="border:1px gray solid;padding:5px;font-family:Consolas, Monaco, Courier New, Menlo, monospace;font-size:14px;">').attr('title', 'Template "' + tpl + '" of compile result').text(code).appendTo(document.body);
		}

		return new Function('data', js);
	};
	$.fn.render = function(tpl, data, isAppend, debug) {
		const html = $.renderHTML(tpl, data, debug);

		if(isAppend) {
			this.append(html);
		} else {
			this.html(html);
		}

		return this;
	};
	$.renderHTML = function(tpl, data, debug) {
		const $tpl = $('#tpl-' + tpl);
		if(!$tpl.length) return '<div id="tpl-' + tpl + '">' + tpl + ' template not found!</div>';

		let run = $tpl.data('render');
		if(!run) {
			run = $.renderParse(tpl, $tpl.html(), debug);
			$tpl.data('render', run);
		}
		return run(data);
	};
})(jQuery);
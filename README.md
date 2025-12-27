# jquery-render
JavaScript版的模板引擎(jquery-render)

## 运行环境要求
  * 所有流行浏览器，如：IE, Firefox, chrome等
  * jQuery 1.8.3
  * HTML4以上
  * 平台不限

## 语法
  * 循环语句：{loop list value} ... {/loop} 或 {loop list key value} ... {/loop}
  * 判断语句：{if exp} ... {else if exp} ... {else} ... {/if}
  * 变量输出：${var}
  * 函数定义：{func:name $1, $2} {/func}
  * 函数调用：{call:name $1, $2}
  * 自定义JS：{%js code%} 或 /\*{%js code%}\*/

## 功能
  * $().render(tpl, data, isAppend, debug)
    * tpl: string 模板名称, 如: demo, 模板代码所在的元素ID为tpl-demo
    * data: object 渲染模板所需数据，如：{list:[{id:1,name:'a'}],type:1}
    * isAppend: boolean 是否附加到最后
    * debug: boolean 是否输出调试代码
    * 返回jQuery对象
  * $.renderHTML(tpl, data, debug)
    * tpl: string 模板名称
    * data: object 渲染模板所需数据，如：{list:[{id:1,name:'a'}],type:1}
    * debug: boolean 是否输出调试代码
    * 返回模板执行结果
  * $.renderParse(tpl, html, debug)
    * tpl: string 模板名称
    * html: string 模板内容
    * debug: boolean 是否输出调试代码
    * 返回 function(data) {}

## 作者
  * 姓名：张宝财
  * 邮箱：talent518@yeah.net

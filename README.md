# jquery-render
JavaScript版的模板引擎(jquery-render)

## 运行环境要求
  * 所有流行浏览器，如：IE, Firefox, chrome等
  * jQuery 1.8.3
  * HTML4以上
  * 平台不限

## 语法
  * 循环语句：{loop value} ... {/loop} 或 {loop list key value} ... {/loop}
  * 判断语句：{if exp} ... {else if exp} ... {else} ... {/if}
  * 变量输出：${var}
  * 函数定义：{func:name $1, $2} {/func}
  * 函数调用：{call:name $1, $2}
  * 自定义JS：{{js code}} 或 /*{{js code}}*/

## 功能
  * $().render(tpl, data, isReturn, isAppend, options)
    * tpl(string): 模板代码所在的元素ID，如：'tpl-demo'
    * data(object): 张歆艺渲染模板所需数据，如：{list:[{id:1,name:'a'}],type:1}
    * isReturn(boolean): 返回执行结果为HTML
    * isAppend(boolean): 是否附加到最后
    * options(object): 选项，如：{debug:true}
  * $.render(options): 必须使用new方式创建对象
  * $.render.parse(tpl): 编译模板ID为tpl的模板，并覆盖$.render.run方法
  * $.render.run: 必须先执行$.render.parse后，方可使用，否则会弹出提醒信息

## 作者
  * 姓名：张宝财
  * 邮箱：talent518@yeah.net

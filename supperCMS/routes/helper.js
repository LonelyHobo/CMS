var express = require('express');
var router = module.exports = express.Router();



var hbs = require('hbs');
hbs.helper = {
	section: function(name, block){
	    if(!this._sections) this._sections = {};
	    this._sections[name] = block.fn(this);
	    return null;
	},
}
/**自定义等于
 * @context 代表表达式中的引用上下文
 * @fn 代表正确返回的内容
 * @context.fn(this)中this指向resp.render返回的数据
 * */
hbs.registerHelper('eq', function (n1,n2,context) {
    if(n1==n2){
        // return context.fn(n1===n2);
        return context.fn(this);//this 代表传原始的数据
    }
    /*不满足条件,保证能显示页面中元素*/
    return context.inverse(this);
});

module.exports = hbs
const css = require('css'); // 语法分析，词法分析css包，变成AST

const EOF = Symbol('EOF'); // EOF:End Of File

const layout = require('./layout.js');

let currentToken = null; // tag不管多复杂都当做一个token
let currentAttribute = null;

let stack = [{type:'document', children:[]}]; // 给栈一个初始根节点
let currentTextNode = null;

// 加入一个新的函数， addCSSRules,这里我们把css规则暂存到一个数组里
let rules = [];
function addCSSRules(text) {
    let ast = css.parse(text); // 转化成ast
    // console.log(JSON.stringify(ast, null, '    '));
    rules.push(...ast.stylesheet.rules);
}

function match(element, selector) { // 假设selector都是简单选择器(id选择器，标签选择器，类选择器)
    if (!selector || !element.attributes) // element.attributes看是否是一个文本节点，文本节点不会有attributes属性的
        return false;

    if (selector.charAt(0) == '#') { // id选择器
        const attr = element.attributes.filter(att => att.name === 'id')[0] // 找出有id的属性
        if (attr && attr.value === selector.replace('#', '')) // 如果有这个id属性并且和选择器里的id属性一致就return true
            return true;
    } else if (selector.charAt(0) == '.') { // 类选择器
        const attr = element.attributes.filter(att => att.name === 'class')[0] // 找出有class的属性
        if (attr && attr.value === selector.replace('.', '')) // 如果有这个class属性并且和选择器里的class属性一致就return true
            return true;
    } else {  // 默认是标签选择器
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}

function specificity(selector){
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(' ');
    for(var part of selectorParts) {
        if (part.charAt(0) == '#') {
            p[1] += 1;
        } else if (part.charAt(0) == '.') {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    
    if (sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    
    if (sp1[2] - sp2[2])
        return sp1[2] - sp2[2];
    
    return sp1[3] - sp2[3]
}

function computeCSS(element) {
    // console.log(rules);
    // console.log('compute CSS for Element', element);
    var elements = stack.slice().reverse(); // 获取父元素序列， slice 不传参数是默认复制数组

    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(' ').reverse(); // 跟父元素序列保持一致也要reverse

        if (!match(element, selectorParts[0]))
            continue;
        
        let matched = false;

        // 双循环选择器和元素的父元素看它们是否可以匹配
        var j = 1; // j表示当前选择器的位置
        for(var i = 0; i < elements.length; i++) {  // i表示当前元素的位置
            if (match(elements[i], selectorParts[j])) { // 一旦元素能匹配到一个选择器就让j自增
                j++;
            }
        }
        if (j >= selectorParts.length) // 如果j的位置大于等于选择器数组的长度，表示到了最后，那就是匹配成功了部分选择器
            matched = true;
    
        if (matched) {
            // 如果匹配到，我们要加入
            // console.log('Element', element, 'matched rule', rule);
            var sp = specificity(rule.selectors[0]); // 计算当前选择器的优先级
            var computedStyle = element.computedStyle;
            for(var declaration of rule.declarations) { // 取出rule里面的每一条declaration
                if (!computedStyle[declaration.property]) // 没有这个属性就创建一个对象
                    computedStyle[declaration.property] = {}
                
                // computedStyle[declaration.property].value = declaration.value
                if (!computedStyle[declaration.property].specificity) { // 看当前的元素属性上有没有优先级
                    computedStyle[declaration.property].value = declaration.value; // 没有的话就添加value
                    computedStyle[declaration.property].specificity = sp; // 没有的话就添加优先级specificity

                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) { // 如果旧的更小的话，就让新的区域覆盖它
                    // computedStyle[declaration.property].value = declaration.value;
                    // computedStyle[declaration.property].specificity = sp;
                    for(var k = 0; k < 4; k++) {
                        computedStyle[declaration.property][declaration.value][k] += sp[k];
                    }
                }
                // console.log(element.computedStyle);
            }
        }
    }
    // let inlineStyle = element.attributes.filter(p => p.name == 'style');
    // css.parse(`* { ${inlineStyle} }`);
    // sp = [1,0,0,0]
}

function emit(token) { // 接收从状态机产生的所有token
    // if (token.type != 'text') console.log(JSON.stringify(token));
    // if (token.type === 'text') // 如果是文本节点先忽略掉
    //     return;
    
    let top = stack[stack.length - 1]; // 先把栈顶最后一个元素取出来

    if (token.type == 'startTag') { // 如果是startTag 就进行入栈操作
        let element = {
            type:'element',
            children:[],
            attributes:[]
        }
        element.tagName = token.tagName;

        for(let p in token) {
            if (p != 'type' && p != 'tagName') { // 属性入栈
                element.attributes.push({
                    name:p,
                    value:token[p]
                });
            }
        }

        computeCSS(element); // 大部分css选择器都能在startTag进入的时候被判断
        layout(element);

        top.children.push(element); // 把element 入栈，不是把token直接入栈
        // element.parent = top;  // 对偶操作

        if (!token.isSelfClosing) // 如果不是自封闭标签就push
            stack.push(element);
        
        currentTextNode = null;

    } else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            // 遇到style标签时，执行添加css规则操作
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content); // 取出当前标签的文本内容,link标签暂时不去处理了
            }
            stack.pop();  // tagName一致说明配对成功，就拿出来
        }
        layout(top); // 
        currentTextNode = null;

    } else if (token.type == 'text') { // 文本节点
        if (currentTextNode == null) {
            currentTextNode = {
                type:'text',
                content:'',
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}


function data(c) {
    if (c == '<') {
        return tagOpen; // 是标签开始，三种标签的开始
    } else if (c == EOF) {
        emit({
            type:'EOF'
        });
        return ;
    } else {
        emit({
            type:'text',
            content:c
        })
        return data; // 除了'<'之外就是文本节点
    }
}

function tagOpen(c) {
    if (c == '/') { // 判断是不是有结束标签状态，进入结束标签状态机
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {  // 给currentToken 赋值
            type:'startTag',
            tagName:''
        }
        return tagName(c); // 如果有字母，那就进入标签名的状态机
    } else {
        emit({
            type:'text',
            content:c
        })
        return ;
    }
}
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {  // 给currentToken 赋值
            type:'endTag',
            tagName:''
        }
        return tagName(c);
    } else if (c == '>') {

    } else if (c == EOF) {

    } else {

    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {  // \t: tab符  ,\n:换行符，\f:禁止符， 空格
        return beforeAttributeName; // 进入属性名
    } else if (c == '/') {  // 自封闭标签，eg:<html/>
        return selfClosingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == '>') {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '>' || c == '/' || c == EOF) {
        return afterAttributeName(c);
    } else if (c == '=') {
        
    } else {
        currentAttribute = {
            name:'',
            value:''
        }
        return attributeName(c);
    }
}


function attributeName(c) { // 属性结束状态机
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c);
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '\u0000') { // 表示空字符
         
    } else if ((c == `\"`) || (c == `'`) || (c == `<`)) {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue;
    } else if (c == '\"') { // 双引号
        return doubleQuotedAttributeValue;
    } else if (c == '\'') { // 单引号
        return singleQuotedAttributeValue;
    } else if (c == '>') {
        return data;
    } else { // 无引号
        return UnquotedAttributeValue(c);
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: ''
        };
        return attributeName(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == '\"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == '\"') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == '\u0000') {

    } else if (c == '\"' || c == `'` || c == '<' || c == '=' || c =='`') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '/') {
        return selfClosingStartTag;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}


function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == 'EOF') {

    } else {

    }
}


module.exports.parseHTML = function parseHTML(html) {
    // console.log(html);
    let state = data; // 先给初始状态
    for(let c of html) {
        state = state(c);
    }
    state = state(EOF); // 结尾字符不能是任何一个有效字符，要有唯一性，所以用symbol来创建，利用它的唯一性
    // console.log(stack[0]);
    return stack[0];
}
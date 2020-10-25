
let currentToken = null; // tag不管多复杂都当做一个token
let currentAttribute = null;

let stack = [{type:'document', children:[]}]; // 给栈一个初始根节点
let currentTextNode = null;

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

        top.children.push(element); // 把element 入栈，不是把token直接入栈
        element.parent = top;  // 对偶操作

        if (!token.isSelfClosing) // 如果不是自封闭标签就push
            stack.push(element);
        
        currentTextNode = null;

    } else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            stack.pop();  // tagName一致说明配对成功，就拿出来
        }
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

const EOF = Symbol('EOF'); // EOF:End Of File

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
            type:"text",
            content:c
        })
        return data;
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
        // currentAttribute.value += c;
        // return doubleQuotedAttributeValue;
        return new Error(`unexpected character: "${c}"`)
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
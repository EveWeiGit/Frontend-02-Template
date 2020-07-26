学习笔记
# 浏览器的工作原理

## 状态机
### 有限状态机
- 每一个状态都是一个机器
  * 在每一个机器里，我们可以做计算、存储、输出......
  * 所有的这些机器接受的输入是一致的
  * 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应
该是纯函数(无副作用)
- 每一个机器知道下一个状态
  * 每个机器都有确定的下一个状态(Moore型)
  * 每个机器根据输入决定下一个状态(Mealy型)

```javascript
// JS中的有限状态机(Mealy)
//每个函数是一个状态
function state(input) //函数参数就是输入
{
//在函数中，可以自由地编写代码，处理每个状态的逻辑
return next;//返回值作为下一个状态 }
/////////以下是调用////////// while(input) {
//获取输入
state = state(input); //把状态机的返回值作为下一个状态 }
```
### 有限状态机处理字符串

```javascript
function findString(str) {
    let state = start;
    for(let i of str) {
        state = state(i);
    }
    return state === end;
}

function start(i){
if(i === 'a')
    return foundA;
else
    return start;
    
}
function end(i){
    return end;
}

function foundA(i) {
    if (i === 'b')
     return foundA2;
    else
       return start(i);
}


function foundA2(i) {
    if (i === 'a')
     return foundB2;
    else
       return start(i);
}
function foundB2(i) {
    if (i === 'b')
    return foundA3;
    else
       return start(i);
}
function foundA3(i) {
    if (i === 'a')
     return foundB3;
    else
       return start(i);
}
function foundB3(i) {
    if (i === 'b')
     return foundX;
    else
       return start(i);
}
function foundX(i) {
    if (i === 'x')
     return end;
    else
       return start(i);
}


console.log(findString('abababx'))
```

## IOS-OSI七层网络模型
- HTTP
  * 应用
  * 表示
  * 会话
- TCP
  * 传输
- Internet
  * 网络
- 4G/5G/Wi-Fi
  * 数据链路
  * 物理层

### TCP 和IP 的基础知识
1、TCP
- 流
- 端口, 计算机的网卡根据端口把接到的数据包分给各个应用的
- reuqire('net')， node里面的包
2、IP
- 包
- IP地址
- libnet/libcap， c++的两个库，libnet负责构造IP包并且发送，libcap负责从网卡抓取所有流经你的网卡的IP包

### HTTP
1、Request

```
// request line
POST / HTTP/1.1  ----->   method    path    协议和版本
// headers
Host: 127.0.0.1
Content-Type: application/x-www-form-urlencoded
空行分隔
field1=aaa&code=x%3D1      body

```  

(1) 第一步 HTTP请求总结
- 设计一个HTTP请求的类
- content type是一个必要的字段，要有默认值
- body是KV格式
- 不同的content-type影响body的格式
  
(2) 第二步 send函数总结
- 在Request的构造器中收集必要的信息
- 设计一个send函数，把请求真实的发送到服务器
- send函数应该是异步的，所以返回Promise

2、Response
```
// status line
HTTP/1.1 200 OK  ----->  协议和版本  状态码
// headers
Content-Type: text/html
Date: Mon, 23 Dec 2019 06:46:19 GMT 
Connection: keep-alive 
Transfer-Encoding: chunked
空行分隔
// body， chunked body首先由一个十六进制这样的数字单独占一行，后面跟着内容部分，再后面又跟着一个十六进制的数字，直到最后一个十六进制的0跟十进制的0是一个0，最后的到空的chunk，这个0之后就是整个body的结尾了
26
<html><body> Hello World<body></html>
0
空行分隔
```  

(3) 第三步发送请求
- 设计支持已有的connection或者自己新建connection
- 收到数据传给parser
- 根据parser的状态resolve Promise

(4) 第四步 ResponseParser总结
- Response必须分段构造，所以我们要用一个
ResponseParser来“装配”
- ResponseParser分段处理ResponseText，我们用状态机来分析文本 的结构

(5) 第五步 BodyParser总结
- Response的body可能根据Content-Type有不同的结构，因此我们会
采用子Parser的结构来解决问题
- 以TrunkedBodyParser为例，我们同样用状态机来处理body的格式


### 浏览器工作原理

#### 浏览器

1、拆分文件
- 为了方便文件管理，我们把parser单独拆到文件中 
- parser接受HTML文本作为参数，返回一颗DOM树

2、创建状态机

- 我们用FSM来实现HTML的分析，(FSM 就是有限状态机)
- 在HTML标准中，已经规定了HTML的状态
- Toy-Browser只挑选其中一部分状态，完成一个最简版本

[参考链接](https://html.spec.whatwg.org/multipage/parsing.html #before-attribute-name-state)

3、解析标签
- 主要的标签有:开始标签，结束标签和自封闭标签
- 在这一步我们暂时忽略属性

4、创建元素
- 在状态机中，除了状态迁移，我们还会要加入业务逻辑 
- 我们在标签结束状态提交标签token

5、处理属性
- 属性值分为单引号、双引号、无引号三种写法，因此需要较多状 态处理
- 处理属性的方式跟标签类似
- 属性结束时，我们把属性加到标签Token上

6、构建DOM树

- 从标签构建DOM树的基本技巧是使用栈
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈 
- 自封闭节点可视为入栈后立刻出栈
- 任何元素的父元素是它入栈前的栈顶

7、文本节点

- 文本节点与自封闭标签处理类似 
- 多个文本节点需要合并

## 第4周总结

这周内容很多，但是感觉内容比前几周好，不会总是纯理论，实践课程虽然调试起来费劲，但是调试成功的那一刻会很开心，同时觉得自己太粗心了，总是写错一些字母，老师视频里有一些代码写错了，doubleQuotedAttributeValue里面的最后一个return 应该也是doubleQuotedAttributeValue，但是写成了singleQuotedAttributeValue，后面我看群里也有同学提出，说明大家都很细心。这周学会了怎么用vscode调试，之前都不会，感觉是个很大的收获，平常写代码也可以用上！


学习笔记
# HTML

1、HTML的定义:XML与SGML

##  DTD与XML namespace

- http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd 
- http://www.w3.org/1999/xhtml

2、HTML标签—语义

3、HTML语法

4、 字符引用
quot :双引号
amp:&符
lt:小于号
gt:大于号

# DOM
## 导航类操作
- parentNode 
- childNodes 
- firstChild
- lastChild
- nextSibling
- previousSibling
- parentElement
- children
- firstElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling

##  修改操作

- appendChild 
- insertBefore 
- removeChild 
- replaceChild

##  高级操作
- compareDocumentPosition 是一个用于比较两个节点中关系的函数。
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否完全相同。
- isSameNode 检查两个节点是否是同一个节点，实际上在
JavaScript 中可以用“===”。
- cloneNode 复制一个节点，如果传入参数 true，则会连同子元素 做深拷贝。

## Event

先捕获再冒泡

##  Range API
- var range = new Range()
- range.setStart(element, 9)
- range.setEnd(element, 4)
- var range = document.getSelection().getRangeAt(0);
- range.setStartBefore 
- range.setEndBefore 
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents
- var fragment = range.extractContents() // 取出选取的range,fragment是node的子类，它可以容纳一些元素，append的时候，它自己不会被append上去，是他包含的子元素代替它append到dom元素上去
- range.insertNode(document.createTextNode("aaaa"))


# CSSOM

##  document.styleSheets

## View

### window
 - window.innerHeight, window.innerWidth 
 - window.outerWidth, window.outerHeight 
 - window.devicePixelRatio // 设备像素比
- window.screen
    * window.screen.width
    * window.screen.height
    * window.screen.availWidth 
    * window.screen.availHeight

### window API
- window.open("about:blank", "_blank" ,"width=100,height=100,left=100,right=100" )
- moveTo(x, y)
- moveBy(x, y) // 移动
- resizeTo(x, y) // 设置大小
- resizeBy(x, y)

###  scroll
- scrollTop
- scrollLeft
- scrollWidth
- scrollHeight
- scroll(x, y)
- scrollBy(x, y)
- scrollIntoView()
- window 
  * scrollX 
  * scrollY
  * scroll(x, y)
  * scrollBy(x, y)

### layout
- getClientRects() // 获取所有盒
- getBoundingClientRect() // 只能获取一个盒

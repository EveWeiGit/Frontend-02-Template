学习笔记
# JavaScript
## Atom
###  Grammar(语法)
1、 Grammar Tree VS Priority(语法树VS优先级)
  
__优先级会影响语法树的构成__

2、 Left Handside & Right Handside

__只有Left Expression 才有资格放在等号左边__

__所有的Expression 默认不属于Left Handside Expression 就一定属于Right Handside Expression__

__Left Handside 几乎一定是 Right Handside Expression__

__Left Handside 是Right Handside子集__

### Runtime(运行时)

1、 Type Convertion 类型转换

- Boxing 装箱转换

|类型|对象|值
-------------- | -----------|-----------
|Number|new Number(1)|1|
|String|new String("a")|"a"|
|Boolean|new Boolean(true)|true|
|Symbol|new Object(Symbol("a"))|Symbol("a")|
 
__Number 是一个构造器，这个Number既可以用new 去调用也可以直接调用，直接调用Number会返回一个值,用new 去调用会返回一个Object，这个时候称Number对象和值1存在一个装箱关系。String和Boolean同理，Symbol有点区别。__
 * 用 __.和[]__ 去访问属性的时候，如果 __.和[]__ 之前的变量或者是表达式得到的是一个基础类型，那么就会自动调用装箱过程

- unBoxing 拆箱转换，把基本类型转为Object类型
  
  * ToPremitive, Object + Object 或者Object参与的运算，都会调用ToPremitive的过程
  * toString VS valueOf， 加法会先调用valueOf这个方法
  * Symbol.toPrimitive
  
一旦定义了Symbol.toPrimitive这个key值，那么会忽略toString和valueOf

```javascript
eg: var o = {
    toString() {return "2"},
    valueOf() {return 1},
    [Symbol.toPrimitive]() {return 3},
}
console.log('x' + o); // x3, toString和valueOf失效
```
无Symbol.toPrimitive的情况,位运算转number一定会先调用valueOf，一定会用到字符串场景，一定会先调用toString

```javascript
eg: var o = {
    toString() {return "2"},
    valueOf() {return 1},
    // [Symbol.toPrimitive]() {return 3},
}
console.log('x' + o); // x1，加法会先调用valueOf
```
无Symbol.toPrimitive和valueOf的情况

```javascript
eg: var o = {
    toString() {return "2"},
    // valueOf() {return 1},
    // [Symbol.toPrimitive]() {return 3},
}
console.log('x' + o); // x2，这个时候只能调用toString
```
o 作为属性名的时候会优先调用toString方法

```javascript
eg: var o = {
    toString() {return "2"},
    valueOf() {return 1},
    // [Symbol.toPrimitive]() {return 3},
}
var c = {}
c[o] = 9
console.log(c); // c={2:9}，这个时候先调用了toString
```

2、 Reference引用类型

* Object
* Key,可以是string，可以是symbol
* 
* delete
* assign
## Expression
1、 Member
- __优先级较高的运算__
* a.b
* a[b]
* foo `string` ， 把string当函数foo的参数传进去
* super.b
* super['b']
* new.target
* new Foo()

2、 New
- __优先级高__
* new Foo
  
**3、example**
* new a()() ，优先级先new a(),再(new a())()
* new new a(),优先级先new a(), 再new (new a())
  
4、Call
- __优先级中高__
* foo()
* super()
* foo()['b']
* foo().b
* foo()`abc`
* eg:new a()['b'], 优先级先new a()，再(new a())['b']

5、 Update(Right Handside Expression)自增自减
- __优先级中__
* a ++
* a --
* -- a
* ++ a
* eg
+ ++ a ++,优先级先a++,再++ (a ++) ,结果不合法

6、 Unary单目运算符
- __优先级中低__
* delete a.b
* void foo(), void 后面跟什么都会变成undefined，相当于空白
* typeof a
* +a
* -a
* ~a，位运算，把整数按位取反，不是整数就强制转换为整数
* !a
* await a

7、Exponental(指数运算)，右结合
- __优先级低高__
- **
- eg: 3 ** 2 ** 3 运算顺序是3 ** (2 ** 3),先算2的3次方为8，再算3的8次方
  
8、Multiplicative（* / %）

9、Additive (+ -)

10、Shift移位运算 (<< >> >>>)左移，右移，带符号的右移

11、 Relationship关系比较表达式(< > <= >= instanceof in)

12、Equality相等运算符

* == ，类型不同时，优先把布尔类型转换为number类型
* !=
* ===
* !==

13、Bitwise 位运算

* & ^ |   按位与，按位或，异或，按位异或

14、Logical逻辑运算

* && ||

15、Conditional 条件运算符

*  ? :   三目运算符

```javascript

function NumberToString(num, type) {
if(num === "" || num === null || isNaN(num)){
        return '您输入的不是数字';
　　}

    let str = ''

    if (type == 10) {

        str = '' + num
    } else if (type == 2) {

        str = num.toString(type)
     } else if (type == 8) {

        str = '0' + num.toString(type)
     } else {
str = '0x' + num.toString(type)
        
      }
return `您输入的${num}转为字符串是${str}`
}
```

## Statement 语句
### Grammar
- 简单语句
  * ExpressionStatement 表达式语句
  * EmptyStatement 空语句，单独一个;
  * DebuggerStatement   debugger;专门调试的时候用的
  * ThrowStatement throw 'xx' 抛出异常
  * ContinueStatement  
  * BreakStatement  结束整个循环
  * ReturnStatement  一定要在函数里面使用
- 组合语句
  * BlockStatement   在{}里面的语句
  * IfStatement      条件语句
  * SwitchStatement  多分支语句，在C里面性能比if高
  * IterationStatement  循环，while ，do while, for....
  * WithStatement   with,拒绝使用
  * LabelledStatement  label可以给简单语句和复合语句使用
  * TryStatement  try catch finally
- 声明
  *  FunctionDeclaration, 函数声明
  *  GeneratorDeclaration, function *
  *  AsyncFunctionDeclaration,  async function
  *  AsyncGeneratorDeclaration,    async function *
  *  VariableStatement， var
  *  ClassDeclaration， class
  *  LexicalDeclaration, const 和let
### Runtime 运行时
- Completion Record 语句执行的结果记录
  * 需要一个数据结构来描述语句的执行结果
  * [[ type ]]类型:normal, break, continue, return, or throw
  * [[ value ]]:基本类型
  * [[ target ]]:label
  
- Lexical Environment  词汇环境
## Strcture

## Program/Module

## JS 执行粒度(运行时)
### 宏任务
### 微任务(promise)
### 函数调用(Excution Context)
### 语句/声明(Completion Record)
### 表达式(Reference)
### 直接量/变量/this...

## Realm
* js引擎内的realm就是内置对象的固有对象和原声对象

参考链接： https://www.ecma-international.org/ecma-262/9.0/index.html#sec-well-known-intrinsic-objects
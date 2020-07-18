[TOC]
# 第二周学习笔记


##  语言按语法分类
### 非形式语言
- 中文，英文
### 形式语言(乔姆斯基谱系) 
- 0型 无限制文法  
?::=?  定义左边和右边可以随便写，不受限制
- 1型 上下文相关文法 
？<A>！::=?<B>！ 左右可以写多个非终结符，但是变化只能有一种，前后的变化都是互相关联的
eg:
{
get a { return 1 },   get 后面跟的a  ，表示get是个关键字
get : 1                get 后面跟的：，表示get是个属性名
}

- 2型 上下文无关文法 <A>::=?  左边只能写一个终结符，右边可以写很多终结符或者终结符和非终结符的混合
- 3型 正则文法  <A>::=<A>?   不允许A出现在右边的尾部， 产生式的右侧只能是空串、一个终结符号或者一个终结符号后随一个非终结符号

1，2，3型一定属于0型，反过来就不一定了
2，3型一定属于0，1型，反过来就不一定了
3型一定属于0，1，2型，反过来就不一定了



##  产生式(BNF)
### 组成
1. 用尖括号括起来的名称来表示语法结构名
2. 语法结构分成基础结构和需要用其他语法结构定义的复合结构 
- 基础结构称终结符
- 复合结构称非终结符
3. 引号和中间的字符表示终结符   “a”
4. 可以有括号            a+(b-c)
5. * 表示重复多次  a*   表示a可以重复多次
6. | 表示或，   a | b   表示a或b
7. + 表示至少一次  (a | b )+  表示a或b至少有一个


```javascript
// 左边项尽量不要出现在 右边每一个或项的最后，右边的式子里的任何一个或项都不能等于左边的项
// 理解版
<NoZeroNum>:= 1|2|3|4|5|6|7|8|9
<HasZeroNum> := 0 | <NoZeroNum>

// 加法
<AdditionExpression>:= <HasZeroNum> "+" <HasZeroNum> | <AdditionExpression> "+" <HasZeroNum> 

// 减法
<SubtractionExpression> :=  <HasZeroNum> "-" <HasZeroNum> | <SubtractionExpression>  "-" <HasZeroNum>

// 乘法
<MultiplicationExpression> := <HasZeroNum> "*" <HasZeroNum> | <MultiplicationExpression> "*" <HasZeroNum>

// 除法
<DivisionExpression> := <HasZeroNum> "/"  <NoZeroNum> |  <DivisionExpression> "/" <NoZeroNum>

// 混合运算
<MixedExpression> := <AdditionExpression>  |  <SubtractionExpression> | <MultiplicationExpression> | <DivisionExpression> |

<MixedExpression> "+" (<AdditionExpression>  |  <SubtractionExpression> | <MultiplicationExpression> | <DivisionExpression> ) |

<MixedExpression> "-" (<AdditionExpression>  |  <SubtractionExpression> | <MultiplicationExpression> | <DivisionExpression> ) |

<MixedExpression> "*" (<AdditionExpression>  |  <SubtractionExpression> | <MultiplicationExpression> | <DivisionExpression> ) |

<MixedExpression> "/" (<AdditionExpression>  |  <SubtractionExpression> | <MultiplicationExpression> | <DivisionExpression> )

// 简化版, 不需要把0特意分出来


// 混合运算
<MixedExpression> := <ParenthesesExpress> |

<MixedExpression> "+" <ParenthesesExpress> |

<MixedExpression> "-" <ParenthesesExpress> |

<MixedExpression> "*" <ParenthesesExpress> |

<MixedExpression> "/" <ParenthesesExpress>

// 括号
<ParenthesesExpress> :=  <AdditionExpression> | "(" <ParenthesesExpress> ")"

// 加减
<AdditionExpression> := <MultiplicationExpression> |

<AdditionExpression> "+" <MultiplicationExpression> |

<AdditionExpression> "-" <MultiplicationExpression> |

// 乘除
<MultiplicationExpression> := <Num> | <MultiplicationExpression> "*" <Num>  | <MultiplicationExpression> "/"  <Num>

// 数字
<Num>:= 0|1|2|3|4|5|6|7|8|9


```

## 语言分类

### 形式语言—用途
#### 数据描述语言
存储或读取数据
- JSON, HTML, XAML, SQL, CSS， R(数据分析)，MATLAB(MATrix LABoratory（矩阵实验室）的缩写),
Scratch(电脑程序开发平台), PL/SQL(是Oracle数据库对SQL语句的扩展), Transact-SQL(是SQL 在Microsoft SQL Server 上的增强版),  COBOL(广泛引用于商业当中，能够处理大量的数据),  (Visual) FoxPro(是美国Fox Software公司推出的编程语言，主要用于数据库), Prolog(是一种逻辑编程语言), PostScript(最适用于列印图像和文字,页面描述语言), Fortran(源自于“公式翻译”（英语：Formula Translation）的缩写)
#### 编程语言

- C, C++, Java, C#, Python, Ruby, Perl,
Lisp, T-SQL, Clojure, Haskell, JavaScript,
JavaScript, PHP, GO,Typescript, shell, VisualBasic, Swift，
 Assemblylanguage, Rust, Object-C(是一种在C的基础上加入面向对象特性扩充而成的编程语言), Groovy(是Java平台上设计的面向对象编程语言),  Dart(是一种基于类的编程语言), D(是具有静态类型，系统级访问和类似C的语法的通用编程语言), Kotlin, ABAP(高级商务应用编程）是一种高级语言), Delphi/Object, Pascal(是一个有影响的面向对象和面向过程编程语言), OpenEdge ABL(高级业务语言), Julia, Lua, Scala, VBScript, Ada(是一种表现能力很强的通用程序设计语言),
RPG(是用于商业应用程序的高级编程语言), Apex( 是一种类似于Java 的强类型、面向对象编程语言), C shell, 
### 形式语言—表达方式

#### 声明式语言
只告诉你结果怎么样
- JSON, HTML, XAML, SQL, CSS, Lisp, Clojure, Haskell, Logo(一种计算机程序设计语言), Scheme(是一种函数式编程语言，是Lisp的两种主要方言之一), Erlang(函数式编程语言。)
#### 命令型语言
达成结果的步骤是怎么样
- C, C++, Java, C#, Python, Ruby, Perl, JavaScript, PHP, GO,Typescript, shell, VisualBasic, Swift，
 Assemblylanguage, Rust, Object-C(是一种在C的基础上加入面向对象特性扩充而成的编程语言), Groovy(是Java平台上设计的面向对象编程语言),  Dart(是一种基于类的编程语言), D(是具有静态类型，系统级访问和类似C的语法的通用编程语言), Kotlin, ABAP(高级商务应用编程）是一种高级语言), Delphi/Object, Pascal(是一个有影响的面向对象和面向过程编程语言), OpenEdge ABL(高级业务语言), Julia, Lua, Scala, VBScript, Ada(是一种表现能力很强的通用程序设计语言),
RPG(是用于商业应用程序的高级编程语言), Apex( 是一种类似于Java 的强类型、面向对象编程语言), C shell

## 图灵完备性
### 命令式——图灵机 • goto
#### if和while
### 声明式——lambda
#### 递归

## 动态与静态
###  动态
- 在用户的设备/在线服务器上
- 产品实际运行时 
- Runtime
## 静态:
编写这段代码的时候就可以获得类型检查了
- 在程序员的设备上 
- 产品开发时
- Compiletime

## 类型系统
### 动态类型系统与静态类型系统
可以在用户的内存里面找到类型信息，是动态类型系统
只在程序员设备上保留的类型信息， 静态类型系统，eg:C++

Java是半动态半静态

### 强类型与弱类型
强类型默认类型转换不会发生，反之是弱类型

- String + Number
- String == Boolean
### 复合类型 
- 结构体
- 函数签名， 包含参数类型和返回值类型
### 子类型
eg:C++
###  泛型
- 逆变/协变

## js的数据类型
Number, String, Boolean, Null, Undefined, Object, Symbol
### Number
IEEE754双精度浮点
Sign(1)  符号位
Exponet(11) 指数位， 指数的最大是2^11 = 2048 个数, 有偏移值1023，所以表示正负的范围[-1023,1024]，包含0
Fraction(52) 精度位

参考链接：https://www.jianshu.com/p/7c636d8f18d5
https://juejin.im/post/5ce69984e51d45595319e2bb
### String
- ASCII   128个字符，0~127
- Unicode  字符集范围：0000~FFFF 
- UCS， 字符集范围：0000~FFFF 
- GB
 • GB2312
 • GBK(GB13000) 
 • GB18030
- ISO-8859 
- BIG5， 台湾会用

#### utf8编码
字节补位码
- 1个字节 0xxxxxxx  7
- 2个字节 110xxxxx 10xxxxxx  11
- 3个字节 1110xxxx 10xxxxxx 10xxxxxx  16
- 4个字节 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  21
- 5个字节 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx  26
- 6个字节 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 31
第一个字节前面几个1 就表示整个utf8编码占几个字节
举个🌰
- 中文'编'字的charCodeAt是32534， 
- 这个应该属于占上面的3个字节
- 转为二进制是111111100010110
- 等同于是01111111 00010110
- 然后按照上面3个字节来按顺序补位1110xxxx 10xxxxxx 10xxxxxx 
- 1110后面补4位，所以把01111111 00010110的前4位拿出来，也就是0111，所以是11100111
- 然后继续补10xxxxxx，后面补6位，所以把01111111 00010110刚才补完4位剩1111 00010110，取前6位1111 00，所以是10111100
- 继续补最后一个字节10xxxxxx，还是要补6位，刚刚'编'字的二进制也剩下6位010110，补完结果就是10010110
- 所以转成utf8的3个字节就是 11100111 10111100 10010110
- 转为16进制是0xE7 0xBC 0x96,这个就是UTF8的编码了

参考链接：http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html
https://segmentfault.com/a/1190000005794963

```javascript

function UTF8_Encoding(string){

      let byteSize = 0; // 字节个数
      for (let i = 0; i < string.length; i++) {
          let code = string.charCodeAt(i); // 先获取charCodeAt
          let binaryCode = code.toString(2); // code转为二进制
          let completeZero = '';  // 补全前面的0
        //   let completmentCode = '';// 补码
          let utf8Code = ''

          if (0x00 <= code && code <= 0x7f) { // 1个字节
                byteSize += 1;
                utf8Code = code.toString(16)
          } else if (0x80 <= code && code <= 0x7ff) {  // 2个字节
                byteSize += 2;
                completeZero = binaryCode.padStart(11, 0);
                const code1 = '110'.padStart(8, completeZero.slice(0,5));
                const code2 = '10'.padStart(8, completeZero.slice(4,11));

                const Num1 = parseInt((+ code1),2); // 转10进制， + code1 是转换为数字 
                const Num2 = parseInt((+ code2),2);
                utf8Code = `0x${Num1.toString(16)}, 0x${Num2.toString(16)}`; // 转为16进制码

          } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {  // 3个字节
                byteSize += 3;
                completeZero = binaryCode.padStart(16, 0);
                const code1 = '110'.padStart(8, completeZero.slice(0,5));
                const code2 = '10'.padStart(8, completeZero.slice(4,11));
                const code3 = '10'.padStart(8, completeZero.slice(10,17));

                const Num1 = parseInt((+ code1),2); // 转10进制， + code1 是转换为数字 
                const Num2 = parseInt((+ code2),2);
                const Num3 = parseInt((+ code3),2);
                utf8Code = `0x${Num1.toString(16)}, 0x${Num2.toString(16)}, 0x${Num3.toString(16)}`; 
          } else if (0x010000 <= code && code <= 0x10ffff) {   // 4个字节
              byteSize += 4;
                completeZero = binaryCode.padStart(21, 0);
                const code1 = '110'.padStart(8, completeZero.slice(0,5));
                const code2 = '10'.padStart(8, completeZero.slice(4,11));
                const code3 = '10'.padStart(8, completeZero.slice(10,17));
                const code4 = '10'.padStart(8, completeZero.slice(16,23));

                const Num1 = parseInt((+ code1),2); // 转10进制， + code1 是转换为数字 
                const Num2 = parseInt((+ code2),2);
                const Num3 = parseInt((+ code3),2);
                const Num4 = parseInt((+ code4),2);
                utf8Code = `0x${Num1.toString(16)}, 0x${Num2.toString(16)}, 0x${Num3.toString(16)}, 0x${Num4.toString(16)}`;
          }
        return utf8Code
       }
}

UTF8_Encoding('!')

```

### Boolean
true,false

### Null & Undefined
用void 0 来表示undefined

### Object

- 三个核心要素： identifier(唯一性的标识)， state(状态), behavior(行为) 

#### Class
- 类是一种常见的描述对象 的方式。
- 流派: ”归类”和”分类”
- 对于”归类”方法而言， 多继承是非常自然的事情。 如C++
- 而采用分类思想的计算机 语言，则是单继承结构。 并且会有一个基类Object。eg:Java
- Javascript 接近分类思想，但是不完全是分类
#### Prototype
- 原型是一种更接近人类原 始认知的描述对象的方法。
- 我们并不试图做严谨的分 类，而是采用“相似”这 样的方式去描述对象。
- 任何对象仅仅需要描述它 自己与原型的区别即可。 

#### 属性
- Data Property 数据属性， 用于描述 状态，数据属性中如果存储函数，也 可以用于描述行为。
 [[value]]，  writable，  enumerable，  configurable

- Accessor Property 访问器属性， 用于描述 行为
get, set : 用点方位属性的时候会调用
enumerable，： 影响Object.keys() 这样的内置函数行为， 也会影响forEach这样的语法产生默认行为
configurable

#### 原型链
当我们访问属性时，如果当前对象 没有，则会沿着原型找原型对象是 否有此名称的属性，而原型对象还 可能有原型，因此，会有“原型链” 这一说法。

#### API/Grammar
- {} . [] Object.defineProperty ：提供基本的对象机制
- Object.create / Object.setPrototypeOf / Object.getPrototypeOf  ：基于原型的描述对象的方法
- new / class / extends ：基于分类的方式的描述对象的方法
- new / function / prototype： 建议不用

```javascript
class Animal {
    constructor(name){
    this.name = name
    }
    bite(animal) {
        
        console.log(` ${this.name} bite ${animal.name}`)
    }
}
class Dog extends Animal {

    constructor(name){

    super(name)
    }

}

class Human extends Animal {
    constructor(name){

    super(name)
    }
    hurtBy(animal) {
        console.log(`${this.name} hurt  by  ${animal.name}, need to go to the hospital!`)
    }
}
const dog = new Dog('二哈')
const people = new Human('Mike')
dog.bite(people)
people.hurtBy(dog)
```
#### Function Object 函数对象
函数 对象还有一个行为[[call]],我们用JavaScript中的function 关 键字、箭头运算符或者Function构 造器创建的对象，会有[[call]]这个 行为,我们用类似 f() 这样的语法把对象 当做函数调用时，会访问到[[call]] 这个行为。如果对应的对象没有[[call]]行为， 则会报错。
#### special Object

- Array
- Function
- 错误对象
Error
AggregateError
EvalError
InternalError
RangeError
ReferenceError
SyntaxError
TypeError
URIError
- 可索引的集合对象
Int8Array
Uint8Array
Uint8ClampedArray
Int16Array
Uint16Array
Int32Array
Uint32Array
Float32Array
Float64Array
BigInt64Array
BigUint64Array
- 使用键的集合对象
Map
Set
WeakMap
WeakSet
- 结构化数据
ArrayBuffer
SharedArrayBuffer
Atomics
DataView
JSON
- 控制抽象对象
Promise
Generator
GeneratorFunction
AsyncFunction
- 反射
Reflect
Proxy
- 国际化
Intl
Intl.Collator
Intl.DateTimeFormat
Intl.ListFormat
Intl.NumberFormat
Intl.PluralRules
Intl.RelativeTimeFormat
Intl.Locale
- WebAssembly(web 组装)
WebAssembly
WebAssembly.Module
WebAssembly.Instance
WebAssembly.Memory
WebAssembly.Table
WebAssembly.CompileError
WebAssembly.LinkError
WebAssembly.RuntimeError

参考链接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects

#### Host Object 宿主对象
setTimeOut, window


### Symbol
唯一性，就算两个名字一样的，也是不相等的，可以给Object做属性

## 总结

这周的知识感觉有点多，乔姆斯基谱系我还是不太理解，有的需要看其他资料才能理解，比如BNF的四则运算，还有IEEE754双精度浮点，还是找了助教才理解了指数位的范围，虽然找助教的时候内心有点小忐忑，但是助教很热心的帮我理解问题，超级感谢助教！ 字符串转utf8编码的函数，我理解了怎么转，但是可能写的比较笨拙， 设计狗咬人的类，我是参考了其他同学怎么写的然后写了个简单版，这里还是薄弱项要继续努力。最后一个题是找出 JavaScript 标准里面所有具有特殊行为的对象，还是不太理解特殊行为是指什么，我就找了js的内置对象，不知道有没有作业的讲解这一块内容，第三周依然需要加油💪！！！
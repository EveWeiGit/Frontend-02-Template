const net = require('net');
const parser = require('./parser');

class Request {
    constructor(options) {
        const { method = 'GET', host, port = '80', path = '/',body = {}, headers = {} } = options
        this.method = method;
        this.host = host;
        this.port = port;
        this.path = path;
        this.body = body;
        this.headers = headers;

        if(!this.headers['Content-Type']) { // 一定要有Content-Type，否则没有办法解析
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        
        if(this.headers['Content-Type'] === 'application/json')
            this.bodyText = JSON.stringify(this.body);
        else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded')
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        
        this.headers['Content-Length'] = this.bodyText.length;

    }
    /**
     * send函数总结：
- 在Request的构造器中收集必要的信息
- 设计一个send函数，把请求真实的发送到服务器
- send函数应该是异步的，所以返回Promise
     */
    send(connection){  // 接收一个connection 参数， 如果有connection这个参数，TCP链接就把我们的请求发送出去
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({  // 如果没有传参数，就会根据构造函数里传进来的host和port，去创建一个新的TCP连接
                    host:this.host,
                    port:this.port
                }, () => {  // 创建成功后把connection写上
                    connection.write(this.toString());
                })
            }
            connection.on('data', data => { // 监听connection的data
                // console.log(this.toString());
                // console.log(data.toString());
                parser.receive(data.toString()); // 把data变成字符串传给parser
                if (parser.isFinished) { // 如果parser已经结束的话就执行resolve，结束promise
                    resolve(parser.response);
                    connection.end();   // 结束connection
                }
            });
            connection.on('error', err => { // 监听错误，如果有错误就执行reject，结束promise
                reject(err);
                connection.end();
            });
        });
    }
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }
}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;

    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode:RegExp.$1,
            statusText:RegExp.$2,
            headers:this.headers,
            body:this.bodyParser.content.join('')
        }
    }
    receive(string) { // 接收一个字符串
        for(let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i)); // 循环查看每个字符
        }
    }
    receiveChar(char) { // 状态机
        // console.log({char})
        if (this.current === this.WAITING_STATUS_LINE) {  // 如果现在的状态是this.WAITING_STATUS_LINE
            if (char === '\r') {  // 如果传进来的char等于\r说明结束了，就替换状态
                this.current = this.WAITING_STATUS_LINE_END;
            } else { // 不等于\r的话就把字符添加到this.statusLine里
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) { // 如果现在的状态是this.WAITING_STATUS_LINE_END,说明状态行结束
            if (char === '\n') { // 如果是\n的话就替换状态
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) { // 如果现在的状态是this.WAITING_HEADER_NAME，说明到了headers里
            if (char === ':') { // 如果是:说明是HEADER里的分隔符
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') { // 如果是\r 说明header结束后的回车换行
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked')
                    this.bodyParser = new TrunkedBodyParser();
            } else { // 如果都没有特殊符号，那就连接字符串this.headerName
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) { // 如果现在的状态是this.WAITING_HEADER_SPACE，说明到了分隔符:了
            if (char === ' ') { // 如果是空格，说明到了this.WAITING_HEADER_VALUE状态
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {// 如果现在的状态是this.WAITING_HEADER_VALUE
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;  // 添加header里的value
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            // console.log(char)
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;  // 长度为0的chunk，说明整个body结束了
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK= 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                if(this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                this.length *=16;  // this.length是16进制，要乘以16，把最后一位空出来，相当于10进制里面乘以10
                this.length += parseInt(char, 16); // 这个时候是等待一个trunk里面的长度数字，所以这个时候char是一个16进制的数字
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) { // 读取trunk数字结束后，开始读取trunk的内容
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length --;
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}


void async function(){  // void立即执行函数的一种写法
    let request = new Request({
        method:'POST',
        host:'127.0.0.1', // 来自IP层
        port:'8088',  // 来自TCP层
        path:'/',
        headers:{
            ['user-name']:'wei'
            // ['X-Foo2']:'customed'
        },
        body:{
            name:'Wangwei'
        }
    });
    let response = await request.send();
    // console.log('response', response)
    let dom = parser.parseHTML(response.body);
    console.log(dom);
}();
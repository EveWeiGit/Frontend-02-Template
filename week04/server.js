const http = require('http');

http.createServer((request, response) => {
    let body = [];
    request.on('error', err => {
        console.error(err);
    }).on('data', chunk => {
        body.push(chunk.toString()); // 数据放到body里
    }).on('end', () => {
        // body = Buffer.concat(body).toString(); // 缓冲区合并
        console.log({body});
        response.writeHead(200, {'Content-Type':'text/html'});
        // response.end('Hello weiwei\n');
        response.end(`<html maaa=a >
        <head>
            <title>Document</title>
            <style>
                body div #myid{
                    width: 100px;
                    background-color: #ff1111;
                }
            </style>
        </head>
        <body>
            <div>
                <img id="myid" />
                <img  />
            </div>
        </body>
        </html>`);
    });
}).listen(8088);

console.log('server started');



let http = require('http');

let fs = require("fs");

let archiver = require("archiver");
let querystring = require('querystring');

let child_process = require("child_process");

// 打开https://github.com/login/oauth/authorize

child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.73af973ded44837a`)

// 创建server，接收token，点击发布


http.createServer((req, res) => {
    let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1]);
    // console.log({query});
    publish(query.token)
}).listen(8083);

function publish(token){
 let request = http.request({
        hostname:"127.0.0.1",
        port:8082,
        // port:8882,
        method: "POST",
        path:`/publish?token=${token}`,
        headers:{
            'Content-Type':'application/octet-stream', // 流式传输的类型
            // 'Conten-Length':stats.size,
        }
    }, response => {
        console.log(response);
        
    })
    let file = fs.createReadStream("./sample/sample.html");
// 创建archiver实例
    const  archive = archiver('zip', {
        zlib:{level:9}
    })

    archive.directory('./sample/', false);

    archive.finalize(); // 填好压缩内容
    archive.pipe(fs.createWriteStream("tmp.zip"))
    
    archive.pipe(request);
}

// fs.stat('./sample/sample.html', (err, stats) => { // 单文件场景

    // let request = http.request({
    //     hostname:"127.0.0.1",
    //     port:8082,
    //     // port:8882,
    //     method: "POST",
    //     headers:{
    //         'Content-Type':'application/octet-stream', // 流式传输的类型
    //         // 'Conten-Length':stats.size,
    //     }
    // }, response => {
    //     console.log(response);
        
    // })
    
    // let file = fs.createReadStream("./sample/sample.html");
    // let file = fs.createReadStream("./sample.html");

     // 创建archiver实例
    // const  archive = archiver('zip', {
    //     zlib:{level:9}
    // })

    // archive.directory('./sample/', false);

    // archive.finalize(); // 填好压缩内容
    // archive.pipe(fs.createWriteStream("tmp.zip"))
    
    // archive.pipe(request);
    
    // file.on('end', () => request.end());
// })


// file.on('data', chunk => {
//     console.log(chunk.toString());
//     request.write(chunk);
// })
// file.on('end', chunk => {
//     console.log("read finished");
//     request.end(chunk);
// })

// request.end();
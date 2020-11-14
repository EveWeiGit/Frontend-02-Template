
let http = require('http');

let fs = require("fs");

let archiver = require("archiver");

// fs.stat('./sample/sample.html', (err, stats) => { // 单文件场景

    let request = http.request({
        hostname:"127.0.0.1",
        port:8082,
        // port:8882,
        method: "POST",
        headers:{
            'Content-Type':'application/octet-stream', // 流式传输的类型
            // 'Conten-Length':stats.size,
        }
    }, response => {
        console.log(response);
        
    })
    
    // let file = fs.createReadStream("./sample/sample.html");
    // let file = fs.createReadStream("./sample.html");

     // 创建archiver实例
    const  archive = archiver('zip', {
        zlib:{level:9}
    })

    archive.directory('./sample/', false);

    archive.finalize(); // 填好压缩内容
    archive.pipe(fs.createWriteStream("tmp.zip"))
    
    archive.pipe(request);
    
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
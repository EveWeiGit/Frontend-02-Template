
let http = require('http');

let fs = require("fs");

let archiver = require("archiver")

// fs.stat('./sample.html', (err, stats) => { // 单文件场景

    let request = http.request({
        hostname:"127.0.0.1",
        // port:8082,
        port:8882,
        method: "POST",
        headers:{
            'Content-Type':'application/octet-stream', // 流式传输的类型
            'Conten-Length':stats.size,
        }
    }, response => {
        console.log(response);
        
    })
    
    let file = fs.createReadStream("./sample.html");

    const  archiver = archiver('zip', {
        zlib:{level:9}
    })

    archiver.directory('./sample/', false);

    archiver.finalize();
    archiver.pipe(fs.createWriteStream("tmp.zip"))
    
    // file.pipe(request);
    
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
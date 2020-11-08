let http = require('http');
let fs = require('fs');


http.createServer((req, res) => {
    // console.log(req.headers);

    let outFile = fs.createWriteStream("../server/public/tmp.zip")
    req.pipe(outFile);
    // req.on('data', chunk => {
    //     // console.log(chunk);
    //     outFile.write(chunk);

    // })
    // req.on('end', chunk => {
    //     outFile.write(chunk);
    //     outFile.end();
    //     res.end('success');
    // })
}).listen(8082);
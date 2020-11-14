let http = require('http');
// let fs = require('fs');
let unzipper = require('unzipper');


http.createServer((req, res) => {
    console.log('req');

    // let outFile = fs.createWriteStream("../server/public/index.html")
    // let outFile = fs.createWriteStream("../server/public/tmp.zip")
    // req.pipe(outFile);
    req.pipe(unzipper.Extract({path:'../server/public/'}));
    // req.on('data', chunk => {
    //     console.log(chunk);
    //     outFile.write(chunk);

    // })
    // req.on('end', chunk => {
    //     // outFile.write(chunk);
    //     outFile.end();
    //     res.end('success');
    // })
}).listen(8082);
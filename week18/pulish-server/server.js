let http = require('http');
let https = require('https');
// let fs = require('fs');
let unzipper = require('unzipper');
let querystring = require('querystring');


function auth(req, res) {
let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
// console.log({query});
getToken(query.code, function (info) {
    // res.write(JSON.stringify(info));
    res.write(`<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`);
    res.end();
    // console.log(info);
})
}
function getToken(code, callback) {

    let request = https.request({
        hostname:"github.com",
        path:`/login/oauth/access_token?code=${code}&client_id=Iv1.73af973ded44837a&client_secret=a24f63400e226820fdf76a6cd12a6c788aa86476`,
        port:443,
        method:"POST",
    }, function(response){
        console.log(response);
        let body = ""
        response.on('data', chunk => {
            console.log(chunk.toString());
            body += chunk.toString()
        })
        response.on('end', chunk => {
            // let o = querystring.parse(body)
            // console.log(o);
            callback(querystring.parse(body))
        })
    })
    request.end();
}
function publish(req, res) {
let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
getUser(query.token, info => {
    // console.log('info', JSON.parse(info), JSON.parse(info).login);
    if (info.login === 'EveWeiGit') {
    req.pipe(unzipper.Extract({path:'../server/public/'}));
    req.on('end', function() {
        res.end('success');
    })
    }
})
    
}

function getUser(token, callback) {
    let request = https.request({
        hostname:"api.github.com",
        path:`/user`,
        port:443,
        method:"GET",
        headers:{
            "Authorization": `token ${token}`,
            "User-Agent":"wei-publish",
        }
    }, function(response){
        // console.log(response);
        let body = ""
        response.on('data', chunk => {
            console.log(chunk.toString());
            body += chunk.toString()
        })
        response.on('end', chunk => {
            let o = JSON.parse(body)
            console.log('o', o, o.login);
            callback(o)
        })
    })
    request.end();
}

http.createServer((req, res) => {
    // console.log('req');

    if(req.url.match(/^\/auth\?/)) {
        return auth(req, res)
    }
    if(req.url.match(/^\/publish\?/)) {
        return publish(req, res)
    }

    // let outFile = fs.createWriteStream("../server/public/index.html")
    // let outFile = fs.createWriteStream("../server/public/tmp.zip")
    // req.pipe(outFile);
    // req.pipe(unzipper.Extract({path:'../server/public/'}));
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
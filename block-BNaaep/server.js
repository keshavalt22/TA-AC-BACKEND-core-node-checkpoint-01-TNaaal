let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let url = require('url');
let path = require('path');

let userPath = path.join(__dirname,'/contacts/');

let server = http.createServer(handleRequest);

function handleRequest(req, res) {
    let parsedUrl = url.parse(req.url, true);
    let store = '';

    req.on('data', (chunk) => {
        store += chunk;
    })

    req.on('end', () => {
        if(req.method === 'GET' && req.url === '/'){
            res.setHeader('Content-Type','text/html');
            fs.createReadStream('./index.html').pipe(res);
        }
        if(req.method === 'GET' && req.url === '/about'){
            res.setHeader('Content-Type','text/html');
            fs.createReadStream('./about.html').pipe(res);
        }
        if(req.method === 'GET' && req.url === '/contact'){
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream('./contact.html').pipe(res);
        }
        if(req.method === 'POST' && req.url === '/users'){
            let parsedData = JSON.parse(store);
            fs.open(userPath + parsedData.username + ".json" , 'wx', (err, fd) => {
                fs.write(fd, store, (err, content) => {
                    console.log(err);
                    fs.close(fd, (err) => {
                        return res.end(`${username} successfully created`);
                    });
                })
            })
        }
        if(req.method === 'GET' && parsedUrl.pathname === '/users'){
            var parsedData = qs.parse(store).username;
            var username = parsedUrl.query.username;
            fs.readFile(userPath + username + '.json', (err, content) => {
                if(err) return console.log(err);
                res.setHeader('Content-Type', 'application/json');
                return res.end(content);
            })
        }
        if(req.method === 'GET' && req.url === '/users') {
            fs.readdir('./contacts', (err,files) => {
                if(err) return console.log(err);
                if(files){
                    files.map((file) => {
                        
                    })
                }
            })
        }
    })

}

server.listen(5000, () => {
    console.log('listening on port 5k');
})
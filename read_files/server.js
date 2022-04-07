var http = require('http');
var fs = require('fs');

var index = fs.readFileSync('cannabis_business_industry.html');
var script = fs.readFileSync('js/cannabis_business_industry.js');
var data = fs.readFileSync('html/usacannabisdirectory.html');

var server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(index);
    } else if (req.url === '/js/cannabis_business_industry.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(script);
    } else if (req.url === '/html/usacannabisdirectory.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
    }

    res.end();
});

server.listen(5500);

console.log(`http://localhost:${5500}`);
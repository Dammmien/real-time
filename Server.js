const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = 3000;

http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url);
  let pathname = `./public${parsedUrl.pathname}`;

  const mimeType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css'
  };

  fs.exists(pathname, exist => {
    if (!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    if (fs.statSync(pathname).isDirectory()) pathname += '/index.html';

    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.end(data);
      }
    });
  });
}).listen(port);

console.log(`Server listening on port ${port}`);

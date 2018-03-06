const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports = class Server {

  constructor(port) {
    this.httpServer = http.createServer(this.onRequest.bind(this)).listen(port);
    console.log(`Server listening on port ${port}`);
  }

  getMimeType(pathname) {
    return {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css'
    }[path.parse(pathname).ext] || 'text/plain'
  }

  on200(res, pathname, data) {
    res.setHeader('Content-type', this.getMimeType(pathname));
    res.end(data);
  }

  on404(res, pathname) {
    res.statusCode = 404;
    res.end(`File ${pathname} not found!`);
  }

  on500(res, err) {
    res.statusCode = 500;
    res.end(`Error getting the file: ${err}.`);
  }

  onRequest(req, res) {
    let pathname = `./public${url.parse(req.url).pathname}`;
    if (!fs.existsSync(pathname)) return this.on404(res, pathname);
    if (fs.statSync(pathname).isDirectory()) pathname += '/index.html';
    if (!fs.existsSync(pathname)) return this.on404(res, pathname);
    fs.readFile(pathname, (err, data) => {
      if (err) this.on500(res, err);
      else this.on200(res, pathname, data);
    });
  }
};

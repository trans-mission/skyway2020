const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const port = process.env.port || 8080;

const dataService = require('./server/services/dataService');

const app = function (request, response) {

  let uri = url.parse(request.url).pathname;
  let filename = path.join(process.cwd(), uri);

  if (request.method === 'GET' && uri === '/api/data') {
    let responseJson = dataService.getLatestData();
    response.statusCode = 200;
    response.end(responseJson);
    return;
  }

  fs.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/client/static/index.html';

    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write(err + "\n");
        response.end();
        return;
      }

      if (filename.endsWith('.jpg')) {
        response.setHeader('content-type', 'image/jpeg');
      }
      
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}

const server = http.createServer(app);
server.listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
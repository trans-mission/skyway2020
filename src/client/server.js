var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  port = process.argv[2] || 8889;


const app = function (request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  if (request.method === 'GET' && uri === '/api/test') {
    response.statusCode = 200;
    response.end('{"some": "Sample", "JSON": 711}');
    return;
  }


  fs.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

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
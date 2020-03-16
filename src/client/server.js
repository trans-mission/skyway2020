const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const port = process.argv[2] || 8889;


const app = function (request, response) {

  let uri = url.parse(request.url).pathname;
  let filename = path.join(process.cwd(), uri);
  
  if (request.method === 'GET' && uri === '/api/test') {
    let responseJson = getFakeResponseBody();
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


getFakeResponseBody = () => {
  return `
  {
    "lastModified": "Sun Mar 15 2020 06:35:55 GMT-0400 (Eastern Daylight Time)",
    "panels":
    [{
            "frustrationLevel": 7,
            "imagePath": "/static/images/1.jpg",
            "cars":
            [{
                    "color": "(255, 192, 42)",
                    "x1": 225,
                    "y1": 259,
                    "x2": 256,
                    "y2": 280
                }, {
                    "color": "(95, 292, 142)",
                    "x1": 215,
                    "y1": 279,
                    "x2": 226,
                    "y2": 310
                }
            ]
        }, {
            "frustrationLevel": 7,
            "imagePath": "/static/images/2.jpg",
            "cars":
            [{
                    "color": "(255, 192, 42)",
                    "x1": 225,
                    "y1": 259,
                    "x2": 256,
                    "y2": 280
                }, {
                    "color": "(95, 292, 142)",
                    "x1": 215,
                    "y1": 279,
                    "x2": 226,
                    "y2": 310
                }
            ]
        }, {
            "frustrationLevel": 7,
            "imagePath": "/static/images/3.jpg",
            "cars":
            [{
                    "color": "(255, 192, 42)",
                    "x1": 225,
                    "y1": 259,
                    "x2": 256,
                    "y2": 280
                }, {
                    "color": "(95, 292, 142)",
                    "x1": 215,
                    "y1": 279,
                    "x2": 226,
                    "y2": 310
                }
            ]
        }, {
            "frustrationLevel": 7,
            "imagePath": "/static/images/4.jpg",
            "cars":
            [{
                    "color": "(255, 192, 42)",
                    "x1": 225,
                    "y1": 259,
                    "x2": 256,
                    "y2": 280
                }, {
                    "color": "(95, 292, 142)",
                    "x1": 215,
                    "y1": 279,
                    "x2": 226,
                    "y2": 310
                }
            ]
        }, {
            "frustrationLevel": 7,
            "imagePath": "/static/images/5.jpg",
            "cars":
            [{
                    "color": "(255, 192, 42)",
                    "x1": 225,
                    "y1": 259,
                    "x2": 256,
                    "y2": 280
                }, {
                    "color": "(95, 292, 142)",
                    "x1": 215,
                    "y1": 279,
                    "x2": 226,
                    "y2": 310
                }
            ]
        }, {
            "frustrationLevel": 7,
            "imagePath": "/static/images/6.jpg",
            "cars":
            [{
                    "color": "(255, 192, 42)",
                    "x1": 225,
                    "y1": 259,
                    "x2": 256,
                    "y2": 280
                }, {
                    "color": "(95, 292, 142)",
                    "x1": 215,
                    "y1": 279,
                    "x2": 226,
                    "y2": 310
                }
            ]
        }
    ]
}
`;
};
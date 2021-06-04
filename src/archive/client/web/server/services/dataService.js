const http = require('http');

const getLatestData = () => {
    // Testing!
    http.get('http://dummy.restapiexample.com/api/v1/employees', (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            console.log(JSON.parse(data));
        });
    }).on('error', (error) => {
        console.log("Error", error);
    });
    // return realy with fake data for now
    return this.getFakeResponseBody();
};

this.getFakeResponseBody = () => {
    return `
    {
      "lastModified": "Sun Mar 15 2020 06:35:55 GMT-0400 (Eastern Daylight Time)",
      "panels":
      [{
              "frustrationLevel": 7,
              "imagePath": "/server/images/1.jpg",
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
              "imagePath": "/server/images/2.jpg",
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
              "imagePath": "/server/images/3.jpg",
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
              "imagePath": "/server/images/4.jpg",
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
              "imagePath": "/server/images/5.jpg",
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
              "imagePath": "/server/images/6.jpg",
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

  module.exports = {
    getLatestData: getLatestData
  };
module.exports = async function (context, newImageQueueItem) {
    context.log('JavaScript queue trigger function processed work item', newImageQueueItem);

    const cv = require('opencv4nodejs');
    const fs = require("fs");

    const rows = 100; // height
    const cols = 100; // width
 
    // empty Mat
    const emptyMat = new cv.Mat(rows, cols, cv.CV_8UC3);
    
    // fill the Mat with default value
    const whiteMat = new cv.Mat(rows, cols, cv.CV_8UC1, 255);
    const blueMat = new cv.Mat(rows, cols, cv.CV_8UC3, [255, 0, 0]);

    const homedir = require('os').homedir();
    if (fs.existsSync(homedir)) {
        cv.imwrite(homedir + '/img.png', blueMat);
    }
    
};
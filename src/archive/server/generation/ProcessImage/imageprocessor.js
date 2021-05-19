const path = require('path');
const cv = require('opencv4nodejs');

const processImage = (absoluteImagePath) => {
    const mat = cv.imread(absoluteImagePath);
    let data = {
        height: mat.rows,
        width: mat.cols
    };
    return data;
}

exports.processImage = processImage;
const cv = require('opencv4nodejs');

module.exports = {

    processImage: function (absoluteImagePath) {
        const mat = cv.imread(absoluteImagePath);
        let data = {
            height: mat.rows,
            width: mat.cols
        };
        return data;
    }
};
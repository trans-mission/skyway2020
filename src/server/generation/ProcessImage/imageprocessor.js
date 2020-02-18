const cv = require('opencv4nodejs');

module.exports = {

    processImage: function (mat) {
        let data = {
            height: mat.rows,
            width: mat.cols
        };
        return data;
    }
};
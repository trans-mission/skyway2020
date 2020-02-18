const cv = require('opencv4nodejs');
const path = require('path')
const imageProcessor = require('./../ProcessImage/imageprocessor');

test('Processor should return correct dimensions', async () => {

    const currentDir = __dirname;
    const imagesDir = path.join(currentDir, "images");
    
    console.log(imagesDir);
     const mat = cv.imread(path.join(imagesDir, '1574719200047.jpg'));
     const data = imageProcessor.processImage(mat);

     expect(data.height).toBe(777);
     expect(data.width).toBe(1280);
});
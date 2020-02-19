const cv = require('opencv4nodejs');
const path = require('path')
const imageProcessor = require('./../ProcessImage/imageprocessor');

test('Processor should return correct dimensions', async () => {
    // Arrange
    const absolutImagePath = path.join(imagesDir, '1574719200047.jpg');

    // Act
    const data = imageProcessor.processImage(absolutImagePath);

    // Assert
    expect(data.height).toBe(777);
    expect(data.width).toBe(1280);
});
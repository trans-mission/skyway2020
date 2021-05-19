const path = require('path')
const imageProcessor = require('./../ProcessImage/imageprocessor');

const imagesDir = path.join(__dirname, "images");

test('Processor should return correct dimensions', async () => {
    // Arrange
    const absoluteImagePath = path.join(imagesDir, '1574719200047.jpg');

    // Act
    const data = imageProcessor.processImage(absoluteImagePath);

    // Assert
    expect(data.height).toBe(777);
    expect(data.width).toBe(1280);
});

test.skip('Processor should do a pretty good job at identifying the number of cars', async () => {
    // Arrange
    const absoluteImagePath = path.join(imagesDir, '1574719200047.jpg');

    // Act
    const data = imageProcessor.processImage(absoluteImagePath);

    // Assert
    expect(data.carCount).toBeGreaterThanOrEqual(15);
});

test.skip('Processor should do a pretty good job at identifying the number of cars at night', async () => {
    // Arrange
    const absoluteImagePath = path.join(imagesDir, '1581993900060.jpg');

    // Act
    const data = imageProcessor.processImage(absoluteImagePath);

    // Assert
    expect(data.carCount).toBeGreaterThanOrEqual(5);
});

test.todo('Processor should calculate a low frustration index when the car count is low and cars are sparsely distributed');
test.todo('Processor should calculate a high frustration index when the car count is high or cars are densely distributed');
test.todo('More');
test.todo('Tests');
test.todo('Here');
test.todo('Plz');
test.todo('Thx');
test.todo('OK Bai');
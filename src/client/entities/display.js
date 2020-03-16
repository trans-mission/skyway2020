const p5 = require('p5');

const s = ( sketch ) => {

    let img = sketch.loadImage('/static/images/1.jpg');
  
    sketch.setup = () => {
        sketch.createCanvas(1280, 777);
        sketch.noLoop();
    };
  
    sketch.draw = () => {
        sketch.image(img, 0, 0);
    };
  };
  
let myp5 = new p5(s);

const showImage = (imagePath) => {
    let myImage = myp5.loadImage(imagePath,  () => {
        myp5.image(myImage, 0, 0);
    });
}

module.exports = {
    showImage: showImage
};
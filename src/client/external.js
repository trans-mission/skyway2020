var p5 = require('p5');
var Tone = require('tone');

const getName = () => {
    return 'Jimmy';
};

const getLastName = () => {
    return 'Curran';
};

module.exports = {
    getName: getName,
    getLastName: getLastName
};

const s = ( p ) => {

    let img = p.loadImage('/static/images/2.jpg');

    p.setup = function() {
      p.createCanvas(1280, 777);
      p.noLoop();
    };

    p.draw = function() {
      p.background(0);
      p.fill(255);
      p.image(img, 0, 0);
    };

  };

let myp5 = new p5(s);

// Sound
var synth = new Tone.Synth().toMaster();

var loop = new Tone.Loop(function(time) {
  play(myp5);
}, "6m").start(0);

Tone.Transport.start();

var index = 0;

function play(myp5) {
  console.log('play-enter');
  synth.triggerAttackRelease('C' + (index + 1), '8n');
  let imagePath = getImagePath(index);
  let myImage = myp5.loadImage(imagePath, function () {
    myp5.image(myImage, 0, 0);
  });
  index++;
  if (index == 6) {
    index = 0;
  }
};

function getImagePath(index)
{
  return `/static/images/${index + 1}.jpg`;
}

// Data
fetch('api/test').then(response => {
  response.json().then(json => {
    let data = json;
    console.log(json);
  });
});
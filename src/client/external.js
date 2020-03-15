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

let loop = new Tone.Loop(function(time) {
  play(myp5);
}, "1m")

loop.start(0);

Tone.Transport.start();

var index = 0;
var data;

function play(myp5) {
  let note = getNote(index);
  synth.triggerAttackRelease(note, '4n');

  let imagePath = getImagePath(index);
  let myImage = myp5.loadImage(imagePath, function () {
    myp5.image(myImage, 0, 0);
  });

  index++;
  if (index == 6) {
    index = 0;
  }

};

function getNote(index) {
  let note = 'C' + (index + 3);
  console.log(note);
  return note;
}

function getImagePath(index)
{
  let panel = data.panels[index];
  return panel.imagePath;
}

// Data
fetch('api/test').then(response => {
  response.json().then(json => {
    data = json;
    console.log(json);
  });
});
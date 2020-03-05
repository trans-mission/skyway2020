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

    let x = 100; 
    let y = 100;
  
    p.setup = function() {
      p.createCanvas(700, 410);
    };
  
    p.draw = function() {
      p.background(0);
      p.fill(255);
      p.rect(x,y,50,50);
    };
  };
  
  let myp5 = new p5(s);

//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster()

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease('C4', '8n')
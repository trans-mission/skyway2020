const Tone = require('tone');
const display = require('./display');
const drone = require('./drone');

let data = {};
let index = 0;

const start = (d) => {
    data = d;
    let self = this;
    let loop = new Tone.Loop(function(time) {
        self.play();
    }, "1m");
    
    loop.start(0);
    Tone.Transport.start();
}

this.play = () => {
    this.showImage(index);
    this.playDrone(index);
    
    index++;
    if (index == 6) {
      index = 0;
    }
}

this.showImage = (index) => {
    const panel = data.panels[index];
    const imagePath = panel.imagePath;
    display.showImage(imagePath);
}

this.playDrone = (index) => {
    const note = this.getNote(index);
    drone.playNote(note);
}

this.getNote = (index) => {
    let note = 'C' + (index + 3);
    console.log(note);
    return note;
}

const pause = () => {
    Tone.Transport.pause();
}

const stop = () => {
    Tone.Transport.stop();
}

const updateData = (d) => {
    data = d;
}

module.exports = {
    start: start,
    pause: pause,
    stop: stop,
    updateData: updateData
};
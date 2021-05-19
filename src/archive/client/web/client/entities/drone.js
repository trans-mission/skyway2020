const Tone = require('tone');

let synth = new Tone.Synth().toMaster();

const play = (note) => {
    synth.triggerAttackRelease(note, '4n');
}

module.exports = {
    playNote: play
}
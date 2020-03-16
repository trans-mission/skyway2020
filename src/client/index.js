const sequencer = require('./entities/sequencer');
const dataService = require('./entities/dataService');

let data = dataService.getNewData();
sequencer.start(data);

// TODO
// Add HTML buttons for transport controls
//  sequencer.pause();
//  sequencer.stop();
// Refresh data on a loop and sequencer.updateData(data);
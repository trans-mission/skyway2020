const sequencer = require('./entities/sequencer');
const dataService = require('./services/dataService');

const dataRefreshRateInMinutes = 5;

const start = async () => {
    const data = await dataService.getNewData();
    sequencer.start(data);
}

const startDataLoop = (dataRefreshRateInMinutes) => {
    setInterval(() => {
        dataService.getNewData().then((data) => {
            sequencer.updateData(data);
        });
    }, dataRefreshRateInMinutes * 60 * 1000);
}

start();
startDataLoop(dataRefreshRateInMinutes);
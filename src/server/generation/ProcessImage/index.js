module.exports = async function (context, newImageQueueItem) {
    context.log('JavaScript queue trigger function processed work item', newImageQueueItem);
};
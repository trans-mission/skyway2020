

module.exports = async function (context, myTimer) {
    const request = require('request');
    const azure = require('azure-storage');
    
    const storageContainerName = 'images';
    const queueName = 'new-images';

    const blobService = azure.createBlobService(process.env["AzureWebJobsStorage"]);
    const queueService = azure.createQueueService(process.env["AzureWebJobsStorage"]);

    blobService.createContainerIfNotExists(storageContainerName, {publicAccessLevel: 'blob' }, function(error, result, response) {
        if (!error) {
            getImageFromCamAndSendQueueMessage();
        }
    });

    function getImageFromCamAndSendQueueMessage() {
        const fileName = getFileName();
        const stream = getBlobStream(fileName);
        const imageUri = getCameraUri();

        request(imageUri, (error, response, body) => {
            if (error) {
                context.error(error);
            }

            sendQueueMessage(fileName);
        }).pipe(stream);
    }

    function sendQueueMessage(message) {
        function createQueueMessage() {
            const queueMessage = Buffer.from(message).toString('base64');
            queueService.createMessage(queueName, queueMessage, function (error, results, response) {
                if (!error) {
                    // Message inserted
                }
            });
        }

        queueService.createQueueIfNotExists(queueName, function(error) {
            if (!error) {
                createQueueMessage();
            }
        });


    }
        
    function getBlobStream(fileName) {
        return blobService.createWriteStreamToBlockBlob(storageContainerName, fileName);
    }
    
    function getCameraUri() {
        return 'https://fl511.com/map/Cctv/647--12';
        /*
            Known list of Skyway camera URIs
            https://fl511.com/map/Cctv/645--12
            https://fl511.com/map/Cctv/647--12
            https://fl511.com/map/Cctv/652--12
            https://fl511.com/map/Cctv/654--12
            https://fl511.com/map/Cctv/710--12
            https://fl511.com/map/Cctv/724--12
            https://fl511.com/map/Cctv/726--12
            https://fl511.com/map/Cctv/813--12
        */
    }
    
    function getFileName() {
        const dateInMilliseconds = new Date().getTime().toString();
        const fileName = `${dateInMilliseconds}.jpg`;
        return fileName;
    }

    const timeStamp = new Date().toISOString();
    context.log('JavaScript timer trigger function ran!', timeStamp);
};





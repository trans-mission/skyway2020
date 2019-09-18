

module.exports = async function (context, myTimer) {
    const request = require('request');
    const azure = require('azure-storage');

    const imageUri = getCameraUri();
    
    const blobService = azure.createBlobService(process.env["AzureWebJobsStorage"]);
    blobService.createContainerIfNotExists('images', {publicAccessLevel: 'blob' }, function(error, result, response) {
        if (!error) {
            const stream = getBlobStream(blobService);
            request(imageUri, (error, response, body) => {
                if (error) {
                    context.error(error);
                }
            }).pipe(stream);
        }
    });
    
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
        
    function getBlobStream(blobService) {
        const fileName = new Date().getTime().toString();
        return blobService.createWriteStreamToBlockBlob('images', fileName);
    }
        
    const timeStamp = new Date().toISOString();
    context.log('JavaScript timer trigger function ran!', timeStamp);
};



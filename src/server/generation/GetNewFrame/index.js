

module.exports = async function (context, myTimer) {
    const request = require('request');
    const azure = require('azure-storage');

    const imageUri = 'https://fl511.com/map/Cctv/647--12';
    var timeStamp = new Date().toISOString();
    
    const blobService = azure.createBlobService(process.env["AzureWebJobsStorage"]);
    blobService.createContainerIfNotExists('images', {
    publicAccessLevel: 'blob'
    }, function(error, result, response) {
        if (!error) {
            console.log('result:' ,result);
            // if result = true, container was created.
            // if result = false, container already existed.
            const stream = blobService.createWriteStreamToBlockBlob('images', 'file2.jpeg');
            request(imageUri, (error, response, body) => {
                console.error('error:', error);
                console.log('statusCode:', response && response.statusCode);
        
                
            }).pipe(stream);
        }
    });

    

    context.log('JavaScript timer trigger function ran!', timeStamp);   
};
module.exports = async function (context, newImageQueueItem) {
    context.log('JavaScript queue trigger function processed work item', newImageQueueItem);

    const cv = require('opencv4nodejs');
    const fs = require("fs");

    const rows = 100; // height
    const cols = 100; // width
 
    // empty Mat
    const emptyMat = new cv.Mat(rows, cols, cv.CV_8UC3);
    
    // fill the Mat with default value
    const whiteMat = new cv.Mat(rows, cols, cv.CV_8UC1, 255);
    const blueMat = new cv.Mat(rows, cols, cv.CV_8UC3, [255, 0, 0]);

    const homedir = require('os').homedir();
    if (fs.existsSync(homedir)) {
        cv.imwrite(homedir + '/img.png', blueMat);
    }
    
    const azure = require('azure-storage');
    const Stream = require('stream');
    
    const storageContainerName = 'images';
    const blobService = azure.createBlobService(process.env["AzureWebJobsStorage"]);
    const fileName = newImageQueueItem;
    // const writableStream = new Stream.Writable()
    // blobService.createReadStream(storageContainerName, fileName).pipe(writableStream);
    
    const retryOperations = new azure.ExponentialRetryPolicyFilter();
    const tableService = azure.createTableService(process.env["AzureWebJobsStorage"]).withFilter(retryOperations);
    const tableName = 'testTable';
    tableService.createTableIfNotExists(tableName, function(error, result, response){
        if(!error){
            const entity = getEntity(fileName);
            tableService.insertEntity(tableName, entity, function (error, result, response) {
                if(!error){
                  // Entity inserted
                }
              });
        }
      });

      
      function getEntity(fileName) {
        const generator = azure.TableUtilities.entityGenerator;
        var entity = {
            PartitionKey: generator.String(getPartitionKey()),
            RowKey: generator.String(getRowKey(fileName)),
            message: generator.String('This is a successful test!'),
            goodDate: generator.DateTime(new Date(Date.UTC(2012, 8, 14))),
          };
        return entity;
      }

      function getPartitionKey() {
        const d = new Date();
        const year = d.getFullYear();
        const month = ("0"+(d.getMonth()+1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2)
        const partitionKey =  year + month + day;
        return partitionKey;
      }

      function getRowKey(fileName) {
          let rowKey = fileName.split('.jpg')[0];
          return rowKey;
      }

};
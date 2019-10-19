module.exports = async function (context, newImageQueueItem) {
    context.log('JavaScript queue trigger function processed work item', newImageQueueItem);
    
    const azure = require('azure-storage');
    const cv = require('opencv4nodejs');
    const os = require('os');
    const fs = require('fs');
    const path = require('path');
    
    const storageContainerName = 'images';
    const blobService = azure.createBlobService(process.env["AzureWebJobsStorage"]);
    const fileName = newImageQueueItem;

    const homeDir = os.homedir();
    context.log("homeDir:", homeDir);
    const workDirName = 'overflow';
    const workDir = path.join(homeDir, workDirName);
    context.log("workDir:", workDir);

    context.log("workDir exists?: ", fs.existsSync(workDir))

    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir);
    }
    
    blobService.getBlobToLocalFile(storageContainerName, fileName, path.join(workDir, 'temp.jpg'), (error, result) => {
      const data = processImage();
      storeData(data);
    });

    function processImage() {
      const mat = cv.imread(path.join(workDir, 'temp.jpg'));
      
      const data = {
        height: mat.rows,
        width: mat.cols
      };

      return data;
    }
    
    function storeData(data) {
      const retryOperations = new azure.ExponentialRetryPolicyFilter();
      const tableService = azure.createTableService(process.env["AzureWebJobsStorage"]).withFilter(retryOperations);
      const tableName = 'testTable2';
      tableService.createTableIfNotExists(tableName, function(error, result, response){
          if(!error){
              const entity = getEntity(fileName, data);
              tableService.insertEntity(tableName, entity, function (error, result, response) {
                  if(!error){
                    // Entity inserted
                  } else {
                    console.log(error);
                  }
                });
          }
        });  

        function getEntity(fileName, data) {
          const generator = azure.TableUtilities.entityGenerator;
          var entity = {
              PartitionKey: generator.String(getPartitionKey()),
              RowKey: generator.String(getRowKey(fileName)),
              width: data.width,
              height: data.height
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
    }
};
const azure = require('azure-storage');
const os = require('os');
const fs = require('fs');
const path = require('path');
const imageProcessor = require('./imageprocessor');

module.exports = async function (context, newImageQueueItem) {
    context.log('JavaScript queue trigger function processed work item', newImageQueueItem);    

    const storageContainerName = 'images';
    const blobService = azure.createBlobService(process.env["AzureWebJobsStorage"]);
    const fileName = newImageQueueItem;

    const workDir = getOrCreateWorkDir();
    
    blobService.getBlobToLocalFile(storageContainerName, fileName, path.join(workDir, 'temp.jpg'), (error, result) => {
      const data = processImage();
      storeData(data);
    });

    function processImage() {
      const data = imageProcessor.processImage(path.join(workDir, 'temp.jpg'));
      console.log("Extracted Data: ", data);
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

    function getOrCreateWorkDir(context) {
      const debug = !!context;
      const homeDir = os.homedir();
      
      if (debug) {
        context.log("homeDir:", homeDir);
      }
      
      const workDirName = 'overflow';
      const workDir = path.join(homeDir, workDirName);
      
      if (debug) {
        context.log("workDir:", workDir);
        context.log("workDir exists?: ", fs.existsSync(workDir))
      }

      if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir);
      }

      return workDir;
    }
};



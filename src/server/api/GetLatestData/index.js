const util = require('util');
const azure = require('azure-storage');
const _ = require('lodash');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    // async attempt: const queryEntitiesAsync = util.promisify(tableSvc.queryEntities);

    const getPartitionKey = () => {
      const today = new Date();
      const result = today.toISOString().slice(0,10).replace(/-/g,"");
      return result;
    }

    const mapToEntities = (data) => {
      const result = [];
      data.forEach((row) => {
        let imageName = `${row.RowKey._}.jpg`;
        result.push({
          imagePath: imageName,
          frustrationIndex: 7,
          cars: [/* TODO */]
        })
      });
     
      return result;
    }

    const getFilteredSet = (todaysData) => {
      let filteredSet = _.filter(todaysData, (o) => {
        let width = o.width._;
        return width >= 1280;
      });
      filteredSet = _.orderBy(todaysData, ['RowKey._'], ['desc']);
      filteredSet = _.take(filteredSet, 6);
      const result = mapToEntities(filteredSet);
      return result;
    }

    const getJsonResult = (data) => {
      let result = {};
      result.lastModified = new Date().toISOString();
      result.panels = data;

      // data.forEach((row) => {
      //   result.panels.push(row);
      // });
      return result;
    }


    async function getAllFromTable() {
      return new Promise((resolve, reject) => {
        const retryOperations = new azure.ExponentialRetryPolicyFilter();
        const tableSvc = azure.createTableService(process.env["AzureWebJobsStorage"]).withFilter(retryOperations);

        const partitionKey = getPartitionKey();
        const query = new azure.TableQuery().where('PartitionKey eq ?', partitionKey);

        tableSvc.queryEntities('testTable2', query, null, function(error, result, response) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    }

    const result = await getAllFromTable();
    const filteredSet = getFilteredSet(result.entries);
    const jsonResult = getJsonResult(filteredSet);
    context.res = {
      status: 200,
      headers: {"Content-Type": "application/json"},
      body: jsonResult
    };
}


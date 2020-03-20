const azure = require('azure-storage');
const _ = require('lodash');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const retryOperations = new azure.ExponentialRetryPolicyFilter();
    const tableSvc = azure.createTableService(process.env["AzureWebJobsStorage"]).withFilter(retryOperations);

    const getPartitionKey = () => {
      const today = new Date();
      const result = today.toISOString().slice(0,10).replace(/-/g,"");
      return result;
    }

    const getFilteredSet = (todaysData) => {
      const filteredSet = _.orderBy(todaysData, ['RowKey._'], ['desc']);
      const result = _.take(filteredSet, 6);
      return result;
    }

    const partitionKey = getPartitionKey();
    var query = new azure.TableQuery()
      .where('PartitionKey eq ?', partitionKey);

    tableSvc.queryEntities('testTable2',query, null, function(error, result, response) {
        if(!error) {
          const filteredSet = getFilteredSet(result.entries);
        }
      });

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}


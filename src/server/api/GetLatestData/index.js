const azure = require('azure-storage');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const retryOperations = new azure.ExponentialRetryPolicyFilter();
    const tableSvc = azure.createTableService(process.env["AzureWebJobsStorage"]).withFilter(retryOperations);
    var query = new azure.TableQuery().where('PartitionKey eq ?', '20200319');

    tableSvc.queryEntities('testTable2',query, null, function(error, result, response) {
        if(!error) {
          // query was successful
          console.log(result);
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
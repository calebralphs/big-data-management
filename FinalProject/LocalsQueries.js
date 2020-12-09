/**
 * Hold the queries to run over the multikey object index for a given collection.
 */
load("QueryTemplate.js");

function local1(databaseName){
    const queryId = "L1"; // Change number to a number to use as a brief identifier
    const queryTitle = ""; // Fill in to describe what index this query is testing
    const queryDescription = ""; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
   // const queryFunc = () => database.find({salary : {$gt : 50000}}).explain("executionStats");
    const indexName = "favoriteLocals_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}
/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the multikey object index for.
 */
function runAllLocalsQueries(databaseName){
    // local1(databaseName);
}
/**
 * Hold the queries to run over the unique provided id index for a given collection.
 */
load("QueryTemplate.js");

function id1(databaseName){
    const queryId = "I1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Sort by id"; // Fill in to describe what index this query is testing
    const queryDescription = "Sort 1 by _id"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find().sort({_id : 1}).allowDiskUse().explain("executionStats");
    const indexName = "_id_";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function id2(databaseName){
    const queryId = "I2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Sort by id"; // Fill in to describe what index this query is testing
    const queryDescription = "Sort 1 by _id"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find().sort({_id : -1}).allowDiskUse().explain("executionStats");
    const indexName = "_id_";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}
/**
 * Runs all of the specified queries to experiment on the unique provided id index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the 2dsphere home index for.
 */
function runAllIdQueries(databaseName){
    id1(databaseName);
    id2(databaseName);
}
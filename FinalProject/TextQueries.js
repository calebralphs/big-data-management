/**
 * Hold the queries to run over the text wildcard index for a given collection.
 */
load("QueryTemplate.js");

function text1(databaseName){
    const queryId = "T1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Search for first name"; // Fill in to describe what index this query is testing
    const queryDescription = "Search on the name in the first document"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const name = database.find().next().name;
    const queryFunc = () => database.find({$text : {
        $search : name,
        $language : "none",
    }}).explain("executionStats");
    const indexName = "$**_text";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function text2(databaseName){
    const queryId = "T2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Search for first name with sorting"; // Fill in to describe what index this query is testing
    const queryDescription = "Search on the name in the first document with sorting by meta text score."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const name = database.find().next().name;
    const queryFunc = () => database.find({$text : {
        $search : name,
        $language : "none",
    }}).sort({score : {$meta : "textScore"}}).allowDiskUse().explain("executionStats");
    const indexName = "$**_text";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function text3(databaseName){
    const queryId = "T3"; // Change number to a number to use as a brief identifier
    const queryTitle = "Text search in aggregation"; // Fill in to describe what index this query is testing
    const queryDescription = "Aggregation on the friends in the first document with aggregation."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const names = database.find().next().friends.join(" ");
    const queryFunc = () => database.aggregate([
        { $match: { $text: { $search:  names, $language : "none"} } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]).hasNext();
    const indexName = "$**_text";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName, false);
}

/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the text wildcard index for.
 */
function runAllTextQueries(databaseName){
    text1(databaseName);
    text2(databaseName);
    text3(databaseName);
}
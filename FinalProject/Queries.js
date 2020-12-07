load("HideAllIndexes.js");
function query1(databaseName){
    const queryId = 1; // Change number to a number to use as a brief identifier
    const queryTitle = ""; // Fill in to describe what index this query is testing
    const queryDescription = ""; // Fill in to describe in more detail about the
    
    print("Query " + queryId + ": " + queryTitle);

    const database = db.getCollection(databaseName);

    database.unhideIndex({});

    // Insert Query

    printjson(database.explain());

    hideAllIndexes(databaseName);
}

function query2(databaseName){
    const queryId = 2; // Change number to a number to use as a brief identifier
    const queryTitle = ""; // Fill in to describe what index this query is testing
    const queryDescription = ""; // Fill in to describe in more detail about the
    
    print("Query " + queryId + ": " + queryTitle);

    const database = db.getCollection(databaseName);

    database.unhideIndex({});

    // Insert Query
    
    printjson(database.explain());

    hideAllIndexes(databaseName);

}
// Add more queries
function runAllQueries(databaseName){
    // Call all of the above functions
}
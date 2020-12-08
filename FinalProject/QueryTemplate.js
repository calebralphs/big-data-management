load("HideAllIndexes.js");
function printStats(stats){
    const execStats = stats.executionStats;
    const hasIndex = execStats.executionStages.hasOwnProperty("inputStage") && execStats.executionStages.inputStage.hasOwnProperty("indexName");
    const indexStr = hasIndex ? execStats.executionStages.inputStage.indexName : "No index used";


    const resultObj = {
     timeMilli : execStats.executionTimeMillis,
     keysExamined : execStats.totalKeysExamined,
     docsExamined : execStats.totalDocsExamined,
     index : indexStr,
     nReturned : execStats.nReturned
    }
    printjson(resultObj);
}

function queryRunner(databaseName, queryId, queryTitle, queryDescription, queryFunc, indexName){
    print("Query " + queryId + ": " + queryTitle);
    print(queryDescription);

    var database = db.getCollection(databaseName);

    // W/o index
    print("Without index:");
    printStats(queryFunc());
    // printjson(database.explain());

    // With index
    print("With salary index");
    database.unhideIndex(indexName);

    printStats(queryFunc());
    hideAllIndexes(databaseName);  
    print();
}
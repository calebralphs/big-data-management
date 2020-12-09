/**
 * Hold functions that allow for modularly adding queries to the experiment to run.
 */
load("HideAllIndexes.js");
/**
 * Print the relevant stats from the larger stats object returned by cursor.explain()
 * 
 * @param {*} stats An object describing the execution stats for a query, given by cursor.explain("executionStats")
 */
function printStats(stats){
    const execStats = stats.executionStats;
    const hasIndex = execStats.executionStages.hasOwnProperty("inputStage") && execStats.executionStages.inputStage.hasOwnProperty("indexName");
    const indexStr = hasIndex ? execStats.executionStages.inputStage.indexName : "No index used";
    // print("Full stats");
    // printjson(stats);

    const resultObj = {
     executionSuccess : execStats.executionSuccess,
     timeMilli : execStats.executionTimeMillis,
     keysExamined : execStats.totalKeysExamined,
     docsExamined : execStats.totalDocsExamined,
     index : indexStr,
     nReturned : execStats.nReturned
    }
    printjson(resultObj);
}

/**
 * Run a given query and print the given identifying and descriptive information about it.
 * 
 * @param {String} databaseName The name of the collection to run the query over.
 * @param {String} queryId A short identifier to order queries without needing to check the title or description.
 * @param {String} queryTitle A brief description of the situation being tested by this query.
 * @param {String} queryDescription A longer description of the query being run.
 * @param {*} queryFunc A function that executes the query and returns the result of cursor.explain() on the query
 * @param {String} indexName The name of the index that is being experimented on for this query.
 * @param {boolean} withStats True if the queryFunc should end with a call to explain to get stats. False otherwise, in which case only the manually calculated time will be printed.
 */
function queryRunner(databaseName, queryId, queryTitle, queryDescription, queryFunc, indexName, withStats=true){
    print("Query " + queryId + ": " + queryTitle);
    print(queryDescription);
    hideAllIndexes(databaseName); 
    var database = db.getCollection(databaseName);
    var cursor, start, end, numResults
    // W/o index
    print("Without index:");
    
    try{
        if (withStats){
            printStats(queryFunc());
        }
        else{
            start = Date.now();
            cursor = queryFunc();
            end = Date.now();
            print("Execution time: " + (end-start) + " ms");
            print("Result: ")
            printjson(cursor);
        }
    }
    catch(error){
        print(error)
    }
    // printjson(database.explain());
    print();
    // With index
    print("With index");
    database.unhideIndex(indexName);
    try {
        if (withStats){
            printStats(queryFunc());
        }
        else{
            start = Date.now();
            cursor = queryFunc();
            end = Date.now();
            print("Execution time: " + (end-start) + " ms");
            print("Result: ")
            printjson(cursor);
        }
    } catch (error) {
        print(error)
    }
    hideAllIndexes(databaseName);  
    print();
}
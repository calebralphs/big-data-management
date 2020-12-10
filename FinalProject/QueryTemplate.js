/**
 * Hold functions that allow for modularly adding queries to the experiment to run.
 */
load("HideAllIndexes.js");
/**
 * Return the relevant stats from the larger stats object returned by cursor.explain()
 * 
 * @param {*} stats An object describing the execution stats for a query, given by cursor.explain("executionStats")
 * @returns The relevant stats from the larger stats object returned by cursor.explain() 
 */
function getStats(stats){
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
    return resultObj;
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
    var withIndexStats = [];
    var withoutIndexStats = [];
    
    try{
        // Order of runs
        // w/o index
        // w/index
        // w/index
        // w/o index
        // w/o index
        // w/index
        withoutIndexStats.push(runQueryFunc(queryFunc, withStats));

        database.unhideIndex(indexName);

        withIndexStats.push(runQueryFunc(queryFunc, withStats));
        withIndexStats.push(runQueryFunc(queryFunc, withStats));

        database.hideIndex(indexName);

        withoutIndexStats.push(runQueryFunc(queryFunc, withStats));
        withoutIndexStats.push(runQueryFunc(queryFunc, withStats));

        database.unhideIndex(indexName);

        withIndexStats.push(runQueryFunc(queryFunc, withStats));

    }catch (error){
        print(error);
    }
    // In case the first query errors out, try to get stats for a run with an index.   
    if(withIndexStats.length === 0){
        try{
            database.unhideIndex(indexName);

            withIndexStats.push(runQueryFunc(queryFunc, withStats));
        }catch(error){
            print(error);
        }
    }
    // Separate the try-catch blocks in case there is an error when using or not using an index.    
    try{
        print("With index");
        var medianStat = getMedianStats(withIndexStats);
        if (medianStat === -1){
            print("Error retrieving stats for query with index.");
        }
        else{
            printjson(medianStat);
        }

        print();

        print("Without index");
        var medianStat = getMedianStats(withoutIndexStats);
        if (medianStat === -1){
            print("Error retrieving stats for query without index.");
        }
        else{
            printjson(medianStat);
        }
    }
    catch(error){
        print(error);
    }

    
    hideAllIndexes(databaseName);  
    print();
}

/**
 * Run the queryFunc function and return the stats either provided by explain() or manually by Date.now().
 * 
 * @param {*} queryFunc The query function to run and get the stats including the execution time of for the field timeMilli. 
 * @param {*} withStats True if the query returns the result of calling cursor.explain("executionStats"), false otherwise to indicate manual timing is needed.
 * @returns The object holding the stats object which should include the field timeMilli for the execution time in milliseconds at a minimum.
 */
function runQueryFunc(queryFunc, withStats){
    var cursor, start, end;

    if (withStats){
        return getStats(queryFunc());
    }
    else{
        start = Date.now();
        cursor = queryFunc();
        end = Date.now();
        return {timeMilli : end-start, result : cursor};
    }

}
/**
 * Return a stats object where the field timeMilli is set to the medium timeMilli value of the given stats objects.
 * @param {*} stats An array of objects that all must include a timeMilli field representing the execution time for a run.
 * @returns The first stats object with the median time. Fields other than the time should be the same across runs of the same query and so can be used from any stats object.
 */
function getMedianStats(stats){
    var vals = [];
    for(var stat of stats){
        vals.push(stat.timeMilli);
    }
    if (vals.length === 0){return -1;}
    vals = vals.sort((a,b)=> a-b);
    if (vals.length % 2 === 1){
        stats[0].timeMilli = vals[Math.floor(vals.length/2)];
    }
    else{
        stats[0].timeMilli = (vals[Math.floor((vals.length - 1)/2)] + vals[Math.floor(vals.length/2)]) / 2;
    }
    return stats[0];
}
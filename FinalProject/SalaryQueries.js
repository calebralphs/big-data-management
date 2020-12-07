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

function salary1(databaseName){
    const queryId = 1; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range w/o sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}).explain("executionStats");
    const indexName = "salary_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salary2(databaseName){
    const queryId = 2; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range with 1 sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field with sorting"; // Fill in to describe in more detail about the
    
    print("Query " + queryId + ": " + queryTitle);
    print(queryDescription);

    var database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}).sort({salary : 1});

    // W/o index
    print("Without index:");
    queryFunc();

    printjson(database.explain());

    // With index
    print("With salary index");
    database.unhideIndex({salary : 1});

    queryFunc();

    printjson(database.explain());

    hideAllIndexes(databaseName);

}

function salary3(databaseName){
    const queryId = 3; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range with -1 sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field with opposite sorting"; // Fill in to describe in more detail about the
    
    print("Query " + queryId + ": " + queryTitle);
    print(queryDescription);

    var database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}).sort({salary : -1});

    // W/o index
    print("Without index:");
    queryFunc();

    printjson(database.explain());

    // With index
    print("With salary index");
    database.unhideIndex({salary : 1});

    queryFunc();

    printjson(database.explain());

    hideAllIndexes(databaseName);

}

function salary4(databaseName){
    const queryId = 4; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range with projection on salary field only"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field with projection of only the indexes field"; // Fill in to describe in more detail about the
    
    print("Query " + queryId + ": " + queryTitle);
    print(queryDescription);

    var database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}, {_id : 0, salary: 1});

    // W/o index
    print("Without index:");
    queryFunc();

    printjson(database.explain());

    // With index
    print("With salary index");
    database.unhideIndex({salary : 1});

    queryFunc();

    printjson(database.explain());

    hideAllIndexes(databaseName);

}

function salary5(databaseName){
    const queryId = 5; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple equality query on salary field"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple equality query over the salary field using the salary from the first doc"; // Fill in to describe in more detail about the
    
    print("Query " + queryId + ": " + queryTitle);
    print(queryDescription);

    var database = db.getCollection(databaseName);
    const sal = database.find().next().salary;
    const queryFunc = () => database.find({salary : sal});

    // W/o index
    print("Without index:");
    queryFunc();

    printjson(database.explain());

    // With index
    print("With salary index");
    database.unhideIndex({salary : 1});

    queryFunc();

    printjson(database.explain());

    hideAllIndexes(databaseName);

}

function salary6(databaseName){
    const queryId = 6; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple inequality query on salary field"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple inequality query over the salary field using the salary from the first doc"; // Fill in to describe in more detail about the
    
    print("Query " + queryId + ": " + queryTitle);
    print(queryDescription);

    var database = db.getCollection(databaseName);
    const sal = database.find().next().salary;

    const queryFunc = () => database.find({salary : {$ne : sal}});

    // W/o index
    print("Without index:");
    queryFunc();

    printjson(database.explain());

    // With index
    print("With salary index");
    database.unhideIndex({salary : 1});

    queryFunc();

    printjson(database.explain());

    hideAllIndexes(databaseName);

}

function runAllSalaryQueries(databaseName){
    salary1(databaseName);
    // salary2(databaseName);
    // salary3(databaseName);
    // salary4(databaseName);
    // salary5(databaseName);
    // salary6(databaseName);
}
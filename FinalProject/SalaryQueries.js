/**
 * Hold the queries to run over the salary index for a given collection.
 */
load("QueryTemplate.js");

function salary1(databaseName){
    const queryId = "S1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range w/o sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}).explain("executionStats");
    const indexName = "salary_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salary2(databaseName){
    const queryId = "S2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range with 1 sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field with sorting"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}).sort({salary : 1}).allowDiskUse().explain("executionStats");
    const indexName = "salary_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salary3(databaseName){
    const queryId = "S3"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range with -1 sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field with opposite sorting"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}).sort({salary : -1}).allowDiskUse().explain("executionStats");
    const indexName = "salary_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salary4(databaseName){
    const queryId = "4"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range with projection on salary field only"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field with projection of only the indexes field"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 50000}}, {_id : 0, salary: 1}).explain("executionStats");
    const indexName = "salary_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);

}

function salary5(databaseName){
    const queryId = "S5"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple equality query on salary field"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple equality query over the salary field using the salary from the first doc"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const sal = database.find().next().salary;
    const queryFunc = () => database.find({salary : sal}).explain("executionStats");
    const indexName = "salary_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);

}

function salary6(databaseName){
    const queryId = "S6"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple inequality query on salary field"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple inequality query over the salary field using the salary from the first doc"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const sal = database.find().next().salary;
    const queryFunc = () => database.find({salary : {$ne : sal}}).explain("executionStats");
    const indexName = "salary_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the salary index for.
 */
function runAllSalaryQueries(databaseName){
    salary1(databaseName);
    salary2(databaseName);
    salary3(databaseName);
    salary4(databaseName);
    salary5(databaseName);
    salary6(databaseName);
}
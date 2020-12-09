/**
 * Hold the queries to run over the salary and birthday compound index for a given collection.
 */
load("QueryTemplate.js");

function salaryBirthday1(databaseName){
    const queryId = "SB1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple equality on salary prefix"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const sal = database.find().next().salary;
    const queryFunc = () => database.find({salary : sal}).explain("executionStats");
    const indexName = "salary_1_birthday_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salaryBirthday2(databaseName){
    const queryId = "SB2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple equality on birthday suffix"; // Fill in to describe what index this query is testing
    const queryDescription = "There should be no difference from the index because query does not include prefix."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const year = database.find().next().birthday.year;
    const queryFunc = () => database.find({"birthday.year" : year}).explain("executionStats");
    const indexName = "salary_1_birthday_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salaryBirthday3(databaseName){
    const queryId = "SB3"; // Change number to a number to use as a brief identifier
    const queryTitle = "Salary and birthday equality"; // Fill in to describe what index this query is testing
    const queryDescription = "There should be a difference from the index because query involves all fields."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const first =  database.find().next();
    const year = first.birthday.year;
    const sal = first.salary;
    const queryFunc = () => database.find({"birthday.year" : year, salary: sal}).explain("executionStats");
    const indexName = "salary_1_birthday_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salaryBirthday4(databaseName){
    const queryId = "SB4"; // Change number to a number to use as a brief identifier
    const queryTitle = "Salary range w/o sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 90000}}).explain("executionStats");
    const indexName = "salary_1_birthday_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function salaryBirthday5(databaseName){
    const queryId = "SB5"; // Change number to a number to use as a brief identifier
    const queryTitle = "Salary range w/ 1 sort"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range query over the salary field with sorting"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({salary : {$gt : 90000}}).sort({salary : 1}).allowDiskUse().explain("executionStats");
    const indexName = "salary_1_birthday_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}
/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the salary and birthday compound index for.
 */
function runAllSalaryBirthdayQueries(databaseName){
    salaryBirthday1(databaseName);
    salaryBirthday2(databaseName);
    salaryBirthday3(databaseName);
    salaryBirthday4(databaseName);
    salaryBirthday5(databaseName);
    // salaryBirthday1(databaseName);
    // salaryBirthday1(databaseName);
}
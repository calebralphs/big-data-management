load("SalaryQueries.js");
load("SalaryBirthdayQueries.js");
load("FriendsQueries.js");
load("HomeQueries.js");
load("LocalsQueries.js");
load("NameQueries.js");
load("TextQueries.js");
load("IdQueries.js");

/**
 * Run all of the queries created for each index.
 * @param {String} databaseName The name of the collection to run the queries over.
 */
function runAllQueries(databaseName){
    runAllSalaryQueries(databaseName);
    runAllSalaryBirthdayQueries(databaseName);
    runAllFriendsQueries(databaseName);
    runAllHomeQueries(databaseName);
    runAllLocalsQueries(databaseName);
    runAllNameQueries(databaseName);
    runAllTextQueries(databaseName);
    runAllIdQueries(databaseName);
}
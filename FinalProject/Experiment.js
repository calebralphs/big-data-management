// Use explain() to show which index was used
// Load HideAllIndexes in between queries to reset which indexes are available to use and unhide the ones that should be used
// Run the same query before and after unhiding the index to get the comparison
// Put the actual queries in a separate file reduce redundancy. Not sure if collection name can be parameterized.
load("HideAllIndexes.js");
load("Queries.js");
var databases = ["people1","people10","people50"];
for(let i = 0; i < 3; i++){
    print()
    print("-----------------------Experiment for database " + databases[i] + "-----------------------");
    hideAllIndexes(databases[i]);

    // Call a function in Queries.js to run all of the queries for a database. Make each query handle hiding and unhiding indexes.
    runAllQueries(databases[i]);
}
/**
 * Hold the queries to run over the friends multikey index for a given collection.
 */
load("QueryTemplate.js");

function friends1(databaseName){
    const queryId = "F1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Find name in friends"; // Fill in to describe what index this query is testing
    const queryDescription = "Find the people who have the first document's name as a friend."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const name = database.find().next().name;
    const queryFunc = () => database.find({friends : name}).explain("executionStats");
    const indexName = "friends_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function friends2(databaseName){
    const queryId = "F2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Find people with no friends"; // Fill in to describe what index this query is testing
    const queryDescription = "Find the people have no friends."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => {
        return database.find({friends : {$size: 0}}).explain("executionStats");
    };
    const indexName = "friends_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function friends3(databaseName){
    const queryId = "F3"; // Change number to a number to use as a brief identifier
    const queryTitle = "Find people with 4 friends"; // Fill in to describe what index this query is testing
    const queryDescription = "Find the people have 4 friends."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => {
        return database.find({friends : {$size: 4}}).explain("executionStats");
    };
    const indexName = "friends_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function friends4(databaseName){
    const queryId = "F4"; // Change number to a number to use as a brief identifier
    const queryTitle = "Find people with the same friends as the first doc"; // Fill in to describe what index this query is testing
    const queryDescription = "Find the people that have the same friends in the same order as the first doc."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const friends = database.find().next().friends;
    const queryFunc = () => {
        return database.find({friends : friends}).explain("executionStats");
    };
    const indexName = "friends_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function friends5(databaseName){
    const queryId = "F5"; // Change number to a number to use as a brief identifier
    const queryTitle = "Find excluded friends"; // Fill in to describe what index this query is testing
    const queryDescription = "Find the people who have the first document's name as a friend and a friend of one of their friends since there are no enforced constraints between friends."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const cursor = database.find();

    var doc = cursor.next();
    // var name = doc.name;
    var friends = doc.friends;

    const queryFunc = () => {
        return database.find({friends : {$in : friends}, name : {$nin : friends}}).explain("executionStats");
    };
    const indexName = "friends_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}
/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the multikey friends index for.
 */
function runAllFriendsQueries(databaseName){
    friends1(databaseName);
    friends2(databaseName);
    friends3(databaseName);
    friends4(databaseName);
    friends5(databaseName);
}
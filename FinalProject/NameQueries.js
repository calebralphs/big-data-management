/**
 * Hold the queries to run over the hashed name index for a given collection.
 */
load("QueryTemplate.js");

function name1(databaseName){
    const queryId = "N1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple equality search on hashed field"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple equality search on name using the name of the first collection"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const name = database.find().next().name;
    const queryFunc = () => database.find({name : name}).explain("executionStats");
    const indexName = "name_hashed";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function name2(databaseName){
    const queryId = "N2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple range search on hashed field"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple range search on name using the name of the first collection"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const name = database.find().next().name;
    const queryFunc = () => database.find({name : {$gt : name}}).explain("executionStats");
    const indexName = "name_hashed";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function name3(databaseName){
    const queryId = "N3"; // Change number to a number to use as a brief identifier
    const queryTitle = "Simple inequality search on hashed field"; // Fill in to describe what index this query is testing
    const queryDescription = "Simple inequality search on name using the name of the first collection"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const name = database.find().next().name;
    const queryFunc = () => database.find({name : {$ne : name}}).explain("executionStats");
    const indexName = "name_hashed";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function name4(databaseName){
    const queryId = "N4"; // Change number to a number to use as a brief identifier
    const queryTitle = "Name salary aggregation"; // Fill in to describe what index this query is testing
    const queryDescription = "Aggregate the number of records, sum, max, and min of salary on name"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);

    const queryFunc = () => database.aggregate(
        [
            {$group : {_id : "$name", count : {$sum : 1}, max : {$max : "$salary"}, min: {$min : "$salary"}}}
        ]
    ).next();
    const indexName = "name_hashed";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName, false);
}

function name5(databaseName){
    const queryId = "N5"; // Change number to a number to use as a brief identifier
    const queryTitle = "Find friend network"; // Fill in to describe what index this query is testing
    const queryDescription = "Find the people who have the first document's name as a friend and a friend of one of their friends since there are no enforced constraints between friends."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const doc = database.find().next()
    const name = doc.name;
    // const friends = doc.friends;
    const queryFunc = () => {
        var seen = [];
        var queue = [name];
        while(queue.length > 0){
            var current = queue.pop(0);
            if (!(current in seen)){
                var cursor = database.find({name : current});
                while (cursor.hasNext()){
                    var cur = cursor.next();
                    if (!(cur in queue) && (!(cur in seen))){
                        queue.push(...cur.friends);
                    }
                }
                seen.push(current);
            } 
        }
        return seen;
    }
    const indexName = "friends_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName, false);
}
/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the hashed name index for.
 */
function runAllNameQueries(databaseName){
    name1(databaseName);
    name2(databaseName);
    name3(databaseName);
    name4(databaseName);
    name5(databaseName);
}
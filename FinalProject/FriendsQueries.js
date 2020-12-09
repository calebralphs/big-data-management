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
    const queryTitle = "Find excluded friends"; // Fill in to describe what index this query is testing
    const queryDescription = "Find the people who have the first document's name as a friend and a friend of one of their friends since there are no enforced constraints between friends."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    
    

    const queryFunc = () => {
        const cursor = database.find();
        while(cursor.hasNext()){
            var doc = cursor.next();
            var name = doc.name;
            var friends = doc.friends;
            
        }
        database.find({friends : name, name : {$nin : friends}})
    };
    const indexName = "friends_-1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName, false);
}

function friends3(databaseName){
    const queryId = "F3"; // Change number to a number to use as a brief identifier
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
                        queue.extend(cur.friends);
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
 * @param {String} databaseName The name of the collection to run the queries over the multikey friends index for.
 */
function runAllFriendsQueries(databaseName){
    friends1(databaseName);
    // friends2(databaseName);
    friends3(databaseName);
}
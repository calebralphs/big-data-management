/**
 * Hold the queries to run over the multikey object index for a given collection.
 */
load("QueryTemplate.js");

function local1(databaseName){
    const queryId = "L1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Check if any locals are near WPI"; // Fill in to describe what index this query is testing
    const queryDescription = "Get people who have favorite locales within 1 latitude and longitude of WPI"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const longitudeMax = -70.805353;
    const longitudeMin = -72.805353;
    const latitudeMax =  43.273922;
    const latitudeMin =  41.273922;
    const queryFunc = () => {

        return database.find({favoriteLocals : 
            {$elemMatch : 
                {"coordinates.0" : {$gt : longitudeMin},
                "coordinates.0" : {$lt : longitudeMax},
                "coordinates.1" : {$gt : latitudeMin},
                "coordinates.1" : {$lt : latitudeMax}}
            }}).explain("executionStats");
    }; 
    const indexName = "favoriteLocals_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}
function local2(databaseName){
    const queryId = "L2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Check if any locals are near a home"; // Fill in to describe what index this query is testing
    const queryDescription = "Get people who have favorite locales within 1 latitude and longitude of the first document's home"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const home = database.find().next().home.coordinates;
    const longitudeMax = home[0] + 1;
    const longitudeMin = home[0] - 1;
    const latitudeMax =  home[1] + 1;
    const latitudeMin =  home[1] - 1;
    const queryFunc = () => {

        return database.find({favoriteLocals : 
            {$elemMatch : 
                {"coordinates.0" : {$gt : longitudeMin},
                "coordinates.0" : {$lt : longitudeMax},
                "coordinates.1" : {$gt : latitudeMin},
                "coordinates.1" : {$lt : latitudeMax}}
            }}).explain("executionStats");
    }; 
    const indexName = "favoriteLocals_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function local3(databaseName){
    const queryId = "L3"; // Change number to a number to use as a brief identifier
    const queryTitle = "Check if any locals are in the northern or western hemispheres"; // Fill in to describe what index this query is testing
    const queryDescription = "Get people who have favorite locales within the western or northern hemispheres"; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);

    const queryFunc = () => {

        return database.find({"favoriteLocals.coordinates.0" : {$lt : 0},
                "favoriteLocals.coordinates.1" : {$gt : 0}
                
            }).explain("executionStats");
    }; 
    const indexName = "favoriteLocals_1";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}
/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the multikey object index for.
 */
function runAllLocalsQueries(databaseName){
    local1(databaseName);
    local2(databaseName);
    local3(databaseName);
}
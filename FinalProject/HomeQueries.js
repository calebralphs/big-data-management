/**
 * Hold the queries to run over the home 2dsphere index for a given collection.
 */
load("QueryTemplate.js");

function home1(databaseName){
    const queryId = "H1"; // Change number to a number to use as a brief identifier
    const queryTitle = "Home in WPI bounds"; // Fill in to describe what index this query is testing
    const queryDescription = "Use the GeoWithin operator to check if the home coordinate is roughly around WPI (box around 41,-72)."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find( { home :
        { $geoWithin :
            { $geometry :
                { type : "Polygon" ,
                    coordinates : [ [
                        [-72, 42] ,
                        [-71, 42] ,
                        [-71, 41] ,
                        [-72, 41] ,
                        [-72, 42]
                        ] ]
                    } } } } ).explain("executionStats");
    const indexName = "home_2dsphere";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function home2(databaseName){
    const queryId = "H2"; // Change number to a number to use as a brief identifier
    const queryTitle = "Home within 100000 meters of East Hall"; // Fill in to describe what index this query is testing
    const queryDescription = "Use the near operator to check if the home coordinate is within 100000 meters of East Hall."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find( { home :
        { $near :
            { $geometry :
                { type : "Point" ,
                    coordinates : [ -71.805353, 42.273922 ] } ,
                    $maxDistance : 100000
                    } } } ).explain("executionStats");
    const indexName = "home_2dsphere";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

function home3(databaseName){
    const queryId = "H3"; // Change number to a number to use as a brief identifier
    const queryTitle = "GeoNear East Hall"; // Fill in to describe what index this query is testing
    const queryDescription = "Use the GeoNear operator to see what home coordinate are near East Hall."; // Fill in to describe in more detail about the
    const database = db.getCollection(databaseName);
    const queryFunc = () => database.find({
        home : {$nearSphere: {
           $geometry: {
              type : "Point",
              coordinates : [ -71.805353, 42.273922 ]
           }
        }}
      }).explain("executionStats");
    const indexName = "home_2dsphere";
    queryRunner(databaseName,queryId, queryTitle, queryDescription, queryFunc, indexName);
}

/**
 * Runs all of the specified queries to experiment on the salary index for the collection with the given name.
 * 
 * @param {String} databaseName The name of the collection to run the queries over the 2dsphere home index for.
 */
function runAllHomeQueries(databaseName){
    home1(databaseName);
    home2(databaseName);
    home3(databaseName);
}
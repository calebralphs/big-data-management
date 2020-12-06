// Create all of the indexes that we want to test in this file.
// Name of each index is listed as part of the comments above the create command.

const databases = ["people1","people10","people50"];
let database;
// _id_
for(let i = 0; i < 3; i++){
    database = db.getCollection(databases[i]);
    
    // Simple - numeric
    // salary_1
    database.createIndex({salary : 1})

    // Compound
    // salary_1_birthday_-1
    database.createIndex({salary : 1, birthday : -1})

    // Do we want a sparse index???? 
    // Would need to add a field that is only present some of the time if we do.

    // GeoJSON - single field
    // home_2dsphere
    database.createIndex({home : "2dsphere"})

    // Hashed
    // name_hashed
    database.createIndex({name : "hashed"})

    // Text - all text
    // $**_text
    database.createIndex({"$**" : "text"})

    // Multikey - text (not sure if this will error)
    // friends_-1
    database.createIndex({friends : -1})

    // Multikey - doc (GeoJSON - not sure if this will error)
    // favoriteLocals_1
    database.createIndex({favoriteLocals : 1})

    // Print storage overhead of indexes
    printjson(database.stats())
}
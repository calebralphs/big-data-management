// Hide all of the indexes that are generated in GenerateIndexes.js.
// _id index cannot be hidden, but probably won't matter.
const databases = ["people1","people10","people50"];
let database;
for(let i = 0; i < 3; i++){
    database = db.getCollection(databases[i]);

    // Simple - numeric
    // salary_1
    database.hideIndex({salary : 1})

    // Compound
    // salary_1_birthday_-1
    database.hideIndex({salary : 1, birthday : -1})

    // Do we want a sparse index???? 
    // Would need to add a field that is only present some of the time if we do.

    // GeoJSON - single field
    // home_2dsphere
    database.hideIndex({home : "2dsphere"})

    // Hashed
    // name_hashed
    database.hideIndex({name : "hashed"})

    // Text - all text
    // $**_text
    database.hideIndex({"$**" : "text"})

    // Multikey - text (not sure if this will error)
    // friends_-1
    database.hideIndex({friends : -1})

    // Multikey - doc (GeoJSON - not sure if this will error)
    // favoriteLocals_1
    database.hideIndex({favoriteLocals : 1})
}
// Create all of the indexes that we want to test in this file.
// Name of each index is listed as part of the comments above the create command.


// _id_

// Simple - numeric
// salary_1
db.people.createIndex({salary : 1})

// Compound
// salary_1_birthday_-1
db.people.createIndex({salary : 1, birthday : -1})

// Do we want a sparse index???? 
// Would need to add a field that is only present some of the time if we do.

// GeoJSON - single field
// home_2dsphere
db.people.createIndex({home : "2dsphere"})

// Hashed
// name_hashed
db.people.createIndex({name : "hashed"})

// Text - all text
// $**_text
db.people.createIndex({"$**" : "text"})

// Multikey - text (not sure if this will error)
// friends_-1
db.people.createIndex({friends : -1})

// Multikey - doc (GeoJSON - not sure if this will error)
// favoriteLocals_1
db.people.createIndex({favoriteLocals : 1})

// Print storage overhead of indexes
printjson(db.people.stats())
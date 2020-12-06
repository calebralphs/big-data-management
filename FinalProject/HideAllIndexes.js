// Hide all of the indexes that are generated in GenerateIndexes.js.
// _id index cannot be hidden, but probably won't matter.

// Simple - numeric
// salary_1
db.people.hideIndex({salary : 1})

// Compound
// salary_1_birthday_-1
db.people.hideIndex({salary : 1, birthday : -1})

// Do we want a sparse index???? 
// Would need to add a field that is only present some of the time if we do.

// GeoJSON - single field
// home_2dsphere
db.people.hideIndex({home : "2dsphere"})

// Hashed
// name_hashed
db.people.hideIndex({name : "hashed"})

// Text - all text
// $**_text
db.people.hideIndex({"$**" : "text"})

// Multikey - text (not sure if this will error)
// friends_-1
db.people.hideIndex({friends : -1})

// Multikey - doc (GeoJSON - not sure if this will error)
// favoriteLocals_1
db.people.hideIndex({favoriteLocals : 1})
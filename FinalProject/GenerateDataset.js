function generateNames(num = 100, nameLength=5) {
    let names = [];
    var i;
    for (i=0; i<num; i++) {
        names.push(Math.random().toString(36).substr(2, nameLength+2));
    }
    return names;
}

function generateFriends(myName, names) {
    let friends = [];
    let numFriends = parseInt(Math.random() * 5);
    var i;
    for (i=0; i<numFriends; i++) {
        let friendName = names[parseInt(Math.random()*names.length)];
        while (friendName === myName) {
            friendName = names[parseInt(Math.random()*names.length)];
        }
        friends.push(friendName);
    }
    return friends;
}

function generateDate() {
    let year = parseInt(Math.random()*21) + 2000;
    let month = parseInt(Math.random()*12) + 1;
    let day = parseInt(Math.random()*30) + 1;
    return {
        year: year,
        month: month,
        day: day
    };
}

function generateLocations(maxNum=3) {
    locations = []
    var i;
    for (i=0; i<maxNum; i++) {
        locations.push({
            type: "Point",
            coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90]
        });
    }
    return locations;
}

function generateAndInsertEntries(names, numEntries, databaseName, idLength = 10, nameLength = 5) {
    let entries = [];
    var i;
    var database = db.getCollection(databaseName);
    for (i=0; i<numEntries; i++) {
        let id = Math.random().toString().substr(2, idLength+2);
        let name = Math.random().toString(36).substr(2, nameLength+2);
        let home = generateLocations(1)[0];
        let salary = parseInt(Math.random() * 100000);
        let birthday = generateDate();
        let friends = generateFriends(name, names);
        let favoriteLocals = generateLocations();
        entries.push({
            name: name,
            home: home,
            salary: salary,
            birthday: birthday,
            friends: friends,
            favoriteLocals: favoriteLocals
        });
        if (i % 99999 === 0){ // If limit reached for insertMany, then bulk insert, clear entries, and print status
            print(i + ": Adding " + entries.length + " entries to " + databaseName + "- " + (100 * (i/numEntries)) + "% done");
            database.insertMany(entries);
            entries = [];
        }
    }
    print(i + ": Adding " + entries.length + " entries to " + databaseName);
    database.insertMany(entries);
    entries = [];
}
var sizes = [1000000, 10000000, 250000];
var databases = ["people1","people10","people250k"];
var names, entries, database;
for(let i = 2; i < 3; i++){
    print("Generating " + databases[i]);
    names = generateNames();
    database = db.getCollection(databases[i]);
    database.drop()
    generateAndInsertEntries(names, sizes[i], databases[i]);
}


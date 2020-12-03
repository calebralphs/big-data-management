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
            coordinates: [Math.random() * 360 - 180, Math.random() * 360 - 180]
        });
    }
    return locations;
}

function generateEntries(names, numEntries, idLength = 10, nameLength = 5) {
    let entries = [];
    var i;
    for (i=0; i<numEntries; i++) {
        let id = Math.random().toString().substr(2, idLength+2);
        let name = Math.random().toString(36).substr(2, nameLength+2);
        let home = generateLocations(1)[0];
        let salary = parseInt(Math.random() * 100000);
        let birthday = generateDate();
        let friends = generateFriends(name, names);
        let favoriteLocals = generateLocations();
        entries.push({
            _id: id,
            name: name,
            home: home,
            salary: salary,
            birthday: birthday,
            friends: friends,
            favoriteLocals: favoriteLocals
        });
    }
    return entries;
}

let names = generateNames();
let entries = generateEntries(names, 100000);

db.people.insertMany(entries);

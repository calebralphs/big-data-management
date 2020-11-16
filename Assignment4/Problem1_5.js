var contributions = db.test.findOne(
    {
        "name.first" : "Alex",
        "name.last" : "Chen"
    }
).contribs

for(var contrib of contributions){
    var result = {contribution : contrib}
    var names = []
    var nameCursor = db.test.find({
        "contribs" : contrib
    })
    while(nameCursor.hasNext()){
        names.push(nameCursor.next().name)
    }
    result["People"] = names
    printjson(result)
}
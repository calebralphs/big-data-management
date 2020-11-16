var result = db.test.aggregate([
    {$group : {_id : {$year : "$birth"}, ids : {$addToSet : "$_id"}}}
])
while(result.hasNext()){
    printjson(result.next())
}
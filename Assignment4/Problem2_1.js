var result = db.test.aggregate([
    {$unwind : "$awards"},
    {$group : {_id : "$awards.award", count : {$sum : 1}}}
])
while(result.hasNext()){
    printjson(result.next())
}
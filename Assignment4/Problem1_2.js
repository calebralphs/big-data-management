var results = db.test.find({$or : [
    {awards : {$size : 2}},
    {awards : {$size : 1}},
    {awards : {$size : 0}},
    {contribs : "FP"}
]})
while(results.hasNext()){
    printjson(results.next())
}
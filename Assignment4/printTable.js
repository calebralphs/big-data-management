var result = db.test.find()
while(result.hasNext()){
    printjson(result.next())
}
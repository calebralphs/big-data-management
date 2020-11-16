function height(parentName){
    var children = [0]
    var cursor = db.book.find({parent : parentName})
    while(cursor.hasNext()){
        children.push(height(cursor.next()._id))
    }
    return 1 + Math.max(...children)
}
print(height("Books"))
var currentParent = db.book.findOne({_id : "MongoDB"}).parent
var level = 1
var ancestors = []
while(currentParent != null){
    ancestors.push({Name : currentParent, Level : level})
    currentParent = db.book.findOne({_id : currentParent}).parent
    level++
}
printjson(ancestors)
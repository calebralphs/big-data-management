db.bookc.insertMany([
    {_id : "Books", children : ["Programming"]},
    {_id : "Programming", children : ["Languages", "Databases"]},
    {_id : "Languages", children : []},
    {_id : "Databases", children : ["MongoDB", "dbm"]},
    {_id : "MongoDB", children : []},
    {_id : "dbm", children : []},
])
db.book.insertMany([
    {_id : "Books", parent : null},
    {_id : "Programming", parent : "Books"},
    {_id : "Languages", parent : "Programming"},
    {_id : "Databases", parent : "Programming"},
    {_id : "MongoDB", parent : "Databases"},
    {_id : "dbm", parent : "Databases"},
])
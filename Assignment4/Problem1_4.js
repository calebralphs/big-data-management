db.test.update(
    {"name.first" : "Alex", "name.last" : "Chen"},
    {$set : {comments : ["He taught in 3 universities", "died from cancer", "lived in CA"]}}
)
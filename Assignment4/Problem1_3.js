db.test.update(
    {"name.first" : "Guido", "name.last" : "van Rossum"},
    {$push : {contribs : "OOP"}}
)
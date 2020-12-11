Project 5: MongoDB Indexes
Team 12 Members: Jackson Powell and Caleb Ralphs

Source code written in JavaScript and run on a MongoDB 4.4 instance on a local Windows10 machine.
To start mongo and mongod on windows, run the mongod.exe and mongo.exe that may be found in "C:\Program Files\MongoDB\Server\4.4\bin"

To run the code, there are two main entry points.
These entry points should be accessed from the mongo shell by first starting mongod and then running mongo in the directory containing the source code.
Once the shell is running, the two entry points are accessed through the commands:
    1. load("Generator.js")
    2. load("Experiment.js")

The first entry point generates the three collections people1, people10, and people250k of 1 million, 10 million, and 250 thousand documents respectively.
As the collections are being generated, a status will show the progress towards completion of inserting the rest of that collection.
Once the collections are generated, then the 7 indexes are created and then hidden,. 
After the indexes are created, the program outputs result of calling db.collection.stats() on each collection where the storage overhead of the indexes can be seen in the indexSizes field.

The second entry point runs the experiment over the 7 indexes and 3 collections created using the first entry point.
The experiment is grouped such that one collection is tested at a time and one index within that collection is tested at a time.
When the experiment starts a collection, an indicator of this is printed to the shell.
Within each collection experiment, the output describes the result of each query experiment on the collection.
For each query the output includes the query id (referenced in the report), a brief description of what is tested, and the performance of the query when the index is available and when it is not available.
An example of most of the output included in the report can be seen in output.txt.

Due to these entry points being in the Mongo shell and not an interface that we created, screenshots of these commands were not included in the report.
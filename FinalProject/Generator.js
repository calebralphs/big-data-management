// Generate and hide the indexes for the three collections.
// Possibly regenerate the three collections if shouldGenerateCollection

var shouldGenerateCollections = true;
if (shouldGenerateCollections){
    load("GenerateDataset.js");
}
load("GenerateIndexes.js");
load("HideAllIndexes.js");
var databases = ["people1","people10","people50"];

for(let i = 0; i < 3; i++){
    generateIndexes(databases[i]);
    hideAllIndexes(databases[i]);
}
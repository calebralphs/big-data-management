customers = LOAD 'Customers.txt' USING PigStorage(',') AS (id, name, age, gender, countryCode, salary);

cleanCust = FOREACH customers GENERATE id, countryCode;

code_groups = GROUP cleanCust BY (countryCode);

code_counts = FOREACH code_groups GENERATE group, COUNT(cleanCust);

filtered_counts = filter code_counts by $1 > 5000 or $1 < 2000;

STORE filtered_counts INTO 'QueryFour_Three_Output.txt' USING PigStorage(',');
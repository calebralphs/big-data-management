customers = LOAD 'Customers.txt' USING PigStorage(',') AS (id, name, age : int, gender, countryCode, salary);
transactions = LOAD 'Transactions.txt' USING PigStorage(',') AS (transId, custId, transTotal, transNumItems, transDesc);

cleanCust = FOREACH customers GENERATE id, (age - (age%10)) as age, gender;
cleanCust2 = FOREACH cleanCust GENERATE id, ((age == 70) ? age - 10 : age)  as age, gender;
cleanCust3 = FOREACH cleanCust2 GENERATE id, CONCAT('[', CONCAT((chararray) age, ',', CONCAT((chararray)(age + 10),((age == 60) ? ']' : ')')))) as age, gender;

cleanTrans = FOREACH transactions GENERATE custId, transTotal;
joined = join cleanCust3 by id, cleanTrans by custId;

age_groups = GROUP joined BY (age, gender);
age_stats = FOREACH age_groups GENERATE group, MIN(joined.transTotal), MAX(joined.transTotal), AVG(joined.transTotal);
STORE age_stats INTO 'QueryFour_Four_Result.txt' USING PigStorage(',');
transactions = LOAD 'Transactions.txt' USING PigStorage(',') AS (TransID, CustID, TransTotal, TransNumItems, TransDesc);
customers = LOAD 'Customers.txt' USING PigStorage(',') AS (CustID, Name, Age, Gender, CountryCode, Salary);

customersGenerated = FOREACH customers GENERATE CustID, Name, Salary;
transactionsGenerated = FOREACH transactions GENERATE CustID, TransTotal, TransNumItems;

transactionsGrouped = GROUP transactionsGenerated BY CustID;

transactionsProcessed = FOREACH transactionsGrouped GENERATE group, COUNT(transactionsGenerated) as NumOfTransactions, SUM(transactionsGenerated.TransTotal) as TotalSum, MIN(transactionsGenerated.TransNumItems) as MinimumItems;

joinedCustomersAndTransactions = JOIN transactionsProcessed BY group, customersGenerated BY CustID USING 'replicated';

outputGenerated = FOREACH joinedCustomersAndTransactions GENERATE transactionsProcessed::group, customersGenerated::Name, customersGenerated::Salary, transactionsProcessed::NumOfTransactions, transactionsProcessed::TotalSum, transactionsProcessed::MinimumItems;

store outputGenerated into 'PigQuery2';
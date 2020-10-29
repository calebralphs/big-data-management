
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types._;

object problem1 {
  def main(args: Array[String]) {
    
    // create spark session
    val sparkSession = SparkSession
      .builder()
      .appName("Problem 1")
		  .master("local[*]")
		  .getOrCreate();
    
    // create schema for dataframe corresponding to Transactions
    val schema = StructType(
			Array(
				StructField("TransID", IntegerType, nullable = true),
				StructField("CustID", IntegerType, nullable = true),
				StructField("TransTotal", FloatType, nullable = true),
				StructField("TransNumItems", IntegerType, nullable = true),
				StructField("TransDesc", StringType, nullable = true)
			)
		);
    
    // create dataframe from Transactions.txt
    val dataframe = sparkSession.read
      .option("header", "false")
      .option("delimeter", ",")
      .schema(schema)
      .csv("data/Transactions.txt");
    
    
    // print schema to ensure it was created correctly
    dataframe.printSchema();
		
		dataframe.createOrReplaceTempView("T");
		
		// T1: Filter	out (drop) the	transactions from T whose	total	amount is less than $200.
		val T1 = sparkSession.sql("SELECT * FROM T WHERE TransTotal >= 200");
		T1.createOrReplaceTempView("T1");
		
		// T2: Over T1,	group	the	transactions by the	Number of Items	it has, and for	each group calculate	the sum	of total amounts, the average	of total amounts,	the	min	and	the	max	of the total amounts.
		//     Report	back	T2	to	the	client	side.
		val T2 = sparkSession.sql("SELECT TransNumItems, sum(TransTotal), avg(TransTotal), min(TransTotal), max(TransTotal) FROM T1 GROUP BY TransNumItems ORDER BY TransNumItems");
		T2.show();
		
		// T3: Over T1,	group	the	transactions by customer	ID,	and	for	each group report the customer ID, and the transactions' count.
		val T3 = sparkSession.sql("SELECT CustID, count(*) AS cnt FROM T1 GROUP BY CustID");
		T3.createOrReplaceTempView("T3");
		
		// T4: Filter out (drop) the transactions from T whose total amount is less than $600.
		val T4 = sparkSession.sql("SELECT * FROM T WHERE TransTotal >= 600");
		T4.createOrReplaceTempView("T4");
		
		// T5: Over T4, group the transactions by customer ID, and for each group report the customer ID, and transactions' count.
		val T5 = sparkSession.sql("SELECT CustID, count(*) AS cnt FROM T4 GROUP BY CustID");
		T5.createOrReplaceTempView("T5");
		
		// T6: Select the customer IDs whose T5.count * 5 < T3.count.
		//     Report back T6 to the client side.
		val T6 = sparkSession.sql("SELECT T5.CustID FROM T5 INNER JOIN T3 ON T3.CustID = T5.CustID WHERE T5.cnt * 5 < T3.cnt");
		T6.show();
		
  }
}
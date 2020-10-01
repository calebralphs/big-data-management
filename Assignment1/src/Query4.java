import org.apache.hadoop.conf.*;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.net.URI;

public class Query4 {
	
	public static class CountryMapper extends Mapper<Object, Text, Text, FloatWritable>{
    	
        private HashMap<Integer, Integer> customerCountryMapper = new HashMap<Integer,Integer>();

	    public void setup(Context context) throws IOException{
	    	String[] splitLine;
	    	URI[] uris = (context).getCacheFiles();
			
	    	FSDataInputStream customerData = FileSystem.get((context).getConfiguration()).open(new Path(uris[0]));
	    	BufferedReader bufferReader = new BufferedReader(new InputStreamReader(customerData));
	    	String line = bufferReader.readLine();
	    	while (line != null){
	    		splitLine = line.split(",");
	            int customerID = Integer.parseInt(splitLine[0].trim());
	            int countryCode = Integer.parseInt(splitLine[4].trim());
	            customerCountryMapper.put(customerID, countryCode);
	    		line = bufferReader.readLine();
	    	}
	    }
	    
        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
        	Text outputValue = new Text();
        	FloatWritable trans = new FloatWritable();
        	String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[1].trim());
            String transTotal = splitLine[2];
            int countryCode = customerCountryMapper.get(customerID);
            trans.set(Float.parseFloat(transTotal.trim()));
            outputValue.set(countryCode+"");
            context.write(outputValue, trans);
        }
    }
	
    public static class TransactionReducer extends Reducer<Text, FloatWritable, Text, Text>{
        public void reduce(Text key, Iterable<FloatWritable> values, Context context) throws IOException, InterruptedException {
            int count = 0;
            float transMin = 1001;
            float transMax = 9;
            for (FloatWritable value : values) {
            	count++;
            	float trans = value.get();
                if (trans < transMin) {
                	transMin = trans;
                }
                else if (trans > transMax) {
                	transMax = trans;
                }
            }
            Text outputValue = new Text();
            outputValue.set(", " + count + ", " + transMin + ", " + transMax);
            context.write(key, outputValue);
        }
    }
    public static void main(String[] args) throws Exception {
        if (args.length != 3){
            System.out.println("Error: The program should be given 3 arguments for the files in order of <customer_input> <transaction_input> <output>");
            System.exit(1);
        }
        String customerInputPath = args[0];
        String transactionInputPath = args[1];
        String outputPath = args[2];

        Job job = Job.getInstance(new Configuration(), "query4");
        job.setJarByClass(Query4.class);
        job.addCacheFile(new Path(customerInputPath).toUri());
        
        job.setMapOutputKeyClass(Text.class);
		job.setMapOutputValueClass(FloatWritable.class); 
		job.setMapperClass(Query4.CountryMapper.class);
		job.setReducerClass(Query4.TransactionReducer.class);                        
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);
		
		FileInputFormat.addInputPath(job, new Path(transactionInputPath));
		FileOutputFormat.setOutputPath(job, new Path(outputPath));

		job.waitForCompletion(true);
    }
}
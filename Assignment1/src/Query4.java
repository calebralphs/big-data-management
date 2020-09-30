import org.apache.hadoop.conf.*;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.mapred.*;
import org.apache.hadoop.mapred.lib.*;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.util.*;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Iterator;
import java.util.StringTokenizer;
import java.net.URI;

public class Query4 {
	// key, One transTotal
	// 0    1   2
	
	public static class TransactionMap extends Mapper<Object, Text, Text, FloatWritable>{
    	
        private Text outputValue = new Text();
        private HashMap<Integer, Integer> customerCountryMapper = new HashMap<Integer,Integer>();

	    public void setup(JobContext context) throws IOException{
	    	String[] splitLine;
	    	Configuration conf = (context).getConfiguration();
	    	URI[] uris = (context).getCacheFiles();
			
	    	FSDataInputStream data = FileSystem.get((context).getConfiguration()).open(new Path(uris[0]));
	    	BufferedReader values = new BufferedReader(new InputStreamReader(data));
	    	String line = values.readLine();
	    	while (line != null){
	    		splitLine = line.split(",");
	            int customerID = Integer.parseInt(splitLine[0].trim());
	            int countryCode = Integer.parseInt(splitLine[4].trim());
	            customerCountryMapper.put(customerID, countryCode);
	    		line = values.readLine();
	    	}
	    }
	    
        public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[1].trim());
            String transTotal = splitLine[2];
            int countryCode = customerCountryMapper.get(customerID);
            System.out.println("\n\n transTotal" + transTotal + "\n countryCode" + countryCode + "\n\n");
            outputValue.set(transTotal);
            output.collect((new IntWritable(countryCode)), outputValue);
        }
    }
    public static class Reduce extends Reducer<Text, FloatWritable, Text, Text>{
        public void reduce(IntWritable key, Iterator<Text> values, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            int count = 0;
            float transMin = 1001;
            float transMax = 9;
            while (values.hasNext()) {
            	count++;
                float trans = Float.parseFloat(values.next().toString());
                if (trans < transMin) {
                	transMin = trans;
                }
                else if (trans > transMax) {
                	transMax = trans;
                }
            }
            Text outputValue = new Text();
            outputValue.set(", " + count + ", " + transMin + ", " + transMax);
            output.collect(key,outputValue);
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
        
        job.setMapOutputKeyClass(LongWritable.class);
		job.setMapOutputValueClass(Text.class); 
		job.setMapperClass(TransactionMap.class);
		job.setReducerClass(Reduce.class);                        
		job.setOutputKeyClass(IntWritable.class);
		job.setOutputValueClass(Text.class);
		
		FileInputFormat.addInputPath(job, new Path(transactionInputPath));
		FileOutputFormat.setOutputPath(job, new Path(outputPath));

		job.waitForCompletion(true);
    }
}
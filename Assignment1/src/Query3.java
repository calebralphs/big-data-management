import org.apache.hadoop.conf.*;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapred.*;
import org.apache.hadoop.mapred.lib.MultipleInputs;
import org.apache.hadoop.util.*;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.StringTokenizer;

public class Query3 {
	// key, customerName, numTrans, transTotal, transNumItems
 	// 0    1             2         3           4
    public static class CustomerMap extends MapReduceBase implements Mapper<LongWritable, Text, IntWritable, Text> {

        private Text outputValue = new Text();
        public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[0].trim());
            String customerName = splitLine[1];
            outputValue.set("," + customerName + ",0,0,0");
            output.collect(new IntWritable(customerID), outputValue);
        }
    }
    public static class TransactionMap extends MapReduceBase implements Mapper<LongWritable, Text, IntWritable, Text> {

        private final static IntWritable one = new IntWritable(1);
        private Text outputValue = new Text();
        public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[1].trim());
            String transTotal = splitLine[2];
            String transNumItems = splitLine[3];
            outputValue.set(",,1," + transTotal + "," + transNumItems);
            output.collect((new IntWritable(customerID)), outputValue);
        }
    }
    public static class Reduce extends MapReduceBase implements Reducer<IntWritable, Text, IntWritable, Text> {
    	private Text outputValue = new Text();
    	public void reduce(IntWritable key, Iterator<Text> values, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            float sum = 0;
            int count = 0;
            String name = "";
            int minItems = 11;
            while (values.hasNext()) {
                String[] input = values.next().toString().split(",");
                sum += Float.parseFloat(input[3].trim());
                count += Integer.parseInt(input[2].trim());
                int numItems = Integer.parseInt(input[4].trim());
                if (numItems < minItems && numItems > 0) {
                	minItems = numItems;
                }
                if(name.length() < 10){
                    name = input[1].trim();
                }
            }
            if (minItems == 11) {
            	minItems = 0;
            }
            Text outputValue = new Text();
            outputValue.set("," + name + ", " + count + ", " + sum + ", " + minItems);
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

        JobConf conf = new JobConf(Query3.class);
        conf.setJobName("query3");
        conf.setOutputKeyClass(IntWritable.class);
        conf.setOutputValueClass(Text.class);

        MultipleInputs.addInputPath(conf, new Path(customerInputPath),TextInputFormat.class, Query3.CustomerMap.class);
        MultipleInputs.addInputPath(conf, new Path(transactionInputPath),TextInputFormat.class, Query3.TransactionMap.class);
        conf.setCombinerClass(Query3.Reduce.class);
        conf.setReducerClass(Query3.Reduce.class);

        conf.setOutputFormat(TextOutputFormat.class);

        FileInputFormat.setInputPaths(conf, new Path(customerInputPath), new Path(transactionInputPath));
        FileOutputFormat.setOutputPath(conf, new Path(outputPath));

        JobClient.runJob(conf);
    }
}
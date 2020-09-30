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

public class QueryThree_One {
    public static class CustomerMap extends MapReduceBase implements Mapper<LongWritable, Text, IntWritable, Text> {

        private Text outputValue = new Text();
        public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[0].strip());
            String customerName = splitLine[1];
            outputValue.set("," + customerName + ",0,0");
            output.collect(new IntWritable(customerID), outputValue);
        }
    }
    public static class TransactionMap extends MapReduceBase implements Mapper<LongWritable, Text, IntWritable, Text> {

        private final static IntWritable one = new IntWritable(1);
        private Text outputKey = new Text();
        private Text outputValue = new Text();
        public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[1].strip());
            String transTotal = splitLine[2];
            outputValue.set(",,1," + transTotal);
            output.collect((new IntWritable(customerID)), outputValue);
        }
    }
    public static class Reduce extends MapReduceBase implements Reducer<IntWritable, Text, IntWritable, Text> {
        public void reduce(IntWritable key, Iterator<Text> values, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            float sum = 0;
            int count = 0;
            String name = "";
            while (values.hasNext()) {
                String[] input = values.next().toString().split(",");
                sum += Float.parseFloat(input[3].strip());
                count += Integer.parseInt(input[2].strip());
                if(name == ""){
                    name = input[1].strip();
                }
            }
            Text outputValue = new Text();
            outputValue.set("," + name + ", " + count + ", " + sum);
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

        JobConf conf = new JobConf(QueryThree_One.class);
        conf.setJobName("query3_1");
        conf.setOutputKeyClass(IntWritable.class);
        conf.setOutputValueClass(Text.class);

        //conf.setMapperClass(CustomerMap.class);
        MultipleInputs.addInputPath(conf, new Path(customerInputPath),TextInputFormat.class, QueryThree_One.CustomerMap.class);
        MultipleInputs.addInputPath(conf, new Path(transactionInputPath),TextInputFormat.class, QueryThree_One.TransactionMap.class);
        conf.setCombinerClass(QueryThree_One.Reduce.class);
        conf.setReducerClass(QueryThree_One.Reduce.class);

//        conf.setInputFormat(TextInputFormat.class);
        conf.setOutputFormat(TextOutputFormat.class);

        FileInputFormat.setInputPaths(conf, new Path(customerInputPath), new Path(transactionInputPath));
        FileOutputFormat.setOutputPath(conf, new Path(outputPath));

        JobClient.runJob(conf);
    }
}
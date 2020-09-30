import org.apache.hadoop.fs.Path;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.*;
import org.apache.hadoop.mapred.lib.MultipleInputs;

import java.io.IOException;
import java.util.Iterator;

public class QueryThree_Four {
    public static class CustomerMap extends MapReduceBase implements Mapper<LongWritable, Text, IntWritable, Text> {
        private Text outputKey = new Text();
        private Text outputValue = new Text();
        public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[0].strip());
            String age = splitLine[2];
            String gender = splitLine[3];
            outputValue.set("C," + age + "," + gender);
            output.collect(new IntWritable(customerID), outputValue);
        }
    }
    public static class TransactionMap extends MapReduceBase implements Mapper<LongWritable, Text, IntWritable, Text> {
        public void map(LongWritable key, Text value, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int customerID = Integer.parseInt(splitLine[1].strip());
            String transTotal = splitLine[2].strip();
            Text outputValue = new Text("T," + transTotal);
            output.collect(new IntWritable(customerID), outputValue);
        }
    }
    public static class JoinReduce extends MapReduceBase implements Reducer<IntWritable, Text, IntWritable, Text> {
        public void reduce(IntWritable key, Iterator<Text> values, OutputCollector<IntWritable, Text> output, Reporter reporter) throws IOException {
            double sum = 0;
            double max = Double.MIN_VALUE;
            double min = Double.MAX_VALUE;
            int count = 0;
            String age = "";
            String gender = "";
            while (values.hasNext()) {
                String[] input = values.next().toString().split(",");
                String tag = input[0].strip();
                if (tag.equals("C")){
                    age = input[1];
                    gender = input[2];
                }
                else{
                    count += 1;
                    double value = Double.parseDouble(input[1].strip());
                    sum += value;
                    max = Double.max(max, value);
                    min = Double.min(min, value);
                }
            }
            Text outputValue = new Text();
            outputValue.set(age + "," + gender + "," + count + "," + sum + "," + max + "," + min);
            output.collect(null,outputValue);
        }
    }
    public static class Map extends MapReduceBase implements Mapper<LongWritable, Text, Text, Text> {
        public void map(LongWritable key, Text value, OutputCollector<Text, Text> output, Reporter reporter) throws IOException {
            String line = value.toString();
            String[] splitLine = line.split(",");
            int age = Integer.parseInt(splitLine[0].strip());
            int lowerBound = age - (age % 10);
            String ageGroup;
            if (lowerBound >= 60){
                lowerBound = 60;
                ageGroup = "[" + lowerBound + ", " + (lowerBound + 10) + "]";
            }
            else{
                ageGroup = "[" + lowerBound + ", " + (lowerBound + 10) + ")";
            }
            String gender = splitLine[1];
            String count = splitLine[2];
            String sum = splitLine[3];
            String max = splitLine[4];
            String min = splitLine[5];
            Text outputValue = new Text(count + "," + sum + "," + max + "," + min);
            output.collect(new Text(ageGroup + "," + gender), outputValue);
        }
    }
    public static class Reduce extends MapReduceBase implements Reducer<Text, Text, Text, Text> {
        public void reduce(Text key, Iterator<Text> values, OutputCollector<Text, Text> output, Reporter reporter) throws IOException {
            double sum = 0;
            int count = 0;
            double max = Double.MIN_VALUE;
            double min = Double.MAX_VALUE;
            while (values.hasNext()) {
                String[] input = values.next().toString().split(",");
                count += Double.parseDouble(input[0].strip());
                sum += Double.parseDouble(input[1].strip());
                max = Double.max(max, Double.parseDouble(input[2].strip()));
                min = Double.min(min, Double.parseDouble(input[3].strip()));
            }
            Text outputValue = new Text();
            outputValue.set(key.toString() + "," + min + "," + max + "," + (sum/count));
            output.collect(null,outputValue);
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
        String intermediatePath = outputPath + "intermediate";
        outputPath = outputPath + "result";

        // Join
        JobConf conf = new JobConf(QueryThree_Four.class);
        conf.setJobName("query3_4join");
        conf.setOutputKeyClass(IntWritable.class);
        conf.setOutputValueClass(Text.class);

        //conf.setMapperClass(CustomerMap.class);
        MultipleInputs.addInputPath(conf, new Path(customerInputPath),TextInputFormat.class, QueryThree_Four.CustomerMap.class);
        MultipleInputs.addInputPath(conf, new Path(transactionInputPath),TextInputFormat.class, QueryThree_Four.TransactionMap.class);
        conf.setReducerClass(QueryThree_Four.JoinReduce.class);

//        conf.setInputFormat(TextInputFormat.class);
        conf.setOutputFormat(TextOutputFormat.class);

        FileInputFormat.setInputPaths(conf, new Path(customerInputPath), new Path(transactionInputPath));
        FileOutputFormat.setOutputPath(conf, new Path(intermediatePath));
        JobClient.runJob(conf).waitForCompletion();

        // Aggregate
        JobConf conf2 = new JobConf(QueryThree_Four.class);
        conf2.setJobName("query3_4");
        conf2.setOutputKeyClass(Text.class);
        conf2.setOutputValueClass(Text.class);

        conf2.setMapperClass(QueryThree_Four.Map.class);
        conf2.setReducerClass(QueryThree_Four.Reduce.class);

        conf2.setInputFormat(TextInputFormat.class);
        conf2.setOutputFormat(TextOutputFormat.class);

        FileInputFormat.setInputPaths(conf2, new Path(intermediatePath));
        FileOutputFormat.setOutputPath(conf2, new Path(outputPath));
        JobClient.runJob(conf2);

    }
}
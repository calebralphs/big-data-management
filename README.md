# big-data-management
WPI DS 503 Big Data Management

Team members: Caleb Ralphs and Jackson Powell

# Project 1
## Division of work
* Dataset creation - Caleb
* Data upload - Jackson
* 3.1 - Jackson
* 3.2 - Caleb
* 3.3 - Caleb
* 3.4 - Jackson
* 4.1 - Caleb
* 4.2 - Caleb
* 4.3 - Jackson
* 4.4 - Jackson

## Dataset creation
The code for the dataset creation is labeled as DataCreator.java

## Data upload
To upload data to hdfs, the following steps must be taken:
1. Run the start-dfs command from the sbin directory of the Hadoop installation.
1. Create the directory for the input using the command "hdfs dfs -mkdir /user/Project1/data/"
1. Put the customer data in this directory using the command "hdfs dfs -put <path_to_input>/customers.txt /user/Project1/data/" where <path_to_input> is the path to the input file on the local machine.
1. Put the transaction data in this directory using the command "hdfs dfs -put <path_to_input>/transactions.txt /user/Project1/data/" where <path_to_input> is the path to the input file on the local machine.

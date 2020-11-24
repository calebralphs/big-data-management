# big-data-management
WPI DS 503 Big Data Management

Team members: Caleb Ralphs and Jackson Powell

# Final Project
[Presentation](https://docs.google.com/presentation/d/1qz7GlayDgaJBpOZFAaCfGK858vEbPW6C7eO866k40kw/edit?usp=sharing) 

[Paper](https://docs.google.com/document/d/1vigP7jlxrpCSu3ADKbJaTJlrNLefXP8C0SIwiTMrMb0/edit?usp=sharing). Can also do this in overleaf or something else instead if that would be better

[Outline](https://docs.google.com/document/d/1gh4-yBkiSWmnHB__ZdmGeDF7NMSrPK1gdvJ_YZwRUmc/edit?usp=sharing)

Let me know if you want access to other things in the [drive](https://drive.google.com/drive/folders/1skuhBvxhfQCyphL1EggmJORauooZ0tLF?usp=sharing) and how to add you.


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

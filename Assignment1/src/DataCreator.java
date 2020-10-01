import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

public class DataCreator {
	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private static int seed = 42; // change the seed to get different data
    private static Random generator = new Random(seed);
    
    public static double generateRandomNumber(int min, int max, int plus) {
        return (generator.nextDouble()*(max-min+plus))+min;
    }

    public static String generateRandomString(int min, int max) {
        StringBuilder name = new StringBuilder();
        int count = (int) generateRandomNumber(min, max, 1);
        while (count > 0) {
            int characterIndex = (int) (generator.nextDouble()*CHARACTERS.length());
            name.append(CHARACTERS.charAt(characterIndex));
            count--;
        }
        return name.toString();
    }

    public static String generateRandomGender() {
    	if (generator.nextDouble()*2 < 1) { return "female"; }
    	else { return "male"; }
    }
    
    public static void main(String[] args) {
    	int customerLines = 50000;
    	int transactionsLines = 5000000;
    	String customerFileName = "Customers.txt";
    	String transactionsFileName = "Transactions.txt";
    	String dataRoute = "./data/";
        try {
        	// create file and writer objects
            File customersFile = new File(dataRoute+customerFileName);
            PrintWriter customerWriter = new PrintWriter(dataRoute+customerFileName, "UTF-8");
            File transactionsFile = new File(dataRoute+transactionsFileName,"UTF-8");
            PrintWriter transactiosnWriter = new PrintWriter(dataRoute+transactionsFileName, "UTF-8");
            // checking file creation
            if (!customersFile.createNewFile()) { System.out.println("New File created: "+customersFile.getName()+"."); } 
            else { System.out.println("No file created: "+customersFile.getName()+" already exists."); }
            if (!customersFile.createNewFile()) { System.out.println("New File created: "+transactionsFile.getName()+"."); } 
            else { System.out.println("No file created: "+transactionsFile.getName()+" already exists."); }
            // generate the random attributes for a customer
            for (int i=1; i<=customerLines; i++) {
                String name = generateRandomString(10, 20);
                int age = (int) generateRandomNumber(10, 70, 1);
                String gender = generateRandomGender();
                int countryCode = (int) generateRandomNumber(1, 10, 1);
                float salary = (float) generateRandomNumber(100, 100000, 0);
                // ID, Name, Age, Gender, CountryCode, Salary
                customerWriter.println(i + "," + name + "," + age + "," + gender + "," + countryCode + "," + salary);
            }
            customerWriter.close();
            // generate the random attributes for a transaction
            for (int i=1; i<=transactionsLines; i++) {
                int custID = (int) generateRandomNumber(1, 50000, 1);
                float transTotal = (float) generateRandomNumber(10, 1000, 0);
                int transNumItems = (int) generateRandomNumber(1, 10, 1);
                String transDesc = generateRandomString(20, 50);
                // TransID, CustID, TransTotal, TransNumItems, TransDesc
                transactiosnWriter.println(i + "," + custID + "," + transTotal + "," + transNumItems + "," + transDesc);
            }
            transactiosnWriter.close();
        }
        catch (IOException err) {
            System.out.println("Error generating data.");
            err.printStackTrace();
        }
    }
}
package Problem1;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Random;

public class DataCreator {

    private Random randomGenerator = new Random(1);

    public int randomIntBetween(int min, int max){
        return randomGenerator.nextInt(max-min+1) + min;
    }

    public static void main(String[] args) {
    	DataCreator dataGenerator = new DataCreator();
        try {
        	int minX = 1, minY = 1, minHeight = 1, minWidth = 1;
        	int maxX = 10000, maxY = 10000;
        	int maxHeight = 20, maxWidth = 20;
        	int sizeP = 10000000;
        	int sizeR = 5000000;
        	String pathToData = "data/";
        	
            // create points data
        	PrintWriter writerP = new PrintWriter(pathToData + "P.txt", "UTF-8");
            for(int i = 0; i < sizeP; i++){
                int x = dataGenerator.randomIntBetween(minX, maxX);
                int y = dataGenerator.randomIntBetween(minY, maxY);
                String point = "" + x + "," + y;
                writerP.println(point);
            }
            writerP.close();

            // create rectangles data
            PrintWriter writerR = new PrintWriter(pathToData + "R.txt", "UTF-8");
            for(int i = 0; i < sizeR; i++){
            	int height = dataGenerator.randomIntBetween(minHeight, maxHeight);
                int width = dataGenerator.randomIntBetween(minWidth, maxWidth);
                int bottomLeftX = dataGenerator.randomIntBetween(minX, maxX-height);	// subtracts height so rectangle does not exceed bounds
                int bottomLeftY = dataGenerator.randomIntBetween(minY, maxY-width);		// subtracts width so rectangle does not exceed bounds
                String rectangle = "r" + i + "," + bottomLeftX + "," + bottomLeftY + "," + height + "," + width;
                writerR.println(rectangle);
            }
            writerR.close();
            
            System.out.println("Created P.txt and R.txt data successfuly!");
        }
        catch (FileNotFoundException | UnsupportedEncodingException err) {
        	System.out.println("Error creating P.txt and R.txt.");
            err.printStackTrace();
        }
    }

}
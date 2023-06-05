import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

public class CsvGenerator {
	public static void main(String[] args) {
		String csv = "num,square,cube,theta,sin(theta)\r\n";
		int COUNT = 10000;
		Random r = new Random();
		for(int n=0;n<COUNT;n++) {
			int i = r.nextInt(COUNT);
			int sq = i*i;
			int cube = i*i*i;
			double theta = 2*Math.PI*0.001*i;
			double sinTheta = Math.sin(theta);
			csv+=i+","+sq+","+cube+","+theta+","+sinTheta+"\r\n";
		}
		try {
			FileOutputStream fs = new FileOutputStream("data"+COUNT+".csv");
			fs.write(csv.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

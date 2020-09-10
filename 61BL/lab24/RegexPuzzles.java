import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexPuzzles {
    public static List<String> urlRegex(String[] urls) {
        Pattern urlPattern = Pattern.compile("\\(.*?(http://|https://)(\\w+\\.)+[a-z]{2,3}/\\w+(\\.html)+.*?\\)");
        List<String> toReturn = new LinkedList<>();
        for (String s : urls) {
            Matcher url = urlPattern.matcher(s);
            if (url.matches()) {
                toReturn.add(s);
            }
        }
        return toReturn;
    }

    public static List<String> findStartupName(String[] names) {
        //Source: Stack Overflow
        Pattern startupNamePattern = Pattern.compile("(Data|App|my|on|un)[\\w&&[^i]]+?(ly|sy|ify|\\.io|\\.fm|\\.tv)");
        List<String> toReturn = new LinkedList<>();
        for (String s : names) {
            Matcher startupName = startupNamePattern.matcher(s);
            if (startupName.matches()) {
                toReturn.add(s);
            }
        }
        return toReturn;
    }

    public static BufferedImage imageRegex(String filename, int width, int height) {
        BufferedReader br;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(filename)));
        } catch (FileNotFoundException e) {
            throw new RuntimeException("No such file found: " + filename);
        }

        // Initialize both Patterns and 3-d array
        Pattern coordinatePattern = Pattern.compile("\\(([0-9]{1,3}), ([0-9]{1,3})\\)");
        Pattern rgbPattern = Pattern.compile("\\[([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3})]");
        int[][][] toReturn = new int[width][height][3];
        try {
            String line;
            while ((line = br.readLine()) != null) {
                // Initialize both Matchers and find() for each
                // Parse each group as an Integer
                // Store in array
                Matcher coor = coordinatePattern.matcher(line);
                Matcher rgb = rgbPattern.matcher(line);
                int x = 0, y = 0, r = 0, g = 0, b = 0;
                while (coor.find()) {
                    x = Integer.parseInt(coor.group(1));
                    y = Integer.parseInt(coor.group(2));
                }
                while (rgb.find()) {
                    r = Integer.parseInt(rgb.group(1));
                    g = Integer.parseInt(rgb.group(2));
                    b = Integer.parseInt(rgb.group(3));
                }
                toReturn[x][y][0] = r;
                toReturn[x][y][1] = g;
                toReturn[x][y][2] = b;
            }
        } catch (IOException e) {
            System.err.printf("Input error: %s%n", e.getMessage());
            System.exit(1);
        }
        // Return the BufferedImage of the array
        return arrayToBufferedImage(toReturn);
    }

    public static BufferedImage arrayToBufferedImage(int[][][] arr) {
        BufferedImage img = new BufferedImage(arr.length,
                arr[0].length, BufferedImage.TYPE_INT_RGB);
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                int pixel = 0;
                for (int k = 0; k < 3; k++) {
                    pixel += arr[i][j][k] << (16 - 8 * k);
                }
                img.setRGB(i, j, pixel);
            }
        }

        return img;
    }

    public static void main(String[] args) {
        /* For testing image regex */
        BufferedImage img = imageRegex("mystery.txt", 400, 400);

        File outputfile = new File("output_img.jpg");
        try {
            ImageIO.write(img, "jpg", outputfile);
        } catch (IOException e) {
            System.out.println("Error writing file: " + e.getMessage());
        }
    }
}

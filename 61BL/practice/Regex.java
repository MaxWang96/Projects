import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Regex {
    public static void main(String[] args) {
        Pattern p1 = Pattern.compile("(\\(\\d{3}\\)\\s|\\d{3}-)\\d{3}-\\d{4}");
        Matcher m1 = p1.matcher("408-244-1023");
        System.out.println(m1.matches());
//        System.out.println(m1.group(0));
//        System.out.println(m1.group(1));
//        Matcher m1b = p1.matcher("mattjatt");
//        int counter1 = 0;
//        while (m1b.find()) {
//            counter1++;
//        }
//        System.out.println(counter1);

//        Pattern p2 = Pattern.compile("");
//        System.out.println(p2.matcher("").matches());
//        System.out.println(p2.matcher("").matches());
//        System.out.println(p2.matcher("").matches());
//        Matcher m2 = p2.matcher("");
//        int counter2 = 0;
//        while (m2.find()) {
//            counter2++;
//        }
//        System.out.println(counter2);

//        Pattern p3 = Pattern.compile("");
//        System.out.println(p3.matcher("").matches());
//        System.out.println(p3.matcher("").matches());
//        System.out.println(p3.matcher("").matches());
//        Matcher m3 = p3.matcher("");
//        int counter3 = 0;
//        while (m3.find()) {
//            counter3++;
//        }
//        System.out.println(counter3);
    }
}

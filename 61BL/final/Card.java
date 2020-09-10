import java.util.regex.Pattern;

public class Card {
    public static Pattern pattern() {
        return Pattern.compile("(?i)([2-9]|ace|10|jack|queen|king)\\sof\\s(hearts|diamonds|spades|clubs)");
    }
}


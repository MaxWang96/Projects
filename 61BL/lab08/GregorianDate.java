public class GregorianDate extends Date {

    private static final int[] MONTH_LENGTHS = {
        31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    };

    public GregorianDate(int year, int month, int dayOfMonth) {
        super(year, month, dayOfMonth);
    }


    // YOUR CODE HERE

    @Override
    public int dayOfYear() {
        int precedingMonthDays = 0;
        for (int m = 1; m < month; m += 1) {
            precedingMonthDays += getMonthLength(m);
        }
        return precedingMonthDays + dayOfMonth;
    }

    @Override
    public Date nextDate() {
        int newDate = dayOfMonth + 1;
        int newMonth = month;
        int newYear = year;
        if (newDate > MONTH_LENGTHS[month - 1]) {
            newDate -= MONTH_LENGTHS[month - 1];
            newMonth += 1;
            if (newMonth > 12) {
                newMonth -= 12;
                newYear += 1;
            }
        }
        return new GregorianDate(newYear, newMonth, newDate);
    }

    private static int getMonthLength(int m) {
        return MONTH_LENGTHS[m - 1];
    }
}

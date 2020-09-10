public class Measurement {

    /**
     * Constructor: initialize this object to be a measurement of 0 feet, 0
     * inches
     */
    int feet1, inches1;

    public Measurement() {
        feet1 = 0;
        inches1 = 0;
    }

    /**
     * Constructor: takes a number of feet as its single argument, using 0 as
     * the number of inches
     */
    public Measurement(int feet) {
        feet1 = feet;
        inches1 = 0;
    }

    /**
     * Constructor: takes the number of feet in the measurement and the number
     * of inches as arguments (in that order), and does the appropriate
     * initialization
     */
    public Measurement(int feet, int inches) {
        feet1 = feet;
        inches1 = inches;
    }

    /**
     * Returns the number of feet in in this Measurement. For example, if the
     * Measurement has 1 foot and 6 inches, this method should return 1.
     */
    public int getFeet() {
        return feet1; // provided to allow the file to compile
    }

    /**
     * Returns the number of inches in this Measurement. For example, if the
     * Measurement has 1 foot and 6 inches, this method should return 6.
     */
    public int getInches() {

        return inches1; // provided to allow the file to compile
    }

    /**
     * Adds the argument m2 to the current measurement
     */
    public Measurement plus(Measurement m2) {
        this.feet1 += m2.feet1;
        this.inches1 += m2.inches1;
        if (this.inches1 >= 12) {
            this.inches1 -= 12;
            this.feet1 += 1;
        }
        return new Measurement(this.feet1, this.inches1); // provided to allow the file to compile
    }

    /**
     * Subtracts the argument m2 from the current measurement. You may assume
     * that m2 will always be smaller than the current measurement.
     */
    public Measurement minus(Measurement m2) {
        this.feet1 -= m2.feet1;
        this.inches1 -= m2.inches1;
        if (this.inches1 < 0) {
            this.feet1--;
            this.inches1 += 12;
        }
        return new Measurement(this.feet1, this.inches1); // provided to allow the file to compile
    }

    /**
     * Takes a nonnegative integer argument n, and returns a new object that
     * represents the result of multiplying this object's measurement by n. For
     * example, if this object represents a measurement of 7 inches, multiple
     * (3) should return an object that represents 1 foot, 9 inches.
     */
    public Measurement multiple(int multipleAmount) {
        int all_inch = this.feet1 * 12 + this.inches1;
        all_inch *= multipleAmount;
        int new_feet = all_inch / 12;
        int new_inches = all_inch % 12;
        return new Measurement(new_feet, new_inches); // provided to allow the file to compile
    }

    /**
     * toString should return the String representation of this object in the
     * form f'i" that is, a number of feet followed by a single quote followed
     * by a number of inches less than 12 followed by a double quote (with no
     * blanks).
     */
    @Override
    public String toString() {
        return this.feet1 + "'" + this.inches1 + "\""; // provided to allow the file to compile
    }

}
import org.junit.Test;

import static org.junit.Assert.*;

public class MeasurementTest {
    @Test
    public void testConstructor() {
        // TODO: stub for first test
        Measurement m = new Measurement();
        Measurement n = new Measurement(1);
        Measurement x = new Measurement(1, 1);
        assertTrue(m.toString().equals("0'0\""));
        assertTrue(n.toString().equals("1'0\""));
        assertTrue(x.toString().equals("1'1\""));
    }

    @Test
    public void testGetFeet() {
        Measurement m = new Measurement(2);
        assertTrue(m.getFeet() == 2);
    }

    @Test
    public void testGetInches() {
        Measurement m = new Measurement(1, 3);
        assertTrue(m.getInches() == 3);
    }

    @Test
    public void testPlus() {
        Measurement x1 = new Measurement(5, 5);
        Measurement x2 = new Measurement(5, 5);
        Measurement y = new Measurement(1, 1);
        Measurement z = new Measurement(5, 11);
        x1.plus(y);
        x2.plus(z);
        System.out.println(x1);
        System.out.println(x2);
        assertTrue(x1.toString().equals("6'6\""));
        assertTrue(x2.toString().equals("11'4\""));
    }

    @Test
    public void testMinus() {
        Measurement x1 = new Measurement(5, 5);
        Measurement x2 = new Measurement(5, 5);
        Measurement y = new Measurement(1, 1);
        Measurement z = new Measurement(4, 11);
        x1.minus(y);
        x2.minus(z);
        System.out.println(x1);
        System.out.println(x2);
        assertTrue(x1.toString().equals("4'4\""));
        assertTrue(x2.toString().equals("0'6\""));
    }

    @Test
    public void testMultiple() {
        Measurement x = new Measurement(1, 5);
        Measurement y = x.multiple(3);
        assertTrue(y.toString().equals("4'3\""));
    }


    // TODO: Add additional JUnit tests for Measurement.java here.

}
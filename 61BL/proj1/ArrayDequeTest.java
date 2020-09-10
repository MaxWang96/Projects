import org.junit.Test;

import java.util.Random;

import static org.junit.Assert.*;

public class ArrayDequeTest {

    @Test
    public void testAdd() {
        ArrayDeque<Integer> testSubject = new ArrayDeque<>();

        try {
            assertTrue(testSubject.isEmpty());
            testSubject.addFirst(7);
            testSubject.addFirst(14);
            testSubject.addLast(14);
            testSubject.addLast(14);
            assertEquals(4, testSubject.size());
            testSubject.addFirst(7);
            assertEquals(5, testSubject.size());
            testSubject.addFirst(5);
        } finally {
            System.out.println("Expected: 5 7 14 7 14 14");
            System.out.print("Actual: ");
            testSubject.printDeque();
            System.out.println();
        }
    }

    @Test
    public void testPrint1() {
        ArrayDeque<Integer> testSubject = new ArrayDeque<>();
        Integer a = 7;

        try {
            testSubject.addFirst(7);
            testSubject.addFirst(14);
            testSubject.addFirst(14);
            testSubject.addFirst(14);
            testSubject.addFirst(7);
            testSubject.addFirst(5);
            testSubject.addFirst(10);
            testSubject.addFirst(10);
            assertEquals(a, testSubject.get(7));
            assertEquals(null, testSubject.get(20));
        } finally {
            System.out.println("Expected: 10 10 5 7 14 14 14 7");
            System.out.print("Actual: ");
            testSubject.printDeque();
            System.out.println();
        }
    }

    @Test
    public void testPrint2() {
        ArrayDeque<Integer> testSubject = new ArrayDeque<>();

        try {
            testSubject.addLast(7);
            testSubject.addLast(14);
            testSubject.addLast(14);
            testSubject.addLast(14);
            testSubject.addLast(7);
            testSubject.addLast(5);
        } finally {
            System.out.println("Expected: 7 14 14 14 7 5");
            System.out.print("Actual: ");
            testSubject.printDeque();
            System.out.println();
        }
    }

    @Test
    public void testDecreaseSize() {
        ArrayDeque<Integer> testSubject = new ArrayDeque<>();
        Integer a = 1;

        try {
            assertEquals(null, testSubject.removeFirst());
            testSubject.addFirst(1);
            assertEquals(a, testSubject.removeLast());
            testSubject.addFirst(4);
            testSubject.addFirst(3);
            testSubject.addFirst(2);
            testSubject.addLast(5);
            testSubject.addFirst(1);
        } finally {
            System.out.println("Expected: 1 2 3 4 5");
            System.out.print("Actual: ");
            testSubject.printDeque();
            System.out.println();
        }
    }

    @Test
    public void testSizePlusOne() {
        ArrayDeque<Integer> testSubject = new ArrayDeque<>();
        Integer a = 1;

        try {
            testSubject.addFirst(1);
            for (int j = 0; j < 8; j++) {
                testSubject.addLast(j + 2);
            }
            System.out.println("Expected: 1 2 3 4 5 6 7 8 9");
            System.out.print("Actual: ");
            testSubject.printDeque();
            System.out.println();
            assertEquals(a, testSubject.removeFirst());
            for (int i = 0; i < 6; i++) {
                testSubject.removeFirst();
            }
            System.out.println("Expected: 8 9");
            System.out.print("Actual: ");
            testSubject.printDeque();
            System.out.println();
        } finally {
            return;
        }
    }

    @Test
    public void fuzzTest() {
        ArrayDeque<Double> testSubject = new ArrayDeque<>();

        try {
            Random generator = new Random(1);
            double randomNumber;
            for (int i = 0; i <= 100000; i++) {
                randomNumber = generator.nextDouble();
                if (randomNumber > .7 && randomNumber < .85) {
                    testSubject.removeFirst();
                } else if (randomNumber >= .85) {
                    testSubject.removeLast();
                } else {
                    testSubject.addFirst(randomNumber);
                }
            }
        } finally {
            System.out.println(testSubject.size());
            System.out.println(testSubject.get(100));
        }
    }
}

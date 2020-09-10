import org.junit.Test;

import java.util.Random;

import static org.junit.Assert.*;

/** Performs some basic linked list tests. */
public class LinkedListDequeTest {

    /** Adds a few things to the deque, checking isEmpty() and size() are correct,
     * finally printing the results. */
    @Test
    public void addIsEmptySizeTest() {
        LinkedListDeque<String> lld1 = new LinkedListDeque<>();

        // Java will try to run the below code.
        // If there is a failure, it will jump to the finally block before erroring.
        // If all is successful, the finally block will also run afterwards.
        try {

            assertTrue(lld1.isEmpty());

            lld1.addFirst("front");
            assertEquals(1, lld1.size());
            assertFalse(lld1.isEmpty());

            lld1.addLast("middle");
            assertEquals(2, lld1.size());

            lld1.addLast("back");
            assertEquals(3, lld1.size());

        } finally {
            // The deque will be printed at the end of this test
            // or after the first point of failure.
            System.out.println("Printing out deque: ");
            lld1.printDeque();
        }
    }

    /** Adds an item, then removes an item, and ensures that deque is empty afterwards. */
    @Test
    public void addRemoveTest() {
        System.out.println("Running add/remove test.");
        LinkedListDeque<Integer> lld1 = new LinkedListDeque<>();

        try {
            assertTrue(lld1.isEmpty());

            lld1.addFirst(10);
            assertFalse(lld1.isEmpty());

            lld1.removeFirst();
            assertTrue(lld1.isEmpty());
        } finally {
            System.out.println("Printing out deque: ");
            lld1.printDeque();
        }
    }

    @Test
    public void addRemoveTest2() {
        LinkedListDeque<Integer> subject = new LinkedListDeque<>();

        try {
            subject.addFirst(42);
            subject.addFirst(12);
            subject.addFirst(57);
            assertEquals(3, subject.size());
            assertFalse(subject.isEmpty());
            subject.removeLast();
            assertEquals(2, subject.size());
        } finally {
            subject.printDeque();
        }
    }

    @Test
    public void testAddFirst() {
        LinkedListDeque<Integer> subject = new LinkedListDeque<>();

        try {
            subject.addFirst(42);
            subject.addFirst(12);
            subject.addFirst(57);
            assertEquals(3, subject.size());
            assertFalse(subject.isEmpty());
        } finally {
            subject.printDeque();
        }
    }

    @Test
    public void testGet() {
        LinkedListDeque<String> subject = new LinkedListDeque<>();

        try {
            assertEquals(null, subject.get(0));
            subject.addFirst("42");
            subject.addFirst("12");
            subject.addFirst("57");
            assertEquals("57", subject.get(0));
            assertEquals(null, subject.get(3));
        } finally {
            subject.printDeque();
        }
    }

    @Test
    public void testGetRecursive() {
        LinkedListDeque<String> subject = new LinkedListDeque<>();

        try {
            assertEquals(null, subject.getRecursive(0));
            subject.addFirst("42");
            subject.addFirst("12");
            subject.addFirst("57");
            subject.addLast("77");
            assertEquals("57", subject.getRecursive(0));
            assertEquals("77", subject.getRecursive(3));
            assertEquals(null, subject.getRecursive(4));
        } finally {
            subject.printDeque();
        }
    }

    @Test
    public void testExtremeCase1() {
        LinkedListDeque<String> subject = new LinkedListDeque<>();

        try {
            subject.addFirst("Hello");
            assertEquals("Hello", subject.removeLast());
            subject.addLast("Hey");
            subject.addFirst("Hi");
            assertEquals("Hi", subject.removeFirst());
            assertFalse(subject.isEmpty());
            subject.removeLast();
            assertTrue(subject.isEmpty());
            subject.removeLast();
            assertTrue(subject.isEmpty());
            subject.addFirst("Tea");
            subject.removeLast();
            assertTrue(subject.isEmpty());
        } finally {
            subject.printDeque();
        }
    }

    @Test
    public void fuzzTest() {
        ArrayDeque<Double> testSubject = new ArrayDeque<>();
//        System.out.println(System.currentTimeMillis());

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
//        System.out.println(System.currentTimeMillis());
    }

    @Test
    public void testTime() {
        System.out.println(System.currentTimeMillis());
    }
}

import org.junit.Test;
import static org.junit.Assert.*;

public class MinHeapTest {

    @Test
    public void test1() {
        MinHeap<Integer> test = new MinHeap<>();
        test.insert(99);
        test.insert(3);
        test.insert(2);
        test.insert(9);
        test.insert(6);
        test.insert(7);
        assertEquals(2, (int) test.findMin());
        assertTrue(test.contains(2));
        assertEquals(6, (int) test.size());
        assertEquals(2, (int) test.removeMin());
        assertFalse(test.contains(2));
        assertEquals(5, (int) test.size());
        assertEquals(3, (int) test.removeMin());
        assertEquals(4, (int) test.size());
    }
}

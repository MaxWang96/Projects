import org.junit.Test;
import static org.junit.Assert.*;

public class MinHeapPQTest {

    @Test
    public void test1() {
        MinHeapPQ<String> test = new MinHeapPQ<>();
        test.insert("snake", 3);
        test.insert("papa", 4);
        assertTrue(test.contains("papa"));
        assertFalse(test.contains("mimi"));
        test.insert("banana", 1);
        assertEquals("banana", test.peek());
        assertEquals("banana", test.poll());
        assertEquals("snake", test.peek());
        test.insert("divinity", 29);
        assertEquals("snake", test.peek());
        test.changePriority("divinity", 1);
        assertEquals("divinity", test.peek());
    }
}

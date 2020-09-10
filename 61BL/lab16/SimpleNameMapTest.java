import org.junit.Test;

import static org.junit.Assert.*;


public class SimpleNameMapTest {
    @Test
    public void testMap() {
        SimpleNameMap test = new SimpleNameMap();
        test.put("Ada", "Hu");
        test.put("Max", "Wang");
        test.put("Connor", "Chris");
        test.put("Ace", "Wang");
        assertEquals(4, test.size());
        assertEquals("Wang", test.get("Max"));
        assertNull(test.get("Julia"));
        assertTrue(test.containsKey("Ada"));
        assertTrue(test.containsKey("Ace"));
        assertEquals("Wang", test.get("Ace"));
        assertFalse(test.containsKey("Ming"));
        assertEquals("Wang", test.remove("Ace"));
        assertNull(test.remove("Ace"));
        test.put("?Madness", "test");
        assertTrue(test.containsKey("?Madness"));
        test.put("summer", "luck");
        test.put("hot", "luck");
        test.put("yikes", "luck");
        test.put("blob", "luck");
        test.put("swam", "luck");
        assertEquals(9, test.size());
        assertEquals("Wang", test.get("Max"));
        assertTrue(test.containsKey("Ada"));
    }
}

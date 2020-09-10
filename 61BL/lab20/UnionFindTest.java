import org.junit.Test;

import static org.junit.Assert.*;

public class UnionFindTest {
    @Test
    public void testUnion() {
        UnionFind toTest = new UnionFind(10);
        assertEquals(-1, toTest.parent(9));
        assertEquals(1, toTest.sizeOf(2));
        toTest.union(1, 2);
        toTest.union(3, 4);
        toTest.union(1, 4);
        assertEquals(4, toTest.sizeOf(1));
        assertEquals(4, toTest.sizeOf(3));
        assertEquals(1, toTest.find(3));
        assertTrue(toTest.connected(3, 1));
    }
}
import org.junit.Test;
import static org.junit.Assert.*;

public class GraphTest {
    @Test
    public void testAdd() {
        Graph test = new Graph(10);
        test.addEdge(0, 1);
        test.addEdge(0, 2);
        test.addEdge(0, 10);
        test.addEdge(2, 0);
        test.addEdge(2, 1);
        test.addUndirectedEdge(2, 3);
        assertTrue(test.isAdjacent(0, 2));
        assertFalse(test.isAdjacent(1, 0));
//        System.out.println(test.neighbors(0));
//        System.out.println(test.neighbors(1));
        assertEquals(1, test.inDegree(0));
        assertEquals(2, test.inDegree(1));
    }
}
import org.junit.Test;

import static org.junit.Assert.*;

public class GraphTest {
    @Test
    public void testPrim() {
        Graph toTest = Graph.loadFromText("../inputs/graphTestAllDisjoint.in");
//        System.out.println(toTest.getNeighbors(0));
//        System.out.println(toTest.getEdges(4));
        Graph prim = toTest.prims(0);
//        System.out.println(prim.getEdges(3));
//        System.out.println(prim.getEdges(4));
        Graph kruskal = toTest.kruskals();
//        System.out.println(kruskal.getAllVertices());
//        System.out.println(kruskal.getAllEdges());
        assertEquals(kruskal.getNeighbors(0), prim.getNeighbors(0));
        assertEquals(kruskal.getNeighbors(2), prim.getNeighbors(2));
    }
}

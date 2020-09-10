import java.util.LinkedList;
import java.util.List;

public class Graph {
    public int numVertices;
    private LinkedList<Edge>[] adjLists;
    public Graph(int numVertices) {}
    public List<Integer> neighbors(int vertex) {return null;}
    public class Edge {
        private Integer to;
        private Integer from;
        private Integer weight;
        public Edge(int from, int to, int weight) {}
        public Integer to() {return 0;}
    }
}
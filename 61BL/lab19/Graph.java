import java.util.*;

public class Graph implements Iterable<Integer> {

    private LinkedList<Edge>[] adjLists;
    private int vertexCount;

    /* Initializes a graph with NUMVERTICES vertices and no Edges. */
    public Graph(int numVertices) {
        adjLists = (LinkedList<Edge>[]) new LinkedList[numVertices];
        for (int k = 0; k < numVertices; k++) {
            adjLists[k] = new LinkedList<Edge>();
        }
        vertexCount = numVertices;
    }

    public static void main(String[] args) {
        Graph g1 = new Graph(5);
        g1.generateG1();
        g1.printDFS(0);
        g1.printDFS(2);
        g1.printDFS(3);
        g1.printDFS(4);

        g1.printPath(0, 3);
        g1.printPath(0, 4);
        g1.printPath(1, 3);
        g1.printPath(1, 4);
        g1.printPath(4, 0);

        Graph g2 = new Graph(5);
        g2.generateG2();
        g2.printTopologicalSort();
    }

    /* Adds a directed Edge (V1, V2) to the graph. */
    public void addEdge(int v1, int v2) {
        addEdge(v1, v2, 0);
    }

    /* Adds an undirected Edge (V1, V2) to the graph. */
    public void addUndirectedEdge(int v1, int v2) {
        addUndirectedEdge(v1, v2, 0);
    }

    /* Adds a directed Edge (V1, V2) to the graph with weight WEIGHT. If the
       Edge already exists, replaces the current Edge with a new Edge with
       weight WEIGHT. */
    public void addEdge(int v1, int v2, int weight) {
        Edge toAdd = new Edge(v1, v2, weight);
        if (!replaceEdge(v1, toAdd)) {
            adjLists[v1].add(toAdd);
        }
    }

    /* Adds an undirected Edge (V1, V2) to the graph with weight WEIGHT. If the
       Edge already exists, replaces the current Edge with a new Edge with
       weight WEIGHT. */
    public void addUndirectedEdge(int v1, int v2, int weight) {
        addEdge(v1, v2, weight);
        addEdge(v2, v1, weight);
    }

    private boolean replaceEdge(int v, Edge edge) {
        for (Edge e : adjLists[v]) {
            if (e.equals(edge)) {
                e = edge;
                return true;
            }
        }
        return false;
    }

    /* Returns true if there exists an Edge from vertex FROM to vertex TO.
       Returns false otherwise. */
    public boolean isAdjacent(int from, int to) {
        for (Edge edge : adjLists[from]) {
            if (to == edge.to) {
                return true;
            }
        }
        return false;
    }

    /* Returns a list of all the vertices u such that the Edge (V, u)
       exists in the graph. */
    public List<Integer> neighbors(int v) {
        List<Integer> toReturn = new LinkedList<>();
        for (Edge edge : adjLists[v]) {
            toReturn.add(edge.to);
        }
        return toReturn;
    }

    /* Returns the number of incoming Edges for vertex V. */
    public int inDegree(int v) {
        int count = 0;
        for (LinkedList<Edge> lst : adjLists) {
            for (Edge edge : lst) {
                if (edge.to == v) {
                    count++;
                }
            }
        }
        return count;
    }

    /* Returns an Iterator that outputs the vertices of the graph in topological
       sorted order. */
    public Iterator<Integer> iterator() {
        return new TopologicalIterator();
    }

    /* Returns the collected result of performing a depth-first search on this
       graph's vertices starting from V. */
    public List<Integer> dfs(int v) {
        ArrayList<Integer> result = new ArrayList<Integer>();
        Iterator<Integer> iter = new DFSIterator(v);

        while (iter.hasNext()) {
            result.add(iter.next());
        }
        return result;
    }

    /* Returns true iff there exists a path from START to STOP. Assumes both
       START and STOP are in this graph. If START == STOP, returns true. */
    public boolean pathExists(int start, int stop) {
        if (start == stop) {
            return true;
        }
        List<Integer> havePath = dfs(start);
        return havePath.contains(stop);
    }


    /* Returns the path from START to STOP. If no path exists, returns an empty
       List. If START == STOP, returns a List with START. */
    public List<Integer> path(int start, int stop) {
        if (start == stop) {
            return List.of(start);
        }
        ArrayList<Integer> iterResult = new ArrayList<Integer>();
        Iterator<Integer> iter = new DFSIterator(start);
        Stack<Integer> findPath = new Stack<>();
        ArrayList<Integer> result = new ArrayList<Integer>();

        while (iter.hasNext()) {
            int toAdd = iter.next();
            iterResult.add(toAdd);
            if (toAdd == stop) {
                break;
            }
        }
        if (!iterResult.contains(stop)) {
            return new ArrayList<>();
        }
        int end = iterResult.get(iterResult.size() - 1);
        findPath.push(end);
        findPathHelper(end, start, findPath, iterResult);
        while (!findPath.isEmpty()) {
            result.add(findPath.pop());
        }
        return result;
    }

    private void findPathHelper(int end, int start, Stack<Integer> findPath, ArrayList<Integer> result) {
        if (end == start) {
            return;
        }
        for (int i = result.indexOf(end) - 1; i >= 0; i--) {
            int v = result.get(i);
            if (isAdjacent(v, end)) {
                findPath.push(v);
                end = v;
                break;
            }
        }
        findPathHelper(end, start, findPath, result);
    }

    public List<Integer> shortestPath(int start, int stop) {
        Map<Integer, Integer> distance = new HashMap<>();
        Map<Integer, Integer> predecessor = new HashMap<>();
        Set<Integer> visited = new HashSet<>();
        /* source: IntelliJ context action */
        PriorityQueue<Integer> fringe = new PriorityQueue<>((Comparator.comparingInt(distance::get)));
        fringe.add(start);
        distance.put(start, 0);
        predecessor.put(start, start);
        visited.add(start);
        int curr;
        List<Integer> neighbors;
        Edge edge;
        while (!fringe.isEmpty()) {
            curr = fringe.poll();
            visited.add(curr);
            neighbors = neighbors(curr);
            for (int v : neighbors) {
                if (!visited.contains(v)) {
                    edge = getEdge(curr, v);
                    if (!distance.containsKey(v)) {
                        distance.put(v, edge.weight + distance.get(curr));
                        predecessor.put(v, curr);
                        fringe.add(v);
                    } else if (distance.get(v) > edge.weight + distance.get(curr)) {
                        distance.put(v, edge.weight + distance.get(curr));
                        predecessor.put(v, curr);
                        fringe.add(v);
                    }
                }
            }
        }
        if (!visited.contains(stop)) {
            return null;
        }
        List<Integer> path = new LinkedList<>();
        int toAdd = stop;
        path.add(toAdd);
        while (toAdd != start) {
            toAdd = predecessor.get(toAdd);
            path.add(toAdd);
        }
        Collections.reverse(path);
        return path;
    }


    public Edge getEdge(int u, int v) {
        for (Edge e : adjLists[u]) {
            if (e.to == v) {
                return e;
            }
        }
        return null;
    }


    public List<Integer> topologicalSort() {
        ArrayList<Integer> result = new ArrayList<Integer>();
        Iterator<Integer> iter = new TopologicalIterator();
        while (iter.hasNext()) {
            result.add(iter.next());
        }
        return result;
    }

    private void generateG1() {
        addEdge(0, 1);
        addEdge(0, 2);
        addEdge(0, 4);
        addEdge(1, 2);
        addEdge(2, 0);
        addEdge(2, 3);
        addEdge(4, 3);
    }

    private void generateG2() {
        addEdge(0, 1);
        addEdge(0, 2);
        addEdge(0, 4);
        addEdge(1, 2);
        addEdge(2, 3);
        addEdge(4, 3);
    }

    private void generateG3() {
        addUndirectedEdge(0, 2);
        addUndirectedEdge(0, 3);
        addUndirectedEdge(1, 4);
        addUndirectedEdge(1, 5);
        addUndirectedEdge(2, 3);
        addUndirectedEdge(2, 6);
        addUndirectedEdge(4, 5);
    }

    private void generateG4() {
        addEdge(0, 1);
        addEdge(1, 2);
        addEdge(2, 0);
        addEdge(2, 3);
        addEdge(4, 2);
    }

    private void printDFS(int start) {
        System.out.println("DFS traversal starting at " + start);
        List<Integer> result = dfs(start);
        Iterator<Integer> iter = result.iterator();
        while (iter.hasNext()) {
            System.out.println(iter.next() + " ");
        }
        System.out.println();
        System.out.println();
    }

    private void printPath(int start, int end) {
        System.out.println("Path from " + start + " to " + end);
        List<Integer> result = path(start, end);
        if (result.size() == 0) {
            System.out.println("No path from " + start + " to " + end);
            return;
        }
        Iterator<Integer> iter = result.iterator();
        while (iter.hasNext()) {
            System.out.println(iter.next() + " ");
        }
        System.out.println();
        System.out.println();
    }

    private void printTopologicalSort() {
        System.out.println("Topological sort");
        List<Integer> result = topologicalSort();
        Iterator<Integer> iter = result.iterator();
        while (iter.hasNext()) {
            System.out.println(iter.next() + " ");
        }
    }

    /**
     * A class that iterates through the vertices of this graph,
     * starting with a given vertex. Does not necessarily iterate
     * through all vertices in the graph: if the iteration starts
     * at a vertex v, and there is no path from v to a vertex w,
     * then the iteration will not include w.
     */
    private class DFSIterator implements Iterator<Integer> {

        private Stack<Integer> fringe;
        private HashSet<Integer> visited;

        public DFSIterator(Integer start) {
            fringe = new Stack<>();
            visited = new HashSet<>();
            fringe.push(start);
        }

        public boolean hasNext() {
            if (!fringe.isEmpty()) {
                int i = fringe.pop();
                while (visited.contains(i)) {
                    if (fringe.isEmpty()) {
                        return false;
                    }
                    i = fringe.pop();
                }
                fringe.push(i);
                return true;
            }
            return false;
        }

        public Integer next() {
            int curr = fringe.pop();
            ArrayList<Integer> lst = new ArrayList<>();
            for (int i : neighbors(curr)) {
                lst.add(i);
            }
            lst.sort((Integer i1, Integer i2) -> -(i1 - i2));
            for (Integer e : lst) {
                fringe.push(e);
            }
            visited.add(curr);
            return curr;
        }

        //ignore this method
        public void remove() {
            throw new UnsupportedOperationException(
                    "vertex removal not implemented");
        }

    }

    private class TopologicalIterator implements Iterator<Integer> {

        private Stack<Integer> fringe;
        private int[] currentInDegree = new int[adjLists.length];

        // TODO: Instance variables here!

        TopologicalIterator() {
            fringe = new Stack<>();
            for (int i = 0; i <= adjLists.length - 1; i++) {
                currentInDegree[i] = inDegree(i);
            }
            updateZero();
        }

        public boolean hasNext() {
            //source: Stack Overflow
            return Arrays.stream(currentInDegree).anyMatch(x -> x == 0);
        }

        public Integer next() {
            int toReturn = fringe.pop();
            List<Integer> neighbors = neighbors(toReturn);
            currentInDegree[toReturn]--;
            for (int v : neighbors) {
                currentInDegree[v]--;
            }
            updateZero();
            return toReturn;
        }

        private void updateZero() {
            for (int i = 0; i <= currentInDegree.length - 1; i++) {
                if (currentInDegree[i] == 0) {
                    fringe.push(i);
                }
            }
        }

        public void remove() {
            throw new UnsupportedOperationException();
        }

    }

    private class Edge {

        private int from;
        private int to;
        private int weight;

        Edge(int from, int to, int weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }

        public boolean equals(Edge edge) {
            return from == edge.from && to == edge.to;
        }

        public String toString() {
            return "(" + from + ", " + to + ", weight = " + weight + ")";
        }

    }
}
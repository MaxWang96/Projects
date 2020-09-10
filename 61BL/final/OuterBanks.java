import java.util.HashSet;
import java.util.Stack;

public class OuterBanks {
    // Optional: your code here

    private static void DFS(Graph g, Stack<Integer> fringe, HashSet<Integer> visited) {
        while (!fringe.empty()) {
            Integer vertex = fringe.pop();
            if (!visited.contains(vertex)) {
                visited.add(vertex);
                for (Integer e : g.neighbors(vertex)) {
                    if (!visited.contains(e)) {
                        fringe.add(e);
                    }
                }
            }
        }
    }

    public static int getMinLocations(Graph g) {
        if (g.numVertices == 0) {
            return 0;
        }
        Stack<Integer> fringe = new Stack<>();
        HashSet<Integer> visited = new HashSet<>();
        int needToVisit = 0;
        for (int i = 0; i < g.numVertices; i++) {
            if (!visited.contains(i)) {
                fringe.push(i);
                DFS(g, fringe, visited);
                needToVisit++;
            }
        }
        return needToVisit;
    }

    //Optional: your code here
}
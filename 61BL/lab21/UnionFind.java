import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;

public class UnionFind {
    int[] set;

    /* Creates a UnionFind data structure holding N vertices. Initially, all
       vertices are in disjoint sets. */
    public UnionFind(int N) {
        if (N < 0) {
            throw new IllegalArgumentException();
        }
        set = new int[N];
        for (int i = 0; i <= N - 1; i++) {
            set[i] = -1;
        }
    }

    /* Returns the size of the set V belongs to. */
    public int sizeOf(int v) {
        if (v >= set.length || v < 0) {
            throw new IllegalArgumentException();
        }
        while (set[v] >= 0) {
            v = parent(v);
        }
        return -set[v];
    }

    /* Returns the parent of V. If V is the root of a tree, returns the
       negative size of the tree for which V is the root. */
    public int parent(int v) {
        if (v >= set.length || v < 0) {
            throw new IllegalArgumentException();
        }
        return set[v];
    }

    /* Returns true if nodes V1 and V2 are connected. */
    public boolean connected(int v1, int v2) {
        return (find(v1) == find(v2));
    }

    /* Returns the root of the set V belongs to. Path-compression is employed
       allowing for fast search-time. If invalid vertices are passed into this
       function, throw an IllegalArgumentException. */
    public int find(int v) {
        HashSet<Integer> toCompress = new HashSet<>();
        if (v >= set.length || v < 0) {
            throw new IllegalArgumentException();
        }
        while (set[v] >= 0) {
            toCompress.add(v);
            v = parent(v);
        }
        for (int i : toCompress) {
            set[i] = v;
        }
        return v;
    }

    /* Connects two elements V1 and V2 together. V1 and V2 can be any element,
       and a union-by-size heuristic is used. If the sizes of the sets are
       equal, tie break by connecting V1's root to V2's root. Union-ing a vertex
       with itself or vertices that are already connected should not change the
       structure. */
    public void union(int v1, int v2) {
        if (v1 >= set.length || v1 < 0 || v2 >= set.length || v2 < 0) {
            throw new IllegalArgumentException();
        }
        if (v1 == v2) {
            return;
        }
        if (connected(v1, v2)) {
            return;
        }
        if (sizeOf(v1) > sizeOf(v2)) {
            setRoot(v1, v2);
        } else {
            setRoot(v2, v1);
        }
    }

    private void setRoot(int v1, int v2) {
        int newRoot = find(v1);
        int connectRoot = find(v2);
        set[newRoot] += set[connectRoot];
        set[connectRoot] = newRoot;
    }
}

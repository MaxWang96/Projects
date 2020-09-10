package bearmaps.utils;

import edu.princeton.cs.algs4.Queue;
import edu.princeton.cs.algs4.TrieSET;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/*Very similar to Princeton TrieSet*/
public class NodeTrie{
    private static final int R = 256;

    private Node root;
    private int n;

    public void add(bearmaps.utils.graph.streetmap.Node key) {
        if (key == null) throw new IllegalArgumentException("argument to add() is null");
        root = add(root, key, 0);
    }

    private Node add(Node x, bearmaps.utils.graph.streetmap.Node key, int d) {
        if (x == null) x = new Node();
        if (d == key.name().length()) {
            if (!x.isString) n++;
            x.isString = true;
            addLocation(x, key);
        } else {
            char c = key.name().charAt(d);
            x.next[c] = add(x.next[c], key, d + 1);
        }
        return x;
    }

    private void addLocation(Node node, bearmaps.utils.graph.streetmap.Node x) {
        Map<String, Object> toAdd = new HashMap<>();
        toAdd.put("lat", x.lat());
        toAdd.put("lon", x.lon());
        toAdd.put("name", x.name());
        toAdd.put("id", x.id());
        node.locations.add(toAdd);
    }

    public List<Map<String, Object>> getLocations(String locationName) {
        if (locationName == null) throw new IllegalArgumentException("argument to contains() is null");
        Node node = getLoc(root, locationName, 0);
        if (node == null) return new LinkedList<>();
        return node.locations;
    }

    private Node getLoc(Node node, String locationName, int d) {
        if (node == null) return null;
        if (d == locationName.length()) return node;
        char c = locationName.charAt(d);
        return getLoc(node.next[c], locationName, d + 1);
    }

    private static class Node {
        private final Node[] next = new Node[R];
        private boolean isString;
        private final List<Map<String, Object>> locations = new LinkedList<>();
    }

    public int size() {
        return n;
    }

    public Iterable<String> keysWithPrefix(String prefix) {
        Queue<String> results = new Queue<String>();
        Node x = get(root, prefix, 0);
        collect(x, new StringBuilder(prefix), results);
        return results;
    }

    private void collect(Node x, StringBuilder prefix, Queue<String> results) {
        if (x == null) return;
        if (x.isString) results.enqueue(prefix.toString());
        for (char c = 0; c < R; c++) {
            prefix.append(c);
            collect(x.next[c], prefix, results);
            prefix.deleteCharAt(prefix.length() - 1);
        }
    }

    private Node get(Node x, String key, int d) {
        if (x == null) return null;
        if (d == key.length()) return x;
        char c = key.charAt(d);
        return get(x.next[c], key, d+1);
    }

}

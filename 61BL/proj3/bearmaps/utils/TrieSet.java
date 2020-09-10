package bearmaps.utils;

import bearmaps.utils.graph.streetmap.Node;

import java.util.*;


/*Partially based on Princeton TrieSet*/
public class TrieSet {
    private final TrieNode dummy = new TrieNode();

    public void add(Node key) {
        if (key == null) throw new IllegalArgumentException("argument to add() is null");
        String name = trim(key.name());
        dummy.addHelper(key, name, 0);
    }

    private String trim(String name) {
        StringBuilder sb = new StringBuilder(name);
        StringBuilder toReturn = new StringBuilder();
        for (int i = 0; i < sb.length(); i++) {
            int asc = sb.charAt(i);
            if ((asc == 32 || (asc >= 65 && asc <= 90) || (asc >= 97 && asc <= 122))) {
                toReturn.append(sb.charAt(i));
            }
        }
        return toReturn.toString().toLowerCase();
    }

    public List<String> keysWithPrefix(String prefix) {
        List<String> result = dummy.prefixHelper(trim(prefix));
        if (result != null) {
            return result;
        }
        return new LinkedList<>();
    }

    public List<Map<String, Object>> getLocations(String locationName) {
        if (locationName == null) throw new IllegalArgumentException("argument to contains() is null");
        TrieNode node = getLoc(dummy, trim(locationName), 0);
        if (node == null) return new LinkedList<>();
        return node.locations;
    }

    private TrieNode getLoc(TrieNode node, String locationName, int d) {
        if (node == null) return null;
        if (d == locationName.length()) return node;
        return getLoc(node.children.get(locationName.substring(d, d + 1)), locationName, d + 1);
    }

    private static class TrieNode {
        private final String item;
        private final TreeMap<String, TrieNode> children = new TreeMap<>();
        private final List<Map<String, Object>> locations = new LinkedList<>();
        private boolean end = false;

        public TrieNode() {
            item = "";
        }

        public TrieNode(String item) {
            this.item = item;
        }

        public void addHelper(Node key, String name, int i) {
            if (i > name.length() - 1) {
                end = true;
                addLocation(key);
                return;
            }
            if (!children.containsKey(name.substring(i, i + 1))) {
                children.put(name.substring(i, i + 1), new TrieNode(name.substring(i, i + 1)));
            }
            children.get(name.substring(i, i + 1)).addHelper(key, name,i + 1);
        }

        private void addLocation(Node key) {
            Map<String, Object> toAdd = new HashMap<>();
            toAdd.put("lat", key.lat());
            toAdd.put("lon", key.lon());
            toAdd.put("name", key.name());
            toAdd.put("id", key.id());
            locations.add(toAdd);
        }

        private List<String> prefixHelper(String prefix) {
            int i = 0;
            TrieNode tmp = this;
            List<String> locations = new ArrayList<>();
            while (i <= prefix.length() - 1) {
                if (tmp.children.containsKey(prefix.substring(i, i + 1))) {
                    tmp = tmp.children.get(prefix.substring(i, i + 1));
                    i++;
                } else {
                    return null;
                }
            }
            prefix = prefix.substring(0, prefix.length()-1);
            tmp.locationHelper(prefix, locations);
            return locations;
        }

        private void locationHelper(String letters, List<String> locations) {
            letters += item;
            if (end) {
                for (Map<String, Object> loc : this.locations) {
                    locations.add((String) loc.get("name"));
                }
            }
            for (TrieNode node : children.values()) {
                node.locationHelper(letters, locations);
            }
        }
    }
}


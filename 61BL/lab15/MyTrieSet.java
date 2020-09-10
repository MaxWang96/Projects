import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

public class MyTrieSet implements TrieSet61BL {
    private TrieNode dummy = new TrieNode();

    @Override
    public void clear() {
        dummy = new TrieNode();
    }

    @Override
    public boolean contains(String key) {
        return dummy.containHelper(key, 0);
    }

    @Override
    public void add(String key) {
        dummy.addHelper(key, 0);
    }

    @Override
    public List<String> keysWithPrefix(String prefix) {
        return dummy.prefixHelper(prefix);
    }

    @Override
    public String longestPrefixOf(String key) {
        throw new UnsupportedOperationException();
    }

    private class TrieNode {
        private String item;
        private TreeMap<String, TrieNode> childen = new TreeMap<>();
        private boolean end = false;

        public TrieNode() {
            item = "";
        }

        public TrieNode(String item) {
            this.item = item;
        }

        public void addHelper(String key, int i) {
            if (i > key.length() - 1) {
                end = true;
                return;
            }
            if (!childen.containsKey(key.substring(i, i + 1))) {
                childen.put(key.substring(i, i + 1), new TrieNode(key.substring(i, i + 1)));
            }
            childen.get(key.substring(i, i + 1)).addHelper(key, i + 1);
        }

        public boolean containHelper(String key, int i) {
            if (i > key.length() - 1) {
                return end;
            }
            if (childen.containsKey(key.substring(i, i + 1))) {
                return childen.get(key.substring(i, i + 1)).containHelper(key, i + 1);
            } else {
                return false;
            }
        }

        public List<String> prefixHelper(String prefix) {
            int i = 0;
            TrieNode tmp = this;
            String letters = "";
            List<String> wordList = new ArrayList<>();
            while (i <= prefix.length() - 1) {
                if (tmp.childen.containsKey(prefix.substring(i, i + 1))) {
                    tmp = tmp.childen.get(prefix.substring(i, i + 1));
                    i++;
                } else {
                    return null;
                }
            }
            prefix = prefix.substring(0, prefix.length()-1);
            tmp.wordsHelper(prefix, wordList);
            return wordList;
        }

        private void wordsHelper(String letters, List<String> wordList) {
            letters += item;
            if (end) {
                wordList.add(letters);
            }
            for (TrieNode node : childen.values()) {
                node.wordsHelper(letters, wordList);
            }
        }
    }
}

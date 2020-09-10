import java.util.LinkedList;

public class SimpleNameMap {

    private LinkedList<Entry>[] nameMap;
    private int size = 0;
    private static final double LOADFACTOR = .75;

    public SimpleNameMap() {
        nameMap = new LinkedList[10];
        for (int i = 0; i <= nameMap.length - 1; i++) {
            nameMap[i] = new LinkedList<>();
        }
    }

    /* Returns the number of items contained in this map. */
    public int size() {
        return size;
    }

    /* Returns true if the map contains the KEY. */
    public boolean containsKey(String key) {
        LinkedList<Entry> tmp = nameMap[convertIndex(key)];
        for (Entry e : tmp) {
            if (e.key.equals(key)) {
                return true;
            }
        }
        return false;
    }

    /* Returns the value for the specified KEY. If KEY is not found, return
       null. */
    public String get(String key) {
        LinkedList<Entry> tmp = nameMap[convertIndex(key)];
        for (Entry e : tmp) {
            if (e.key.equals(key)) {
                return e.value;
            }
        }
        return null;
    }

    /* Puts a (KEY, VALUE) pair into this map. If the KEY already exists in the
       SimpleNameMap, replace the current corresponding value with VALUE. */
    public void put(String key, String value) {
        LinkedList<Entry> tmp = nameMap[convertIndex(key)];
        if ((double) size/nameMap.length > LOADFACTOR) {
            resize();
        }
        for (Entry e : tmp) {
            if (e.key.equals(key)) {
                e.value = value;
                return;
            }
        }
        tmp.add(new Entry(key, value));
        size++;
    }

    private void resize() {
        LinkedList<Entry>[] tmp = nameMap;
        nameMap = new LinkedList[nameMap.length * 2];
        for (int i = 0; i <= nameMap.length - 1; i++) {
            nameMap[i] = new LinkedList<>();
        }
        for (LinkedList<Entry> list : tmp) {
            for (Entry e : list) {
                LinkedList<Entry> destination = nameMap[convertIndex(e.key)];
                destination.add(e);
            }
        }
    }

    /* Removes a single entry, KEY, from this table and return the VALUE if
       successful or NULL otherwise. */
    public String remove(String key) {
        LinkedList<Entry> tmp = nameMap[convertIndex(key)];
        for (Entry e : tmp) {
            if (e.key.equals(key)) {
                tmp.remove(e);
                size--;
                return e.value;
            }
        }
        return null;
    }

    private int convertIndex(String key) {
        return Math.floorMod(key.hashCode(), nameMap.length);
    }

    private static class Entry {

        private String key;
        private String value;

        Entry(String key, String value) {
            this.key = key;
            this.value = value;
        }

        /* Returns true if this key matches with the OTHER's key. */
        public boolean keyEquals(Entry other) {
            return key.equals(other.key);
        }

        /* Returns true if both the KEY and the VALUE match. */
        @Override
        public boolean equals(Object other) {
            return (other instanceof Entry
                    && key.equals(((Entry) other).key)
                    && value.equals(((Entry) other).value));
        }

        @Override
        public int hashCode() {
            return super.hashCode();
        }
    }
}
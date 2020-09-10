import java.util.Iterator;
import java.util.LinkedList;

public class HashMap<K, V> implements Map61BL<K, V> {

    private LinkedList<Entry>[] nameMap;
    private int size = 0;
    private double loadFactor = .75;

    HashMap() {
        construct(16);
    }

    HashMap(int initialCapacity) {
        construct(initialCapacity);
    }

    HashMap(int initialCapacity, double loadFactor) {
        construct(initialCapacity);
        this.loadFactor = loadFactor;
    }

    /* Returns the number of items contained in this map. */
    public int size() {
        return size;
    }

    @Override
    public Iterator<K> iterator() {
        return new HashMapIterator();
    }

    @Override
    public void clear() {
        construct(nameMap.length);
        size = 0;
    }

    private void construct(int length) {
        nameMap = new LinkedList[length];
        for (int i = 0; i <= length - 1; i++) {
            nameMap[i] = new LinkedList<>();
        }
    }

    /* Returns true if the map contains the KEY. */
    public boolean containsKey(K key) {
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
    public V get(K key) {
        LinkedList<Entry> tmp = nameMap[convertIndex(key)];
        for (Entry e : tmp) {
            if (e.key.equals(key)) {
                return (V) e.value;
            }
        }
        return null;
    }

    /* Puts a (KEY, VALUE) pair into this map. If the KEY already exists in the
       SimpleNameMap, replace the current corresponding value with VALUE. */
    public void put(K key, V value) {
        LinkedList<Entry> tmp = nameMap[convertIndex(key)];
        for (Entry e : tmp) {
            if (e.key.equals(key)) {
                e.value = value;
                return;
            }
        }
        tmp.add(new Entry(key, value));
        size++;
        if ((double) size / nameMap.length > loadFactor) {
            resize();
        }
    }

    private void resize() {
        LinkedList<Entry>[] tmp = nameMap;
        construct(nameMap.length * 2);
        for (LinkedList<Entry> list : tmp) {
            for (Entry e : list) {
                LinkedList<Entry> destination =
                        nameMap[convertIndex((K) e.key)];
                destination.add(e);
            }
        }
    }

    /* Removes a single entry, KEY, from this table and return the VALUE if
       successful or NULL otherwise. */
    public V remove(K key) {
        LinkedList<Entry> tmp = nameMap[convertIndex(key)];
        for (Entry e : tmp) {
            if (e.key.equals(key)) {
                tmp.remove(e);
                size--;
                return (V) e.value;
            }
        }
        return null;
    }

    @Override
    public boolean remove(K key, V value) {
        return false;
    }

    private int convertIndex(K key) {
        return Math.floorMod(key.hashCode(), nameMap.length);
    }

    public int capacity() {
        return nameMap.length;
    }

    private static class Entry<K, V> {

        private K key;
        private V value;

        Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }

        /* Returns true if this key matches with the OTHER's key. */
        public boolean keyEquals(Entry<K, V> other) {
            return key.equals(other.key);
        }

        /* Returns true if both the KEY and the VALUE match. */
        @Override
        public boolean equals(Object other) {
            return (other instanceof Entry
                    && key.equals(((Entry<K, V>) other).key)
                    && value.equals(((Entry<K, V>) other).value));
        }

        @Override
        public int hashCode() {
            return super.hashCode();
        }
    }

    private class HashMapIterator implements Iterator<K> {
        private int indexArray = 0;
        private int indexList = 0;

        public HashMapIterator() {
            checkEmpty();
        }

        @Override
        public boolean hasNext() {
            return indexArray < nameMap.length;
        }

        @Override
        public K next() {
            K toReturn = (K) nameMap[indexArray].get(indexList).key;
            indexList++;
            if (indexList == nameMap[indexArray].size()) {
                indexList = 0;
                indexArray++;
            }
            checkEmpty();
            return toReturn;
        }

        private void checkEmpty() {
            while (indexArray < nameMap.length
                    && nameMap[indexArray].size() == 0) {
                indexArray++;
            }
        }
    }
}

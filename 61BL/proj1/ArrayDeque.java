public class ArrayDeque<T> implements Deque<T> {

    private int size;
    private int nextFirst;
    private int nextLast;
    private T[] items;
    private static final int FACTOR = 2;

    public ArrayDeque() {
        items = (T[]) new Object[8];
        size = 0;
        nextFirst = 4;
        nextLast = 5;
    }

    @Override
    public void addFirst(T item) {
        if (size == items.length) {
            increaseSize();
        }
        items[nextFirst] = item;
        nextFirst = Math.floorMod((nextFirst - 1), items.length);
        size++;
    }

    @Override
    public void addLast(T item) {
        if (size == items.length) {
            increaseSize();
        }
        items[nextLast] = item;
        nextLast = (nextLast + 1) % items.length;
        size++;
    }

    @Override
    public T removeFirst() {
        if (size == 0) {
            return null;
        }
        T temp = items[(nextFirst + 1) % items.length];
        items[(nextFirst + 1) % items.length] = null;
        size--;
        nextFirst = (nextFirst + 1) % items.length;
        if (4 * size <= items.length) {
            decreaseSize();
        }
        return temp;
    }

    @Override
    public T removeLast() {
        if (size == 0) {
            return null;
        }
        T temp = items[Math.floorMod((nextLast - 1), items.length)];
        items[Math.floorMod((nextLast - 1), items.length)] = null;
        size--;
        nextLast = Math.floorMod((nextLast - 1), items.length);
        if (4 * size <= items.length) {
            decreaseSize();
        }
        return temp;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public void printDeque() {
        for (int i = 0; i <= size - 2; i++) {
            System.out.print(items[(nextFirst + 1 + i) % items.length] + " ");
        }
        System.out.println(items[(nextFirst + size) % items.length]);
    }

    @Override
    public T get(int index) {
        if (index >= size) {
            return null;
        }
        return items[(nextFirst + index + 1) % items.length];
    }

    private void increaseSize() {
        T[] temp = (T[]) new Object[size * FACTOR];
        System.arraycopy(items, (nextFirst + 1) % items.length, temp, 0, size - nextFirst - 1);
        System.arraycopy(items, 0, temp, size - nextFirst - 1, nextFirst + 1);
        items = temp;
        nextFirst = items.length - 1;
        nextLast = size;
    }

    private void decreaseSize() {
        T[] temp = (T[]) new Object[items.length / 2];
        if (nextFirst + 1 == items.length) {
            System.arraycopy(items, 0, temp, 0, size);
        } else if (nextFirst + size >= items.length) {
            System.arraycopy(items, nextFirst + 1, temp, 0, items.length - nextFirst - 1);
            System.arraycopy(items, 0, temp, items.length - nextFirst - 1, size
                    + nextFirst + 1 - items.length);
        } else {
            System.arraycopy(items, nextFirst + 1, temp, 0, size);
        }
        items = temp;
        nextFirst = items.length - 1;
        nextLast = size;
    }
}



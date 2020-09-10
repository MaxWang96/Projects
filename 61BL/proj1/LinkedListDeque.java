public class LinkedListDeque<T> implements Deque<T> {

    private static class Node<T> {
        private T item;
        private Node prev, next;

        Node(T item, Node prev, Node next) {
            this.item = item;
            this.prev = prev;
            this.next = next;
        }
    }

    private Node sentinel;
    private int size;

    public LinkedListDeque() {
        sentinel = new Node<T>(null, null, null);
        sentinel.prev = sentinel;
        sentinel.next = sentinel;
        size = 0;
    }

    @Override
    public void addFirst(T item) {
        sentinel.next = new Node(item, sentinel, sentinel.next);
        sentinel.next.next.prev = sentinel.next;
        size++;
    }

    @Override
    public void addLast(T item) {
        sentinel.prev = new Node(item, sentinel.prev, sentinel);
        sentinel.prev.prev.next = sentinel.prev;
        size++;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public void printDeque() {
        Node temp = sentinel.next;
        for (int i = 0; i <= size - 2; i++) {
            System.out.print(temp.item + " ");
            temp = temp.next;
        }
        System.out.println(temp.item);
    }

    @Override
    public T removeFirst() {
        if (size == 0) {
            return null;
        }
        Node temp = sentinel.next;
        sentinel.next = temp.next;
        temp.next.prev = sentinel;
        size--;
        return (T) temp.item;
    }

    @Override
    public T removeLast() {
        if (size == 0) {
            return null;
        }
        Node temp = sentinel.prev;
        sentinel.prev = temp.prev;
        temp.prev.next = sentinel;
        size--;
        return (T) temp.item;
    }

    @Override
    public T get(int index) {
        Node temp = sentinel;
        if (index >= size) {
            return null;
        }
        for (int i = 0; i <= index; i++) {
            temp = temp.next;
        }
        return (T) temp.item;
    }

    public T getRecursive(int index) {
        if (index >= size) {
            return null;
        }
        return getRecursiveHelper(index, sentinel.next);
    }

    private T getRecursiveHelper(int index, Node curr) {
        if (index == 0) {
            return (T) curr.item;
        }
        return getRecursiveHelper(index - 1, curr.next);
    }
}

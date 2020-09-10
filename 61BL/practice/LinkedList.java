public class LinkedList {
    public int item;
    public LinkedList rest;

    public LinkedList(int num, LinkedList next) {
        item = num;
        rest = next;
    }

    public static void main(String[] args) {
        LinkedList l1 = new LinkedList(5, null);
        LinkedList l2 = new LinkedList(6, l1);
        l1.rest = l2.rest;
        l2.rest = l1.rest.rest;
        LinkedList l3 = new LinkedList(7, null);
        l3.rest = l2.rest.rest.rest;
        LinkedList l4 = new LinkedList(8, l2);
        l4.rest.rest.rest = new LinkedList(5, l1);
        System.out.println(l3.rest.rest.item);
    }
}

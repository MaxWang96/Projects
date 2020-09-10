import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;

public class test {
    @Test
    public void sortedTest() {
        LinkedList<Integer> test = new LinkedList<>(Arrays.asList(1, 2, 5, 4 ,3, 7, 8, 9, 10,13,11));
        Collections.sort(test);
//        LinkedList<Integer> test = new LinkedList<>(Arrays.asList(1, 2, 3));
//        LinkedList<Integer> test = new LinkedList<>(Arrays.asList(1));
        BST<Integer> bst = new BST<>(test);
    }
}

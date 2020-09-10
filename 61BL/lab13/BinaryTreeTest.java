import org.junit.Test;
import static org.junit.Assert.*;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BinaryTreeTest {
    @Test
    public void treeFormatTest() {
        BinarySearchTree<String> x = new BinarySearchTree<String>();
        x.add("C");
        x.add("A");
        x.add("E");
        x.add("B");
        x.add("D");
        final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream oldOut = System.out;
        System.setOut(new PrintStream(outContent));
        BinaryTree.print(x, "x");
        System.setOut(oldOut);
        assertEquals("x in preorder\r\nC A B E D \r\nx in inorder\r\nA B C D E \r\n\r\n".trim(),
                     outContent.toString().trim());
    }

    @Test
    public void addTest() {
        BinarySearchTree<Integer> x = new BinarySearchTree<>();
        x.add(5);
        x.add(3);
        x.add(3);
        x.add(1);
        x.add(2);
        x.add(4);
        final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream oldOut = System.out;
        System.setOut(new PrintStream(outContent));
        x.printPreorder();
        System.setOut(oldOut);
        assertEquals("5 3 1 2 4\r\n".trim(),
                outContent.toString().trim());
        x.add(6);
        x.add(7);
        x.add(8);
        x.add(9);
        x.add(10);
        assertTrue(x.contains(10));
        assertTrue(x.contains(2));
        assertTrue(x.contains(4));
        assertFalse(x.contains(11));
        assertFalse(x.contains(0));
    }

    @Test
    public void testConstructor() {
        ArrayList<String> pre = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        ArrayList<String> in = new ArrayList<>(Arrays.asList("B", "A", "D", "C", "E"));
        BinaryTree<String> x = new BinaryTree<>(pre, in);
        final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        PrintStream oldOut = System.out;
        System.setOut(new PrintStream(outContent));
        BinaryTree.print(x, "x");
        System.setOut(oldOut);
        assertEquals("x in preorder\r\n" +
                        "A B C D E \r\n" +
                        "x in inorder\r\n" +
                        "B A D C E \r\n\r\n".trim(),
                outContent.toString().trim());
    }
}
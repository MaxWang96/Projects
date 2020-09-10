package bearmaps.test;

import bearmaps.utils.NodeTrie;
import bearmaps.utils.TrieSet;
import bearmaps.utils.graph.streetmap.Node;
import edu.princeton.cs.algs4.TrieSET;
import org.junit.Test;

import java.util.LinkedList;
import java.util.List;
import java.util.Random;

public class TestTrie {
    @Test
    public void testTrieString() {
        List<String> toReturn = new LinkedList<>();
        NodeTrie toTest = new NodeTrie();
        toTest.keysWithPrefix("j").forEach(toReturn::add);
        System.out.println(toReturn);
        System.out.println(toTest.size());
    }

    @Test
    public void testTrieNode() {
        Node a = Node.of(111L, 11.0, 11.0);
        a.setName("java");
        Node b = Node.of(11, 11, 11);
        b.setName("jAva");
        Node c = Node.of(1133, 11, 11);
        c.setName("4 jix");
        TrieSet toTest = new TrieSet();
        toTest.add(a);
        toTest.add(b);
        toTest.add(c);
        List<String> toReturn = new LinkedList<>(toTest.keysWithPrefix(" "));
        System.out.println(toReturn);
    }

    @Test
    public void fuzzTest() {
        TrieSet toTest = new TrieSet();
        Random generator = new Random();
        for (int i = 0; i <= 100000; i++) {
            Node a = Node.of(generator.nextLong(), generator.nextDouble(), generator.nextDouble());
            String b = java.util.UUID.randomUUID().toString().substring(0, 10);
            a.setName(b);
            toTest.add(a);
        }
    }

    @Test
    public void fuzzTestP() {
        TrieSET toTest = new TrieSET();
        for (int i = 0; i <= 100000; i++) {
            String b = java.util.UUID.randomUUID().toString().substring(0, 10);
            toTest.add(b);
        }
    }
}

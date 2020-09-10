package bearmaps.utils.ps;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static org.junit.Assert.assertEquals;

public class KDTreeTest {


    @Test
    public void fuzzTest() {
        List<Point> toTest = new ArrayList<>();
        Random generator = new Random();
        for (int i = 0; i <= 100000; i++) {
            toTest.add(new Point(generator.nextDouble(), generator.nextDouble()));
        }
        KDTree tree = new KDTree(toTest);
        NaivePointSet set = new NaivePointSet(toTest);
        long t1 = System.currentTimeMillis();
        for (int j = 0; j <= 10000; j++) {
            tree.nearest(generator.nextDouble(), generator.nextDouble());
        }
        long t2 = System.currentTimeMillis();
        for (int k = 0; k <= 10000; k++) {
            set.nearest(generator.nextDouble(), generator.nextDouble());
        }
        long t3 = System.currentTimeMillis();
//        System.out.println((t3 - t2) / (t2 - t1));
        assertEquals(tree.nearest(0, 0), set.nearest(0, 0));
    }
}
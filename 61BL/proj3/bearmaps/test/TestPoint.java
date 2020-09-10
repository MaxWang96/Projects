package bearmaps.test;

import bearmaps.utils.ps.KDTree;
import bearmaps.utils.ps.NaivePointSet;
import bearmaps.utils.ps.Point;
import org.junit.Test;
import static org.junit.Assert.*;

import java.util.List;

public class TestPoint {
    @Test
    public void miniTest() {
        Point p1 = new Point(1.1, 2.2); // constructs a Point with x = 1.1, y = 2.2
        Point p2 = new Point(3.3, 4.4);
        Point p3 = new Point(-2.9, 4.2);

        NaivePointSet nn = new NaivePointSet(List.of(p1, p2, p3));
        Point ret = nn.nearest(3.0, 4.0); // returns p2
        assertEquals(3.3, ret.getX(), .01); // evaluates to 3.3
        assertEquals(4.4, ret.getY(), .01); // evaluates to 4.4
    }

    @Test
    public void testNearest() {
        KDTree toTest = defaultTree();
        System.out.println(toTest.nearest(-1, 5));
    }

    private KDTree defaultTree() {
        Point p1 = new Point(1.1, 2.2);
        Point p2 = new Point(3.3, 4.4);
        Point p3 = new Point(-2.9, 4.2);
        Point p4 = new Point(-1, 5.2);
        Point p5 = new Point(0, 0);
        Point p6 = new Point(7, -4);

        return new KDTree(List.of(p1, p2, p3, p4, p5, p6));
    }
}

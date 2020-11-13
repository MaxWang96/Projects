package bearmaps.utils.ps;

import java.util.ArrayList;
import java.util.List;

public class NaivePointSet implements PointSet {
    private final List<Point> lst;

    public NaivePointSet(List<Point> points) {
        lst = points;
    }

    @Override
    public Point nearest(double x, double y) {
        Point p = new Point(x, y);
        Point nearest = lst.get(0);
        for (Point point : lst) {
            if (Point.distance(point, p) < Point.distance(nearest, p)) {
                nearest = point;
            }
        }
        return nearest;
    }
}

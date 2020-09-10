package bearmaps.utils.ps;

public class PointCompare implements Comparable<Point>{
    @Override
    public int compareTo(Point o) {
        return 0;
    }


    public static int sortByX(Point p1, Point p2) {
        return Double.compare(p1.getX(), p2.getX());
    }

    public static int sortByY(Point p1, Point p2) {
        return Double.compare(p1.getY(), p2.getY());
    }
}

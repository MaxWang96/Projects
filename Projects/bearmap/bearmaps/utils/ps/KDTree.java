package bearmaps.utils.ps;

import java.util.ArrayList;
import java.util.List;

public class KDTree {
    private final KDTreeNode root;

    public KDTree(List<Point> points) {
        List<Point> pointsLst = new ArrayList<>(points);
        pointsLst.sort(PointCompare::sortByX);
        root = new KDTreeNode(pointsLst.get(pointsLst.size() / 2));
        root.buildTreeHelper(pointsLst, 1);
    }

    public Point nearest(double x, double y) {
        Point toFind = new Point(x, y);
        return nearestHelper(toFind, root.item, root, 1);
    }

    private Point nearestHelper(Point toFind, Point best, KDTreeNode node, int step) {
        if (node == null) {
            return best;
        }
        if (Point.distance(node.item, toFind) < Point.distance(best, toFind)) {
            best = node.item;
        }
        KDTreeNode goodSide;
        KDTreeNode badSide;
        if (step == 1) {
            if (toFind.getX() < node.item.getX()) {
                goodSide = node.left;
                badSide = node.right;
            } else {
                goodSide = node.right;
                badSide = node.left;
            }
        } else {
            if (toFind.getY() < node.item.getY()) {
                goodSide = node.left;
                badSide = node.right;
            } else {
                goodSide = node.right;
                badSide = node.left;
            }
        }
        best = nearestHelper(toFind, best, goodSide, -step);
        if (checkBadSide(toFind, best, node, step)) {
            best = nearestHelper(toFind, best, badSide, -step);
        }
        return best;
    }

    private boolean checkBadSide(Point toFind, Point best, KDTreeNode node, int step) {
        return (step == 1
                && (Point.distance(toFind, best) > Math.pow(node.item.getX() - toFind.getX(), 2)))
                || (step == -1)
                && (Point.distance(toFind, best) > Math.pow(node.item.getY() - toFind.getY(), 2));
    }

    private static class KDTreeNode {
        private final Point item;
        private KDTreeNode left;
        private KDTreeNode right;

        private KDTreeNode(Point item) {
            this.item = item;
        }

        private KDTreeNode(Point item, KDTreeNode left, KDTreeNode right) {
            this.item = item;
            this.left = left;
            this.right = right;
        }

        private void buildTreeHelper(List<Point> points, int step) {
            if (points.size() <= 1) {
                return;
            }
            List<Point> pointsLeft = points.subList(0, points.size() / 2);
            List<Point> pointsRight = points.subList(points.size() / 2 + 1, points.size());
            if (step == 1) {
                pointsLeft.sort(PointCompare::sortByY);
                pointsRight.sort(PointCompare::sortByY);
            } else {
                pointsLeft.sort(PointCompare::sortByX);
                pointsRight.sort(PointCompare::sortByX);
            }
            left = new KDTreeNode(pointsLeft.get(pointsLeft.size() / 2));
            left.buildTreeHelper(pointsLeft, -step);
            if (!pointsRight.isEmpty()) {
                right = new KDTreeNode(pointsRight.get(pointsRight.size() / 2));
                right.buildTreeHelper(pointsRight, -step);
            }
        }
    }
}

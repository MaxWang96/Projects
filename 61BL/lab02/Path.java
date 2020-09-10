/** A class that represents a path via pursuit curves. */
public class Path {
  public Point curr = new Point();
  public Point next = new Point();

  public Path(double x, double y){
    curr.setX(0);
    curr.setY(0);
    next.setX(x);
    next.setY(y);
  }

  public double getCurrX(){
    return curr.getX();
  }

  public double getCurrY(){
    return curr.getY();
  }

  public double getNextX(){
    return next.getX();
  }

  public double getNextY(){
    return next.getY();
  }

  public Point getCurrentPoint(){
    return curr;
  }

  public void setCurrentPoint(Point point){
    curr = point;
  }

  public void iterate(double dx, double dy){
    curr = next;
    next = new Point(getNextX() + dx, getNextY() + dy);
  }


    // TODO

}

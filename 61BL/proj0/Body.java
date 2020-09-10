public class Body {
    public double xxPos;
    public double yyPos;
    public double xxVel;
    public double yyVel;
    public double mass;
    public String imgFileName;
    private static final double G = 6.67e-11;

    public Body(double xP, double yP, double xV, double yV, double m, String img) {
        xxPos = xP;
        yyPos = yP;
        xxVel = xV;
        yyVel = yV;
        mass = m;
        imgFileName = img;
    }

    public Body(Body p) {
        xxPos = p.xxPos;
        yyPos = p.yyPos;
        xxVel = p.xxVel;
        yyVel = p.yyVel;
        mass = p.mass;
        imgFileName = p.imgFileName;
    }

    public double calcDistance(Body p) {
        double distance;
        distance = Math.sqrt((p.xxPos - this.xxPos) * (p.xxPos - this.xxPos) + (p.yyPos - this.yyPos) * (p.yyPos - this.yyPos));
        return distance;
    }

    public double calcForceExertedBy(Body p) {
        double force;
        force = G * this.mass * p.mass / ((this.calcDistance(p)) * (this.calcDistance(p)));
        return force;
    }

    public double calcForceExertedByX(Body p) {
        double forceX = this.calcForceExertedBy(p) * (p.xxPos - this.xxPos) / this.calcDistance(p);
        return forceX;
    }

    public double calcForceExertedByY(Body p) {
        double forceY = this.calcForceExertedBy(p) * (p.yyPos - this.yyPos) / this.calcDistance(p);
        return forceY;
    }

    public double calcNetForceExertedByX(Body[] allBodies) {
        double netForceX = 0, oneForceX;
        for (Body n : allBodies) {
            if (!(n.equals(this))) {
                oneForceX = this.calcForceExertedByX(n);
                netForceX += oneForceX;
            }
        }
        return netForceX;
    }

    public double calcNetForceExertedByY(Body[] allBodies) {
        double netForceY = 0, oneForceY;
        for (Body n : allBodies) {
            if (!(n.equals(this))) {
                oneForceY = this.calcForceExertedByY(n);
                netForceY += oneForceY;
            }
        }
        return netForceY;
    }

    public void update(double dt, double fX, double fY) {
        double aX = fX / this.mass;
        double aY = fY / this.mass;
        this.xxVel += aX * dt;
        this.yyVel += aY * dt;
        this.xxPos += xxVel * dt;
        this.yyPos += yyVel * dt;
    }

    public void draw() {
        StdDraw.picture(this.xxPos, this.yyPos, "images/" + this.imgFileName);
    }
}

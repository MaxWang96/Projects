public class NBody {
    public static final double A = 0;

    public static double readRadius(String fileName) {
        In in = new In(fileName);
        int bodies = in.readInt();
        double radius = in.readDouble();
        return radius;
    }

    public static Body[] readBodies(String fileName) {
        In in = new In(fileName);
        int num = in.readInt();
        Body[] Bodies = new Body[num];
        double radius = in.readDouble();
//        int index = 0;
        for (int i = 0; i <= num - 1; i++) {
            double xxPos = in.readDouble();
            double yyPos = in.readDouble();
            double xxVel = in.readDouble();
            double yyVel = in.readDouble();
            double mass = in.readDouble();
            String imgFileName = in.readString();
            Bodies[i] = new Body(xxPos, yyPos, xxVel, yyVel, mass, imgFileName);
//            index++;
        }
        return Bodies;
    }

    public static void main(String[] arg) {
        double T = Double.parseDouble(arg[0]); //source: Stack Overflow
        double dt = Double.parseDouble(arg[1]);
        String filename = arg[2];
        double radius = readRadius(filename);
        Body[] bodies = readBodies(filename);

        StdDraw.enableDoubleBuffering();
        StdDraw.setScale(-radius, radius);
//        StdAudio.play("audio/2001.mid");

        for (double t = 0; t <= T; t += dt) {
            double[] xForces = new double[bodies.length];
            double[] yForces = new double[bodies.length];
//            int index = 0;
            for (int i = 0; i <= bodies.length - 1; i++) {
                xForces[i] = bodies[i].calcNetForceExertedByX(bodies);
                yForces[i] = bodies[i].calcNetForceExertedByY(bodies);
            }
            for (int i = 0; i <= bodies.length - 1; i++) {
                bodies[i].update(dt, xForces[i], yForces[i]);
            }
            StdDraw.picture(0, 0, "images/starfield.jpg");
            for (Body b : bodies) {
                b.draw();
            }
            StdDraw.show();
            StdDraw.pause(10);
        }
        StdOut.printf("%d\n", bodies.length);
        StdOut.printf("%.2e\n", radius);
        for (int i = 0; i < bodies.length; i += 1) {
            StdOut.printf("%11.4e %11.4e %11.4e %11.4e %11.4e %12s\n",
                    bodies[i].xxPos, bodies[i].yyPos, bodies[i].xxVel,
                    bodies[i].yyVel, bodies[i].mass, bodies[i].imgFileName);
        }
    }
}

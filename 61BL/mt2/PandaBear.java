public class PandaBear extends Bear implements Comparable<PandaBear> {
    public PandaBear(int[] supply, int w) {
        super(supply, w);
    }

    @Override
    public int compareTo(PandaBear bear) {
        if (this.equals(bear)) {
            return 0;
        }
        if (weight < bear.weight) {
            return -1;
        } else if (weight > bear.weight) {
            return 1;
        } else {
            if (foodSupply == null) {
                return -1;
            } else if (bear.foodSupply == null) {
                return 1;
            }
            for (int i = 0; i <= foodSupply.length - 1; i++) {
                if (i > bear.foodSupply.length - 1) {
                    return 1;
                } else {
                    if (foodSupply[i] < bear.foodSupply[i]) {
                        return -1;
                    } else if (foodSupply[i] > bear.foodSupply[i]) {
                        return 1;
                    }
                }
            }
        }
        return -1;
    }
}
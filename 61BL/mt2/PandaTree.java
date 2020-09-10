public class PandaTree {
    private PandaNode root;
    private PandaBear mostRisk;
    private PandaBear leastRisk;

    public PandaTree(PandaBear bear) {
        this.root = new PandaNode(bear, null, null);
        mostRisk = root.item;
        leastRisk = root.item;
    }

    // returns the most at risk bear
    public PandaBear mostAtRisk() {
        return mostRisk;
    }

    // returns the least at risk bear
    public PandaBear leastAtRisk() {
        return leastRisk;
    }

    // adds bear to tree if and only if bear not already in tree
    public void add(PandaBear bear) {
        add(bear, this.root);
        if (bear.compareTo(mostRisk) < 0) {
            mostRisk = bear;
        }
        if (bear.compareTo(leastRisk) > 0) {
            leastRisk = bear;
        }
    }

    private PandaNode add(PandaBear bear, PandaNode node) {
        if (node == null) {
            return new PandaNode(bear, null, null);
        }
        if (node.item.compareTo(bear) > 0) {
            node.left = add(bear, node.left);
        } else if (node.item.compareTo(bear) < 0) {
            node.right = add(bear, node.right);
        }
        return node;
    }

    private class PandaNode {
        private PandaBear item;
        private PandaNode left;
        private PandaNode right;

        private PandaNode(PandaBear bear, PandaNode l, PandaNode r) {
            this.item = bear;
            this.left = l;
            this.right = r;
        }
    }

}
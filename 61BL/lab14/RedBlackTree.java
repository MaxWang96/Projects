public class RedBlackTree<T extends Comparable<T>> {

    /* Root of the tree. */
    RBTreeNode<T> root;

    /* Creates an empty RedBlackTree. */
    public RedBlackTree() {
        root = null;
    }

    /* Creates a RedBlackTree from a given BTree (2-3-4) TREE. */
    public RedBlackTree(BTree<T> tree) {
        Node<T> btreeRoot = tree.root;
        root = buildRedBlackTree(btreeRoot);
    }

    /* Builds a RedBlackTree that has isometry with given 2-3-4 tree rooted at
       given node R, and returns the root node. */
    RBTreeNode<T> buildRedBlackTree(Node<T> r) {
        if (r == null) {
            return null;
        }

        if (r.getItemCount() == 1) {
            root = new RBTreeNode<T>(true, r.getItemAt(0), buildRedBlackTree(r.getChildAt(0)), buildRedBlackTree(r.getChildAt(1)));
            return root;
        } else if (r.getItemCount() == 2) {
            root = new RBTreeNode<T>(true, r.getItemAt(1),
                    new RBTreeNode<T>(false, r.getItemAt(0), buildRedBlackTree(r.getChildAt(0)), buildRedBlackTree(r.getChildAt(1))),
                    buildRedBlackTree(r.getChildAt(2)));
            return root;
        } else {
            root = new RBTreeNode<T>(true, r.getItemAt(1),
                    new RBTreeNode<T>(false, r.getItemAt(0), buildRedBlackTree(r.getChildAt(0)), buildRedBlackTree(r.getChildAt(1))),
                    new RBTreeNode<T>(false, r.getItemAt(2), buildRedBlackTree(r.getChildAt(2)), buildRedBlackTree(r.getChildAt(3))));
            return root;
        }
    }

    /* Flips the color of NODE and its children. Assume that NODE has both left
       and right children. */
    void flipColors(RBTreeNode<T> node) {
        node.isBlack = !node.isBlack;
        node.left.isBlack = !node.left.isBlack;
        node.right.isBlack = !node.right.isBlack;
    }

    /* Rotates the given node NODE to the right. Returns the new root node of
       this subtree. */
    RBTreeNode<T> rotateRight(RBTreeNode<T> node) {
        node.left.isBlack = node.isBlack;
        node.isBlack = false;
        RBTreeNode<T> tmp = node.left;
        node.left = tmp.right;
        tmp.right = node;
        return tmp;
    }

    /* Rotates the given node NODE to the left. Returns the new root node of
       this subtree. */
    RBTreeNode<T> rotateLeft(RBTreeNode<T> node) {
        node.right.isBlack = node.isBlack;
        node.isBlack = false;
        RBTreeNode<T> tmp = node.right;
        node.right = tmp.left;
        tmp.left = node;
        return tmp;
    }

    public void insert(T item) {
        root = insert(root, item);
        root.isBlack = true;
    }

    private RBTreeNode<T> insert(RBTreeNode<T> node, T item) {
        if (node == null) {
            return new RBTreeNode<>(false, item);
        }
        if (node.item.compareTo(item) < 0) {
            node.right = insert(node.right, item);
        } else if (node.item.compareTo(item) > 0) {
            node.left = insert(node.left, item);
        }
        if (node.isBlack && node.left == null && isRed(node.right)) {
            node = rotateLeft(node);
        }
        if (isRed(node.left) && isRed(node.left.right)) {
            node.left = rotateLeft(node.left);
        }
        if (isRed(node.left) && isRed(node.left.left)) {
            node = rotateRight(node);
        }
        if (node.isBlack && isRed(node.right)) {
            flipColors(node);
        }


        return node;
    }

    private void checkCaseLeft(RBTreeNode<T> node) {
    }

    private void checkCaseRight(RBTreeNode<T> node) {
        if (node.isBlack) {
            if (node.left == null) {
                rotateLeft(node);
            } else {
                case2A(node);
            }
        } else {
            case2C(node);
        } 
    }

    private void case2C(RBTreeNode<T> node) {
        rotateLeft(node);
    }

    private void case2B(RBTreeNode<T> node) {
        node = rotateRight(node);
        case2A(node);
    }


    private void case2A(RBTreeNode<T> node) {
        flipColors(node);
    }

    /* Returns whether the given node NODE is red. Null nodes (children of leaf
       nodes are automatically considered black. */
    private boolean isRed(RBTreeNode<T> node) {
        return node != null && !node.isBlack;
    }

    static class RBTreeNode<T> {

        final T item;
        boolean isBlack;
        RBTreeNode<T> left;
        RBTreeNode<T> right;

        /* Creates a RBTreeNode with item ITEM and color depending on ISBLACK
           value. */
        RBTreeNode(boolean isBlack, T item) {
            this(isBlack, item, null, null);
        }

        /* Creates a RBTreeNode with item ITEM, color depending on ISBLACK
           value, left child LEFT, and right child RIGHT. */
        RBTreeNode(boolean isBlack, T item, RBTreeNode<T> left,
                   RBTreeNode<T> right) {
            this.isBlack = isBlack;
            this.item = item;
            this.left = left;
            this.right = right;
        }
    }

}

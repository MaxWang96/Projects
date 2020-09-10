import java.util.ArrayList;

public class BinaryTree<T> {

    protected TreeNode root;

    public BinaryTree() {
        root = null;
    }

    public BinaryTree(TreeNode t) {
        root = t;
    }

    public BinaryTree(ArrayList<T> pre, ArrayList<T> in) {
        if (pre == null) {
            root = null;
        } else {
            root = new TreeNode(pre.get(0));
            root.arrayConstructHelper(pre, in);
        }
    }

    /* Print the values in the tree in preorder. */
    public void printPreorder() {
        if (root == null) {
            System.out.println("(empty tree)");
        } else {
            root.printPreorder();
            System.out.println();
        }
    }

    /* Print the values in the tree in inorder. */
    public void printInorder() {
        if (root == null) {
            System.out.println("(empty tree)");
        } else {
            root.printInorder();
            System.out.println();
        }
    }

    /* Prints the BinaryTree in preorder or in inorder. Used for your testing. */
    protected static void print(BinaryTree t, String description) {
        System.out.println(description + " in preorder");
        t.printPreorder();
        System.out.println(description + " in inorder");
        t.printInorder();
        System.out.println();
    }

    protected class TreeNode {

        T item;
        TreeNode left;
        TreeNode right;
        int size = 0;

        public TreeNode(T item) {
            this.item = item;
            left = right = null;
        }

        public TreeNode(T item, TreeNode left, TreeNode right) {
            this.item = item;
            this.left = left;
            this.right = right;
        }

        /* Prints the nodes of the BinaryTree in preorder. Used for your testing. */
        private void printPreorder() {
            System.out.print(item + " ");
            if (left != null) {
                left.printPreorder();
            }
            if (right != null) {
                right.printPreorder();
            }
        }

        /* Prints the nodes of the BinaryTree in inorder. Used for your testing. */
        private void printInorder() {
            if (left != null) {
                left.printInorder();
            }
            System.out.print(item + " ");
            if (right != null) {
                right.printInorder();
            }
        }

        public <t extends Comparable<t>> boolean containsHelper(t key) {
            if (key.compareTo((t) item) == 0) {
                return true;
            } else if (key.compareTo((t) item) < 0) {
                if (left == null) {
                    return false;
                }
                return left.containsHelper(key);
            } else {
                if (right == null) {
                    return false;
                }
                return right.containsHelper(key);
            }
        }

        public <t extends Comparable<t>> void addHelper(t key) {
            if (key.compareTo((t) item) < 0) {
                if (left == null) {
                    left = new TreeNode((T) key);
                } else {
                    left.addHelper(key);
                }
            } else if (key.compareTo((t) item) > 0) {
                if (right == null) {
                    right = new TreeNode((T) key);
                } else {
                    right.addHelper(key);
                }
            }
        }

        public void arrayConstructHelper(ArrayList<T> pre, ArrayList<T> in) {
            int rootIndex = in.indexOf(pre.get(0));
            ArrayList<T> leftIn = new ArrayList<>(in.subList(0, rootIndex));
            if (leftIn.size() != 0) {
                ArrayList<T> leftPre = new ArrayList<>(pre.subList(1, 1 + rootIndex));
                left = new TreeNode(leftPre.get(0));
                left.arrayConstructHelper(leftPre, leftIn);
            }
            ArrayList<T> rightIn = new ArrayList<>(in.subList(rootIndex + 1, in.size()));
            if (rightIn.size() != 0) {
                ArrayList<T> rightPre = new ArrayList<>(pre.subList(rootIndex + 1, pre.size()));
                right = new TreeNode(rightPre.get(0));
                right.arrayConstructHelper(rightPre, rightIn);
            }
        }
    }
}
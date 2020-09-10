import java.util.*;

public class BTree<T extends Comparable<T>> {
    Node<T> root;

    static class Node<T> {
        private List<T> items;
        private List<Node<T>> children;

        private List<T> helper(List<T> lst) {
            for (int i = 0; i < children.size(); i++) {
                if (i == 1 || (i == 0 && children.size() == 1)) {
                    lst.addAll(items);
                }
                children.get(i).helper(lst);
            }
            if (children.size() == 0) {
                lst.addAll(items);
            }
            return lst;
        }

        Node(List<T> items, List<Node<T>> children) {
            this.items = items;
            this.children = children;
        }
    }

    public List<T> inorderTraversal() {
        if (root != null) {
            return root.helper(new ArrayList<>());
        }
        return null;
    }
}
package gitlet;
import java.util.*;

public class CommitTree {

    TreeNode root;

    public CommitTree(String commit) {
        root = new TreeNode(commit);
        root.buildTree();
    }

    public boolean contains(String commitId) {
        return root.containHelper(commitId);
    }

    public String findSplitPoint(CommitTree givenBranch) {
        HashSet<TreeNode> current = new HashSet<>(Collections.singletonList(this.root));
        while (true) {
            HashSet<TreeNode> next = new HashSet<>();
            for (TreeNode n : current) {
                if (givenBranch.contains(n.id)) {
                    return n.id;
                }
                if (n.firstParent != null) {
                    next.add(n.firstParent);
                }
                if (n.secondParent != null) {
                    next.add(n.secondParent);
                }
            }
            current = next;
        }
    }

    public String getRootId() {
        return root.id;
    }

    private static class TreeNode {
        String id;
        TreeNode firstParent;
        TreeNode secondParent;

        public TreeNode(String commit) {
            id = commit;
        }

        public void buildTree() {
            Commit commit = Commit.commitWithId(this.id);
            if (commit.getPrev() != null) {
                firstParent = new TreeNode(commit.getPrev());
                firstParent.buildTree();
            }
            if (commit.getSecondParent() != null) {
                secondParent = new TreeNode(commit.getSecondParent());
                secondParent.buildTree();
            }
        }

        public boolean containHelper(String commitId) {
            if (commitId.equals(id)) {
                return true;
            } else if (firstParent == null) {
                return false;
            } else if (secondParent != null) {
                return firstParent.containHelper(commitId) || secondParent.containHelper(commitId);
            } else {
                return firstParent.containHelper(commitId);
            }
        }
    }
}

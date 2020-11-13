package gitlet;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class HistoryTree {
    private final TreeNode root;

    public HistoryTree(String commitID) {
        root = new TreeNode(commitID);
        root.buildHelper();
    }

    public String getRootID() {
        return root.commitID;
    }

    public boolean contains(String id) {
        return root.containHelper(id);
    }

    public String findSplit(HistoryTree branchHistory) {
        Set<TreeNode> compare = new HashSet<>(Collections.singletonList(root));
        Set<TreeNode> tmp;
        while (true) {
            tmp = new HashSet<>();
            for (TreeNode node : compare) {
                if (branchHistory.contains(node.commitID)) {
                    return node.commitID;
                }
            }
            for (TreeNode node : compare) {
                tmp.addAll(node.getParents());
            }
            compare = tmp;
        }
    }

    public void pushCommits(String path, String branchName) throws IOException {
        Set<String> blobs = new HashSet<>();
        if (!Utils.join(path, "branches", branchName).exists()) {
            root.pushCommitsHelper(path, blobs);
        }
    }

    private static class TreeNode {
        private final String commitID;
        private TreeNode firstParent;
        private TreeNode secondParent;

        TreeNode(String commitID) {
            this.commitID = commitID;
        }

        public void buildHelper() {
            Comi currCommit = UtilsExtend.getComi(commitID);
            List<String> parents = currCommit.getParents();
            if (parents.size() == 1) {
                firstParent = new TreeNode(parents.get(0));
                firstParent.buildHelper();
            } else if (parents.size() == 2) {
                firstParent = new TreeNode(parents.get(0));
                firstParent.buildHelper();
                secondParent = new TreeNode(parents.get(1));
                secondParent.buildHelper();
            }
        }

        public boolean containHelper(String id) {
            if (commitID.equals(id)) {
                return true;
            } else if (firstParent == null) {
                return false;
            } else if (secondParent != null) {
                return firstParent.containHelper(id)
                        || secondParent.containHelper(id);
            } else {
                return firstParent.containHelper(id);
            }
        }

        public Set<TreeNode> getParents() {
            Set<TreeNode> parents = new HashSet<>();
            if (firstParent != null) {
                parents.add(firstParent);
            }
            if (secondParent != null) {
                parents.add(secondParent);
            }
            return parents;
        }

        public void pushCommitsHelper(String path, String commit, Set<String> blobs) {
            if (firstParent.commitID.equals(commit)) {

            }
        }

        public void pushCommitsHelper(String path, Set<String> blobs) throws IOException {
            if (firstParent == null) {
                copy(path, blobs);
            } else {
                copy(path, blobs);
                firstParent.pushCommitsHelper(path, blobs);
                if (secondParent != null) {
                    secondParent.pushCommitsHelper(path, blobs);
                }
            }
        }

        private void copy(String path, Set<String> blobs) throws IOException {
            Files.copy(Utils.join(".gitlet", "commit", commitID).toPath(),
                    Utils.join(path, "commit", commitID).toPath());
            blobs.addAll(UtilsExtend.getBlobValue(commitID));
        }
    }
}

package gitlet;

import java.io.File;
import java.io.Serializable;
import java.util.*;

public class Branch implements Serializable {
    public static final File BRANCH = Utils.join(".gitlet", "branches");
    private String head;
    private String currentBranch;
    private HashMap<String, String> branches;

    public Branch(String CommitId) {
        head = CommitId;
        currentBranch = "master";
        branches = new HashMap<>();
        branches.put(currentBranch, head);
        Utils.writeObject(BRANCH, this);
    }

    public static String head() {
        return Utils.readObject(BRANCH, Branch.class).getHead();
    }

    public static void updateHead(String commitId) {
        Branch branch = Utils.readObject(BRANCH, Branch.class);
        branch.setHead(commitId);
        branch.branches.put(branch.getCurrentBranch(), commitId);
        Utils.writeObject(BRANCH, branch);
    }

    public static HashMap<String, String> branches() {
        return Utils.readObject(BRANCH, Branch.class).getBranches();
    }

    public static String currentBranch() {
        return Utils.readObject(BRANCH, Branch.class).getCurrentBranch();
    }

    public static String headOfBranch(String BranchName) {
        return Utils.readObject(BRANCH, Branch.class).getBranches().get(BranchName);
    }

    public static void createNewBranch(String branchName) {
        Branch branch = Utils.readObject(BRANCH, Branch.class);
        branch.branches.put(branchName, branch.head);
        Utils.writeObject(BRANCH, branch);
    }

    public static void removeBranch(String branchName) {
        Branch branch = Utils.readObject(BRANCH, Branch.class);
        branch.branches.remove(branchName);
        Utils.writeObject(BRANCH, branch);
    }

    public static void checkoutBranch(String branchName) {
        Branch branch = Utils.readObject(BRANCH, Branch.class);
        branch.setCurrentBranch(branchName);
        branch.setHead(branch.branches.get(branchName));
        Utils.writeObject(BRANCH, branch);
    }

    public String getHead() {
        return head;
    }

    public String getCurrentBranch() {
        return currentBranch;
    }

    public HashMap<String, String> getBranches() {
        return branches;
    }

    public void setHead(String commitId) {
        head = commitId;
    }

    public void setCurrentBranch(String branchName) {
        currentBranch = branchName;
    }

}

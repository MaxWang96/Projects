package gitlet;

import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * Driver class for Gitlet, the tiny stupid version-control system.
 *
 * @author Zhaodong Wang
 */
public class Main {
    static final File REPO = new File(".gitlet");
    static final File COMMIT = Utils.join(".gitlet", "commit");
    static final File TMP = Utils.join(".gitlet", "tmp"); // used to store new commit info temporarily
    static final File BRANCHES = Utils.join(".gitlet", "branches");
    static final File STAGE = Utils.join(".gitlet", "stage");
    static final File BLOB = Utils.join(".gitlet", "blob");
    static final File HEAD = Utils.join(".gitlet", "HEAD");
    static final File REMOTE = Utils.join(".gitlet", "remote");


    /**
     * Usage: java gitlet.Main ARGS, where ARGS contains
     * <COMMAND> <OPERAND> ....
     */
    public static void main(String... args) {
        if (args.length == 0) {
            exitWithError("Please enter a command.");
        }
        switch (args[0]) {
            case "init":
                checkInputInit(args);
                init();
                break;
            case "add":
                checkInput(args, 2);
                add(args[1]);
                break;
            case "commit":
                checkInputCommit(args);
                commit(args[1]);
                break;
            case "rm":
                checkInput(args, 2);
                rm(args[1]);
                break;
            case "log":
                checkInput(args, 1);
                log();
                break;
            case "global-log":
                checkInput(args, 1);
                globalLog();
                break;
            case "find":
                checkInput(args, 2);
                find(args[1]);
                break;
            case "status":
                checkInput(args, 1);
                status();
                break;
            case "checkout":
                checkInputCheckout(args);
                checkout(args);
                break;
            case "branch":
                checkInput(args, 2);
                branch(args[1]);
                break;
            case "rm-branch":
                checkInput(args, 2);
                rmBranch(args[1]);
                break;
            case "reset":
                checkInput(args, 2);
                reset(args[1]);
                break;
            case "merge":
                checkInput(args, 2);
                merge(args[1]);
                break;
            case "add-remote":
                checkInput(args, 3);
                addRemote(args);
                break;
            case "rm-remote":
                checkInput(args, 2);
                rmRemote(args[1]);
                break;
            case "push":
                checkInput(args, 3);
                push(args);
                break;
            default:
                exitWithError("No command with that name exists.");
        }
    }

    private static void push(String[] args) throws IOException {
        String path = Utils.readContentsAsString(Utils.join(REMOTE, args[1]));
        if (!new File(path).exists()) {
            exitWithError("Remote directory not found.");
        }
        HistoryTree currHistory = new HistoryTree(UtilsExtend.getCurrHead());
        currHistory.pushCommits(path, args[2]);

    }

    private static void rmRemote(String remote) {
        List<String> remoteName = Utils.plainFilenamesIn(REMOTE);
        if (remoteName == null || !remoteName.contains(remote)) {
            exitWithError("A remote with that name does not exist.");
        }
        Utils.join(REMOTE, remote).delete();
    }

    private static void addRemote(String[] args) {
        List<String> remoteName = Utils.plainFilenamesIn(REMOTE);
        if (remoteName != null && remoteName.contains(args[1])) {
            exitWithError("A remote with that name already exists.");
        }
        String[] pathSplit = args[2].split("/");
        String path = String.join(File.separator, pathSplit);
        new File(path).mkdir();
        Utils.join(path, "blob").mkdir();
        Utils.join(path, "branches").mkdir();
        Utils.join(path, "commit").mkdir();
        Utils.writeContents(Utils.join(REMOTE, args[1]), path);
    }


    private static void merge(String branchName) {
        Stage stage = Utils.readObject(STAGE, Stage.class);
        if (!stage.isEmpty()) {
            exitWithError("You have uncommitted changes.");
        }
        String splitPoint = findSplit(branchName);
        String currCommit = UtilsExtend.getCurrHead();
        String branchCommit = UtilsExtend.getBranchHead(branchName);
        Map<String, String> overwrite = new HashMap<>();
        Set<String> remove = new HashSet<>();
        Map<String, List<String>> conflicts = new HashMap<>();
        List<String> tracked = new ArrayList<>(UtilsExtend.getComi(currCommit).getBlobs().keySet());
        List<String> untracked = new ArrayList<>(Utils.plainFilenamesIn("."));
        untracked.removeAll(tracked);
        Map<String, String> modifiedBranch = UtilsExtend.getModified(splitPoint, branchCommit);
        Map<String, String> modifiedCurr = UtilsExtend.getModified(splitPoint, currCommit);
        overwrite.putAll(onlyModifiedInBranch(modifiedBranch, modifiedCurr));
        Map<String, String> presentBranch = UtilsExtend.getPresent(splitPoint, branchCommit);
        Map<String, String> presentCurr = UtilsExtend.getPresent(splitPoint, currCommit);
        overwrite.putAll(onlyPresentInBranch(presentBranch, presentCurr));
        Map<String, String> presentSplitBranch = UtilsExtend.getPresent(branchCommit, splitPoint);
        Map<String, String> presentSplitCurr = UtilsExtend.getPresent(currCommit, splitPoint);
        Set<String> unmodifiedCurr = UtilsExtend.getUnmodified(splitPoint, currCommit);
        remove.addAll(onlyPresentInSplit(new HashSet<>(presentSplitBranch.keySet()), unmodifiedCurr));
        conflicts.putAll(modifiedInBoth(modifiedBranch, modifiedCurr));
        conflicts.putAll(deletedInOne(modifiedCurr, modifiedBranch, presentSplitCurr, presentSplitBranch));
        conflicts.putAll(presentInBoth(presentBranch, presentCurr));
        if (!Collections.disjoint(untracked, overwrite.keySet()) || !Collections.disjoint(untracked, conflicts.keySet())) {
            exitWithError("There is an untracked file in the way; delete it, or add and commit it first.");
        }
        UtilsExtend.writeContentsInBatch(overwrite);
        stageInBatch(overwrite);
        rmInBatch(remove);
        for (String fileName : conflicts.keySet()) {
            replaceFile(fileName, conflicts.get(fileName).get(0), conflicts.get(fileName).get(1));
        }
        if (!conflicts.isEmpty()) {
            System.out.println("Encountered a merge conflict.");
        }
        commit(String.format("Merged %s into %s.", branchName, Utils.readContentsAsString(HEAD)), branchName);
    }


    private static Map<String, List<String>> presentInBoth(Map<String, String> presentBranch, Map<String, String> presentCurr) {
        Map<String, List<String>> conflicts = new HashMap<>();
        for (String fileName : presentBranch.keySet()) {
            if (presentCurr.containsKey(fileName)) {
                if (!presentBranch.get(fileName).equals(presentCurr.get(fileName))) {
                    conflicts.put(fileName, List.of(presentCurr.get(fileName), presentBranch.get(fileName)));
                }
            }
        }
        return conflicts;
    }

    private static Map<String, List<String>> deletedInOne(Map<String, String> currModified, Map<String, String> givenModified, Map<String, String> currDeleted, Map<String, String> givenDeleted) {
        Map<String, String> tmpCurr = new HashMap<>(currModified);
        tmpCurr.keySet().retainAll(givenDeleted.keySet());
        Map<String, List<String>> conflicts = new HashMap<>();
        for (String s : tmpCurr.keySet()) {
            conflicts.put(s, List.of(tmpCurr.get(s), ""));
        }
        Map<String, String> tmpGiven = new HashMap<>(givenModified);
        tmpGiven.keySet().retainAll(currDeleted.keySet());
        for (String s : tmpGiven.keySet()) {
            conflicts.put(s, List.of("", tmpGiven.get(s)));
        }
        return conflicts;
    }

    private static Map<String, List<String>> modifiedInBoth(Map<String, String> modifiedBranch, Map<String, String> modifiedCurr) {
        Map<String, String> tmpBranch = new HashMap<>(modifiedBranch);
        tmpBranch.keySet().retainAll(modifiedCurr.keySet());
        Map<String, List<String>> conflicts = new HashMap<>();
        for (String s : tmpBranch.keySet()) {
            if (!tmpBranch.get(s).equals(modifiedCurr.get(s))) {
                conflicts.put(s, List.of(modifiedCurr.get(s), tmpBranch.get(s)));
            }
        }
        return conflicts;
    }

    private static void replaceFile(String s, String curr, String given) {
        String currContent = "";
        String givenContent = "";
        if (!curr.equals("")) {
            currContent = Utils.readContentsAsString(Utils.join(BLOB, curr));
        }
        if (!given.equals("")) {
            givenContent = Utils.readContentsAsString(Utils.join(BLOB, given));
        }
        Utils.writeContents(new File(s), "<<<<<<< HEAD\n" + currContent + "=======\n" + givenContent + ">>>>>>>\n");
        add(s);
    }

    private static Set<String> onlyPresentInSplit(Set<String> presentSplit, Set<String> unmodifiedCurr) {
        presentSplit.retainAll(unmodifiedCurr);
        return presentSplit;
    }

    private static void rmInBatch(Set<String> batch) {
        batch.forEach(Main::rm);
    }

    private static Map<String, String> onlyPresentInBranch(Map<String, String> presentBranch, Map<String, String> presentCurr) {
        Map<String, String> tmpBranch = new HashMap<>(presentBranch);
        tmpBranch.keySet().removeAll(presentCurr.keySet());
        return tmpBranch;
    }

    private static Map<String, String> onlyModifiedInBranch(Map<String, String> modifiedBranch, Map<String, String> modifiedCurr) {
        Map<String, String> tmpBranch = new HashMap<>(modifiedBranch);
        tmpBranch.keySet().removeAll(modifiedCurr.keySet()); //Source: Stake Overflow
        return tmpBranch;
    }

    private static void stageInBatch(Map<String, String> batch) {
        batch.keySet().forEach(Main::add);
    }

    private static String findSplit(String branchName) {
        if (!Utils.join(BRANCHES, branchName).exists()) {
            exitWithError("A branch with that name does not exist.");
        }
        if (branchName.equals(Utils.readContentsAsString(HEAD))) {
            exitWithError("Cannot merge a branch with itself.");
        }
        HistoryTree branchHistory = new HistoryTree(UtilsExtend.getBranchHead(branchName));
        HistoryTree currHistory = new HistoryTree(UtilsExtend.getCurrHead());
        if (currHistory.contains(branchHistory.getRootID())) {
            exitWithError("Given branch is an ancestor of the current branch.");
        }
        if (branchHistory.contains(currHistory.getRootID())) {
            checkoutBranch(branchName);
            System.out.println("Current branch fast-forwarded.");
            System.exit(0);
        }
        return currHistory.findSplit(branchHistory);
    }

    private static void rmBranch(String branch) {
        if (!Utils.join(BRANCHES, branch).exists()) {
            exitWithError("A branch with that name does not exist.");
        }
        if (branch.equals(Utils.readContentsAsString(HEAD))) {
            exitWithError("Cannot remove the current branch.");
        }
        Utils.join(BRANCHES, branch).delete();
    }

    private static void reset(String commitID) {
        if (commitID.length() <= 39) {
            commitID = findCommit(commitID);
            if (commitID.equals("")) {
                exitWithError("No commit with that id exists.");
            }
        } else if (!Utils.join(COMMIT, commitID).exists()) {
            exitWithError("No commit with that id exists.");
        }
        Map<String, String> overwriteMap = UtilsExtend.getComi(commitID).getBlobs();
        Set<String> trackedSet = new HashSet<>(UtilsExtend.getCurrentBlob().keySet());
        List<String> workingFile = new ArrayList<>(Utils.plainFilenamesIn("."));
        workingFile.removeAll(trackedSet);
        if (!Collections.disjoint(workingFile, overwriteMap.keySet())) {
            exitWithError("There is an untracked file in the way; delete it, or add and commit it first.");
        }

        trackedSet.forEach(Utils::restrictedDelete);
        for (String s : overwriteMap.keySet()) {
            Utils.writeContents(new File(s), (Object) Utils.readContents(Utils.join(BLOB, overwriteMap.get(s))));
        }
        Utils.writeContents(Utils.join(BRANCHES, Utils.readContentsAsString(HEAD)), commitID);
        resetStage();
    }


    private static void branch(String branchName) {
        File branch = Utils.join(BRANCHES, branchName);
        if (branch.exists()) {
            exitWithError("A branch with that name already exists.");
        }
        Utils.writeContents(Utils.join(BRANCHES, branchName), UtilsExtend.getCurrHead());
    }

    private static void status() {
        printBranch();
        printStage();
        printNotStaged();
        printUntracked();
    }

    private static void printUntracked() {
        System.out.println("=== Untracked Files ===");
        Set<String> currTracked = new HashSet<>(UtilsExtend.getCurrentBlob().keySet());
        Stage stage = Utils.readObject(STAGE, Stage.class);
        Set<String> addStaged = new HashSet<>(stage.getAddMap().keySet());
        currTracked.addAll(addStaged);
        Set<String> removeStaged = stage.getRemoveSet();
        List<String> fileList = Utils.plainFilenamesIn(".");
        List<String> untrackedList = new ArrayList<>();
        for (String s : fileList) {
            if (!currTracked.contains(s) || removeStaged.contains(s)) {
                untrackedList.add(s);
            }
        }
        Collections.sort(untrackedList);
        untrackedList.forEach(System.out::println);
    }

    private static void printNotStaged() {
        System.out.println("=== Modifications Not Staged For Commit ===");
        Map<String, String> currBlob = UtilsExtend.getCurrentBlob();
        Set<String> currTracked = currBlob.keySet();
        Stage stage = Utils.readObject(STAGE, Stage.class);
        Map<String, String> addStaged = stage.getAddMap();
        Set<String> removeStaged = stage.getRemoveSet();
        Set<String> printSet = new HashSet<>();
        currTracked.removeAll(removeStaged);
        Iterator<String> iter = currTracked.iterator();
        while (iter.hasNext()) {                        //source: Stack Overflow
            String fileName = iter.next();
            if (!new File(fileName).exists()) {
                printSet.add(fileName + " (deleted)");
                iter.remove();
            }
        }
        currTracked.removeAll(addStaged.keySet());
        for (String fileName2 : currTracked) {
            if (!UtilsExtend.compareContent(new File(fileName2), Utils.join(BLOB, currBlob.get(fileName2)))) {
                printSet.add(fileName2 + " (modified)");
            }
        }
        for (String fileName3 : addStaged.keySet()) {
            if (!new File(fileName3).exists()) {
                printSet.add(fileName3 + " (deleted)");
            } else if (!UtilsExtend.compareContent(new File(fileName3), Utils.join(BLOB, addStaged.get(fileName3)))) {
                printSet.add(fileName3 + " (modified)");
            }
        }
        printSet.stream().sorted().forEach(System.out::println);
        System.out.println();
    }

    private static void printStage() {
        Utils.readObject(STAGE, Stage.class).printStageInfo();
    }

    private static void printBranch() {
        System.out.println("=== Branches ===");
        List<String> allBranch = Utils.plainFilenamesIn(BRANCHES);
        Collections.sort(allBranch);
        String currBranch = Utils.readContentsAsString(HEAD);
        Collections.replaceAll(allBranch, currBranch, "*" + currBranch); //source: Stack Overflow
        allBranch.forEach(System.out::println); //source: Intellij context action
        System.out.println();
    }

    private static void find(String message) {
        List<String> allCommit = Utils.plainFilenamesIn(COMMIT);
        boolean hasCommit = false;
        for (String s : allCommit) {
            Comi commit = Utils.readObject(Utils.join(COMMIT, s), Comi.class);
            if (commit.getMessage().equals(message)) {
                System.out.println(commit.getId());
                hasCommit = true;
            }
        }
        if (!hasCommit) {
            exitWithError("Found no commit with that message.");
        }
    }

    private static void checkout(String[] args) {
        if (args.length == 2) {
            checkoutBranch(args[1]);
        } else if (args.length == 3) {
            checkoutFile(UtilsExtend.getCurrentComi(), args[2]);
        } else {
            if (args[1].length() <= 39) {
                checkoutFile(UtilsExtend.getComi(findCommit(args[1])), args[3]);
            } else {
                checkoutFile(UtilsExtend.getComi(args[1]), args[3]);
            }
        }
    }

    private static String findCommit(String commitPrefix) {
        List<String> commitList = Utils.plainFilenamesIn(COMMIT);
        for (String s : commitList) {
            if (s.startsWith(commitPrefix)) {
                return s;
            }
        }
        return "";
    }

    private static void checkoutBranch(String branchName) {
        Set<String> currTracked = UtilsExtend.getCurrentBlob().keySet();
        List<String> currFiles = new LinkedList<>(Utils.plainFilenamesIn("."));
        Map<String, String> fileToOverwrite = findBranchHead(branchName).getBlobs();
        currFiles.removeAll(currTracked);
        for (String s : currFiles) {
            if (fileToOverwrite.containsKey(s)) {
                exitWithError("There is an untracked file in the way; delete it, or add and commit it first.");
            }
        }
        for (String b : currTracked) {
            Utils.restrictedDelete(b);
        }
        for (String a : fileToOverwrite.keySet()) {
            Utils.writeContents(new File(a), (Object) Utils.readContents(Utils.join(BLOB, fileToOverwrite.get(a))));
        }
        Utils.writeContents(HEAD, branchName);
        resetStage();
    }


    private static Comi findBranchHead(String branchName) {
        String commitID = Utils.readContentsAsString(Utils.join(BRANCHES, branchName));
        return Utils.readObject(Utils.join(COMMIT, commitID), Comi.class);
    }

    private static void checkoutFile(Comi commit, String fileName) {
        Map<String, String> commitBlob = commit.getBlobs();
        String blobID = commitBlob.get(fileName);
        File targetFile = Utils.join(BLOB, blobID);
        byte[] content = Utils.readContents(targetFile);
        Utils.writeContents(new File(fileName), (Object) content);
    }


    private static void globalLog() {
        List<String> commitID = Utils.plainFilenamesIn(COMMIT);
        for (String s : commitID) {
            System.out.println(Utils.readObject(Utils.join(COMMIT, s), Comi.class));
        }
    }

    private static void log() {
        Comi currentComi = UtilsExtend.getCurrentComi();
        System.out.println(currentComi);
        while (currentComi.getPrevComi() != null) {
            currentComi = Utils.readObject(Utils.join(COMMIT, currentComi.getPrevComi()), Comi.class);
            System.out.println(currentComi);
        }
    }


    private static void init() {
        createRepo();
        initCommit();
    }

    private static void createRepo() {
        if (REPO.exists()) {
            exitWithError("A Gitlet version-control system already exists in the current directory.");
        }
        REPO.mkdir();
        COMMIT.mkdir();
        BLOB.mkdir();
        BRANCHES.mkdir();
        REMOTE.mkdir();
        resetStage();
    }

    private static void initCommit() {
        Utils.writeContents(HEAD, "master");
        long date = 0;
        Comi newComi = new Comi(null, new Date(date), "initial commit", new HashMap<>());
        String comiID = createComi(newComi);
        Utils.writeContents(Utils.join(BRANCHES, "master"), comiID);
    }

    private static void add(String fileName) {
        Stage stage = Utils.readObject(STAGE, Stage.class);
        if (!stage.add(fileName)) {
            exitWithError("File does not exist.");
        }
    }

    private static void rm(String fileName) {
        Stage stage = Utils.readObject(STAGE, Stage.class);
        if (!stage.rm(fileName)) {
            exitWithError("No reason to remove the file.");
        }
    }

    private static void commit(String message) {
        Comi prevComi = UtilsExtend.getCurrentComi();
        Map<String, String> prevBlob = prevComi.getBlobs();
        Stage stage = Utils.readObject(STAGE, Stage.class);
        if (stage.isEmpty()) {
            exitWithError("No changes added to the commit.");
        }
        Map<String, String> newBlob = updateBlob(prevBlob, stage.getAddMap(), stage.getRemoveSet());
        Comi newComi = new Comi(prevComi.getId(), new Date(System.currentTimeMillis()), message, newBlob);
        resetStage();
        createComi(newComi);
    }

    private static void commit(String message, String branchName) {
        Comi firstParent = UtilsExtend.getCurrentComi();
        Map<String, String> parentBlob = firstParent.getBlobs();
        Stage stage = Utils.readObject(STAGE, Stage.class);
        if (stage.isEmpty()) {
            exitWithError("No changes added to the commit.");
        }
        Map<String, String> newBlob = updateBlob(parentBlob, stage.getAddMap(), stage.getRemoveSet());
        Comi newComi = new Comi(firstParent.getId(), Utils.readContentsAsString(Utils.join(BRANCHES, branchName)), new Date(System.currentTimeMillis()), message, newBlob);
        resetStage();
        createComi(newComi);
    }

    private static String createComi(Comi newComi) {
        Utils.writeObject(TMP, newComi);
        String comiID = Utils.sha1((Object) Utils.readContents(TMP));
        newComi.setId(comiID);
        Utils.writeObject(Utils.join(COMMIT, comiID), newComi);
        UtilsExtend.updateHEAD(comiID);
        return comiID;
    }

    private static void resetStage() {
        Utils.writeObject(STAGE, new Stage());
    }

    private static Map<String, String> updateBlob(Map<String, String> prevBlob, Map<String, String> addBlob, Set<String> removeBlob) {
        for (String s : addBlob.keySet()) {
            prevBlob.put(s, addBlob.get(s));
        }
        for (String s1 : removeBlob) {
            prevBlob.remove(s1);
        }
        return prevBlob;
    }

    private static void checkInput(String[] args, int i) {
        if (args.length != i) {
            exitWithError("Incorrect operands.");
        }
        if (!REPO.exists()) {
            exitWithError("Not in an initialized Gitlet directory.");
        }
    }

    private static void checkInputInit(String[] args) {
        if (args.length != 1) {
            exitWithError("Incorrect operands.");
        }
    }

    private static void checkInputCommit(String[] args) {
        if (args.length < 2 || args[1].equals("")) {
            exitWithError("Please enter a commit message.");
        } else if (args.length > 2) {
            exitWithError("Incorrect operands.");
        }
        if (!REPO.exists()) {
            exitWithError("Not in an initialized Gitlet directory.");
        }
    }

    private static void checkInputCheckout(String[] args) {
        if (!REPO.exists()) {
            exitWithError("Not in an initialized Gitlet directory.");
        }
        if (args.length >= 5 || args.length <= 1) {
            exitWithError("Incorrect operands.");
        } else if (args.length == 2) {
            File branch = Utils.join(BRANCHES, args[1]);
            if (!branch.exists()) {
                exitWithError("No such branch exists.");
            }
            if (args[1].equals(Utils.readContentsAsString(HEAD))) {
                exitWithError("No need to checkout the current branch.");
            }
        } else if (args.length == 3) {
            if (!args[1].equals("--")) {
                exitWithError("Incorrect operands.");
            }
            Map<String, String> currBlob = UtilsExtend.getCurrentBlob();
            if (!currBlob.containsKey(args[2])) {
                exitWithError("File does not exist in that commit.");
            }
        } else {
            if (!args[2].equals("--")) {
                exitWithError("Incorrect operands.");
            }
            List<String> commitFile = Utils.plainFilenamesIn(COMMIT);
            if (args[1].length() <= 39) {
                String commitID = findCommit(args[1]);
                if (commitID.equals("")) {
                    exitWithError("No commit with that id exists.");
                }
                args[1] = commitID;
            } else if (!commitFile.contains(args[1])) {
                exitWithError("No commit with that id exists.");
            }
            Map<String, String> commitBlob = Utils.readObject(Utils.join(COMMIT, args[1]), Comi.class).getBlobs();
            if (!commitBlob.containsKey(args[3])) {
                exitWithError("File does not exist in that commit.");
            }
        }
    }

    private static void exitWithError(String errorMessage) {
        if (errorMessage != null && !errorMessage.equals("")) {
            System.out.println(errorMessage);
        }
        System.exit(0);
    }

}

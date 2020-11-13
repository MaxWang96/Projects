package gitlet;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class UtilsExtend extends Utils {
    static final File COMMIT = Utils.join(".gitlet", "commit");
    static final File BRANCHES = Utils.join(".gitlet", "branches");
    static final File HEAD = Utils.join(".gitlet", "HEAD");
    static final File BLOB = Utils.join(".gitlet", "blob");

    public static Comi getCurrentComi() {
        return Utils.readObject(Utils.join(COMMIT, getCurrHead()), Comi.class);
    }

    public static Map<String, String> getCurrentBlob() {
        return UtilsExtend.getCurrentComi().getBlobs();
    }

    public static Comi getComi(String commitID) {
        return Utils.readObject(Utils.join(COMMIT, commitID), Comi.class);
    }

    public static Set<String> getBlobValue(String commitID) {
        return new HashSet<>(UtilsExtend.getComi(commitID).getBlobs().values());
    }

    public static void updateHEAD(String comiID) {
        String currBranch = Utils.readContentsAsString(HEAD);
        Utils.writeContents(Utils.join(BRANCHES, currBranch), comiID);
    }

    /** return the commit ID of the current head node.*/
    public static String getCurrHead() {
        return Utils.readContentsAsString(
                Utils.join(BRANCHES, Utils.readContentsAsString(HEAD)));
    }

    public static String getBranchHead(String branchName) {
        return Utils.readContentsAsString(Utils.join(BRANCHES, branchName));
    }

    public static boolean compareContent(File f1, File f2) {
        return Arrays.equals(Utils.readContents(f1), Utils.readContents(f2));
    }

    public static boolean compareContent(String s1, String s2) {
        return compareContent(new File(s1), new File(s2));
    }

    public static List<String> getBranchHistory(String branchName) {
        String currCommit = Utils.readContentsAsString(
                Utils.join(BRANCHES, branchName));
        List<String> commitHistory = new ArrayList<>(Arrays.asList(currCommit));
        Comi commit = getComi(currCommit);
        while (commit.getPrevComi() != null) {
            commitHistory.add(commit.getPrevComi());
            commit = getComi(commit.getPrevComi());
        }
        return commitHistory;
    }

    public static Map<String, String> getModified(String pre, String curr) {
        Map<String, String> preVersion = UtilsExtend.getComi(pre).getBlobs();
        Map<String, String> currVersion = UtilsExtend.getComi(curr).getBlobs();
        Map<String, String> modified = new HashMap<>();
        for (String s : currVersion.keySet()) {
            if (preVersion.containsKey(s)) {
                if (!preVersion.get(s).equals(currVersion.get(s))) {
                    modified.put(s, currVersion.get(s));
                }
            }
        }
        return modified;
    }

    public static Map<String, String> getPresent(String pre, String curr) {
        Map<String, String> preVersion = UtilsExtend.getComi(pre).getBlobs();
        Map<String, String> currVersion = UtilsExtend.getComi(curr).getBlobs();
        Map<String, String> present = new HashMap<>();
        for (String s : currVersion.keySet()) {
            if (!preVersion.containsKey(s)) {
                present.put(s, currVersion.get(s));
            }
        }
        return present;
    }

    public static Set<String> getUnmodified(String pre, String curr) {
        Map<String, String> preVersion = UtilsExtend.getComi(pre).getBlobs();
        Map<String, String> currVersion = UtilsExtend.getComi(curr).getBlobs();
        Set<String> unmodified = new HashSet<>();
        for (String s : currVersion.keySet()) {
            if (preVersion.containsKey(s)) {
                if (preVersion.get(s).equals(currVersion.get(s))) {
                    unmodified.add(s);
                }
            }
        }
        return unmodified;
    }

    public static void writeContentsInBatch(Map<String, String> batch) {
        for (String s : batch.keySet()) {
            Utils.writeContents(new File(s), (Object)
                    Utils.readContents(Utils.join(BLOB, batch.get(s))));
        }
    }
}

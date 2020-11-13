package gitlet;

import java.io.File;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.*;

public class Commit implements Serializable {
    public static final File COMMITS = Utils.join(".gitlet", "commits");

    private Date timestamp;
    private String message;
    private String prev;
    private String secondParent = null;
    private String commitId;
    private HashMap<String, String> blobs;
    private static final long serialVersionUID = -1772289818632553503L;

    public Commit() {
        COMMITS.mkdir();
        prev = null;
        message = "initial commit";
        timestamp = new Date(0);
        commitId = Utils.sha1((Object) Utils.serialize(timestamp));
        blobs = new HashMap<>();
        Utils.writeObject(Utils.join(COMMITS, commitId), this);
    }

    public static Commit headCommit() {
        return Utils.readObject(Utils.join(COMMITS, Branch.head()),Commit.class);
    }

    public static Commit commitWithId(String commitId) {
        if (commitId == null) {
            return null;
        }
        return Utils.readObject(Utils.join(COMMITS, commitId), Commit.class);
    }

    public String getID() {
        return commitId;
    }

    public HashMap<String, String> getBlobs() {
        return this.blobs;
    }

    public String getPrev() {
        return prev;
    }

    public String getMessage() {
        return message;
    }

    public String getSecondParent() {
        return secondParent;
    }

    public void setSecondParent(String id) {
        secondParent = id;
    }

    public String toString() {
        SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd hh:mm:ss yyyy Z");
        String mergeInfo = "";
        if (secondParent != null) {
            mergeInfo = "Merge: " + prev.substring(0, 7) + " " + secondParent.substring(0, 7) + "\n";
        }
        return String.format("===\ncommit %s\n%sDate: %s\n%s\n",
                commitId, mergeInfo, formatter.format(timestamp), message);
    }

    public void commitToAdd(HashMap<String, Blob> addition) {
        for (String fileName : addition.keySet()) {
            blobs.put(fileName, addition.get(fileName).getBlobHash());
        }
    }

    public void commitToRemove(HashMap<String, Blob> removal) {
        for (String fileName : removal.keySet()) {
            blobs.remove(fileName);
        }
    }

    public void createNewCommit(String log) {
        prev = commitId;
        timestamp = new Date(System.currentTimeMillis());
        commitId = Utils.sha1((Object) Utils.serialize(timestamp));
        message = log;
        Utils.writeObject(Utils.join(COMMITS, commitId), this);
    }
}

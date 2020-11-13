package gitlet;

import java.io.File;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class Comi implements Serializable {
    static final File COMMIT = Utils.join(".gitlet", "commit");
    /*source: Stack Overflow*/
    private static final long serialVersionUID = 2725817767262454258L;
    private final String prevComi;
    private final Date timeStamp;
    private final String message;
    private final Map<String, String> blobs;
    private String id;
    private String secondParent;

    public Comi(String prevComi, Date timeStamp,
                String message, Map<String, String> blobs) {
        this.prevComi = prevComi;
        this.timeStamp = timeStamp;
        this.message = message;
        this.blobs = blobs;
    }

    public Comi(String firstParent, String secondParent, Date timeStamp,
                String message, Map<String, String> blobs) {
        this.prevComi = firstParent;
        this.secondParent = secondParent;
        this.timeStamp = timeStamp;
        this.message = message;
        this.blobs = blobs;
    }

    public static Comi read(String fileName) {
        return Utils.readObject(Utils.join(COMMIT, fileName), Comi.class);
    }

    public String getPrevComi() {
        return prevComi;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getParents() {
        if (prevComi == null) {
            return new ArrayList<>();
        } else if (secondParent == null) {
            /*source: Intellij contexted action*/
            return new ArrayList<>(Collections.singletonList(prevComi));
        }
        return new ArrayList<>(Arrays.asList(prevComi, secondParent));
    }

    public Map<String, String> getBlobs() {
        return blobs;
    }

    @Override
    public String toString() {
        SimpleDateFormat formatter = new SimpleDateFormat("EEE MMM dd hh:mm:ss yyyy Z");
        if (secondParent == null) {
            return String.format("===\ncommit %s\nDate: %s\n%s\n", id, formatter.format(timeStamp), message);
        }
        return String.format("===\ncommit %s\nMerge: %s %s\nDate: %s\n%s\n", id, prevComi.substring(0, 7), secondParent.substring(0, 7),
                formatter.format(timeStamp), message);
    }

    public void printBlob() {
        System.out.println(blobs);
    }
}

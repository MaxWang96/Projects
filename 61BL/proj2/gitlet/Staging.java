package gitlet;

import java.io.File;
import java.io.Serializable;
import java.util.*;

public class Staging implements Serializable {
    public static final File STAGING = Utils.join(".gitlet", "staging");
    public static final long serialVersionUID = -9176273665008852887L;
    private HashMap<String, Blob> addition;
    private HashMap<String, Blob> removal;

    public Staging() {
        addition = new HashMap<>();
        removal = new HashMap<>();
    }

    public static Staging currentStage() {
        return Utils.readObject(STAGING, Staging.class);
    }

    public static boolean isEmpty() {
        return currentStage().getAddition().isEmpty() && currentStage().getRemoval().isEmpty();
    }

    public void stagedForAddition(File file) {
        addition.put(file.getName(), new Blob(file));
        removal.remove(file.getName());
        Utils.writeObject(STAGING, this);
    }

    public void stagedForAddition(String fileName, Blob blob) {
        addition.put(fileName, blob);
        removal.remove(fileName);
        Utils.writeObject(STAGING, this);
    }

    public void unStaged(String fileName) {
        addition.remove(fileName);
        removal.remove(fileName);
        Utils.writeObject(STAGING, this);
    }

    public void stagedForRemoval(File file) {
        removal.put(file.getName(), null);
        Utils.writeObject(STAGING, this);
        if (file.isFile()) {
            Utils.restrictedDelete(file);
        }
    }

    public HashMap<String, Blob> getAddition() {
        return addition;
    }

    public HashMap<String, Blob> getRemoval() {
        return removal;
    }

    public static void reset() {
        Utils.writeObject(STAGING, new Staging());
    }

    public boolean isStageUnchanged() {
        return removal.isEmpty() && addition.isEmpty();
    }

    public void writeBlobsToFile() {
        for (String fileName : addition.keySet()) {
            addition.get(fileName).writeToFile();
        }
    }
}

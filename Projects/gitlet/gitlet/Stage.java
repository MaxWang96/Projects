package gitlet;

import java.io.File;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Stage implements Serializable {
    private Map<String, String> addMap;
    private Set<String> removeSet;
    static final File BLOB = Utils.join(".gitlet", "blob");
    static final File STAGE = Utils.join(".gitlet", "stage");
    /*source: Stack Overflow*/
    private static final long serialVersionUID = -3593970761755404782L;

    public Stage() {
        addMap = new HashMap<>();
        removeSet = new HashSet<>();
    }

    public Map<String, String> getAddMap() {
        return addMap;
    }

    public Set<String> getRemoveSet() {
        return removeSet;
    }

    @Override
    public String toString() {
        return String.format("add: %s\nremove: %s", addMap, removeSet);
    }

    public void printStageInfo() {
        System.out.println("=== Staged Files ===");
        addMap.keySet().stream().sorted().collect(
                Collectors.toList()).forEach(System.out::println);
        System.out.println();
        System.out.println("=== Removed Files ===");
        removeSet.stream().sorted().collect(
                Collectors.toList()).forEach(System.out::println);
        System.out.println();
    }

    public boolean add(String fileName) {
        File addFile = new File(fileName);
        if (!addFile.exists()) {
            return false;
        }
        byte[] blobContent = Utils.readContents(addFile);
        String blobName = Utils.sha1((Object) blobContent);
        if (checkIdentical(fileName, blobName)) {
            addMap.remove(fileName);
            removeSet.remove(fileName);
            Utils.writeObject(STAGE, this);
            return true;
        }
        createBlob(blobName, blobContent);
        addMap.put(fileName, blobName);
        removeSet.remove(fileName);
        Utils.writeObject(STAGE, this);
        return true;
    }

    private boolean checkIdentical(String fileName, String blobName) {
        Map<String, String> currBlob = UtilsExtend.getCurrentBlob();
        return (currBlob.get(fileName) != null
                && currBlob.get(fileName).equals(blobName));
    }

    private void createBlob(String blobName, byte[] blobContent) {
        Utils.writeContents(Utils.join(BLOB, blobName), (Object) blobContent);
    }

    public boolean rm(String fileName) {
        String removeValue = addMap.remove(fileName);
        Map<String, String> currBlob = UtilsExtend.getCurrentBlob();
        if (currBlob.containsKey(fileName)) {
            removeSet.add(fileName);
            Utils.restrictedDelete(fileName);
        } else {
            if (removeValue == null) {
                return false;
            }
        }
        Utils.writeObject(STAGE, this);
        return true;
    }

    public boolean isEmpty() {
        return addMap.isEmpty() && removeSet.isEmpty();
    }
}
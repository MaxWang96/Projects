package gitlet;

import java.io.File;
import java.io.Serializable;

public class Blob implements Serializable {
    public static final File BLOBS = Utils.join(".gitlet", "blobs");
    private String fileName;
    private String blobHash;
    private byte[] blobContent;

    public Blob(File file) {
        fileName = file.getName();
        blobContent = Utils.readContents(file);
        blobHash = Utils.sha1((Object) blobContent);
    }

    public Blob(String name, String blobName) {
        fileName = name;
        blobContent = Utils.readContents(Utils.join(BLOBS, blobName));
        blobHash = blobName;
    }

    public String getFileName() {
        return fileName;
    }

    public String getBlobHash() {
        return blobHash;
    }

    public byte[] getBlobContent() {
        return blobContent;
    }

    public void writeToFile() {
        Utils.writeContents(Utils.join(BLOBS, blobHash), (Object) blobContent);
    }
}

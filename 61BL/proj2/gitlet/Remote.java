package gitlet;

import java.io.Serializable;

public class Remote implements Serializable {
    private final String remoteName;
    private final String path;

    public Remote(String remoteName, String path) {
        this.remoteName = remoteName;
        this.path = path;
    }
}

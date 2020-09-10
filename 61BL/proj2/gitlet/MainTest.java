package gitlet;

import org.junit.Test;

import java.io.File;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class MainTest {
    static final File REPO = new File(".gitlet");
    static final File COMMIT = Utils.join(".gitlet", "commit");
    static final File TMP = Utils.join(COMMIT, "tmp");
    static final File STAGE = Utils.join(".gitlet", "stage");
    static final File BLOB = Utils.join(".gitlet", "blob");
    static final File BRANCHES = Utils.join(".gitlet", "branches");

    @Test
    public void testCurrentComi() {
        Comi currComi = UtilsExtend.getCurrentComi();
        currComi.printBlob();
        System.out.println(currComi);
    }

    @Test
    public void testStage() {
        Stage stage = Utils.readObject(STAGE, Stage.class);
        System.out.println(stage);
    }

    @Test
    public void printCat() {
        printCurrentFile("cat.txt");
    }

    private void printCurrentFile(String fileName) {
        Map<String, String> currBlob = UtilsExtend.getCurrentBlob();
        if (!currBlob.containsKey(fileName)) {
            System.out.println("No such file exists");
            return;
        }
        String fileID = currBlob.get(fileName);
        System.out.println(Utils.readContentsAsString(
                Utils.join(BLOB, fileID)));
    }

    @Test
    public void testBranch() {
        assertEquals(Utils.readContentsAsString(
                Utils.join(BRANCHES, "cat")),
                Utils.readContentsAsString(
                        Utils.join(BRANCHES, "master")));
    }
}

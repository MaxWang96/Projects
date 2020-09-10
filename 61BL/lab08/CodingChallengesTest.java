import org.junit.Test;
import static org.junit.Assert.*;

public class CodingChallengesTest {

    @Test
    public void testMissingNumber() {
        int[] a1 = {0, 2, 3};
        assertEquals(1, CodingChallenges.missingNumber(a1));

        int[] a2 = {1};
        assertEquals(0, CodingChallenges.missingNumber(a2));

        int[] a3 = {};
        assertEquals(0, CodingChallenges.missingNumber(a3));

        int[] a4 = {0, 3, 2, 5, 4, 6, 8, 7, 9};
        assertEquals(1, CodingChallenges.missingNumber(a4));
    }

    @Test
    public void testSumTo() {
        int[] a1 = {1, 2, 3, 4, 5};
        assertTrue(CodingChallenges.sumTo(a1, 6));
        assertTrue(CodingChallenges.sumTo(a1, 9));
        assertTrue(CodingChallenges.sumTo(a1, 3));
        assertFalse(CodingChallenges.sumTo(a1, 2));

        int[] a2 = {};
        assertFalse(CodingChallenges.sumTo(a2, 3));

        int[] a3 = {1};
        assertFalse(CodingChallenges.sumTo(a3, 1));
    }

    @Test
    public void testIsPermutation() {
        assertTrue(CodingChallenges.isPermutation("abc", "abc"));
        assertTrue(CodingChallenges.isPermutation("abc", "cba"));
        assertTrue(CodingChallenges.isPermutation("", ""));
        assertTrue(CodingChallenges.isPermutation("123456", "643251"));
        assertFalse(CodingChallenges.isPermutation("abc", "cbaaaaa"));
        assertFalse(CodingChallenges.isPermutation("", "c"));
    }
}

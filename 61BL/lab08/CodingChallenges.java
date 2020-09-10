import java.util.*;

public class CodingChallenges {

    /**
     * Return the missing number from an array of length N containing all the
     * values from 0 to N except for one missing number.
     */
    public static int missingNumber(int[] values) {
        // TODO
        Set<Integer> set = new HashSet<>();
        for (int value : values) {
            set.add(value);
        }
        for (int i = 0; i <= values.length; i++) {
            if (!set.contains(i)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns true if and only if two integers in the array sum up to n.
     * Assume all values in the array are unique.
     */
    public static boolean sumTo(int[] values, int n) {
        // TODO
        Set<Integer> set = new HashSet<>();
        for (int value : values) {
            set.add(value);
        }
        int findValue;
        for (int i = 0; i <= values.length - 1; i++) {
            findValue = n - values[i];
            if (set.contains(findValue) && findValue != values[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if and only if s1 is a permutation of s2. s1 is a
     * permutation of s2 if it has the same number of each character as s2.
     */
    public static boolean isPermutation(String s1, String s2) {
        // TODO
        Map<String, Integer> map1 = new HashMap<>();
        String[] array1 = s1.split(""); //source: Stack Overflow
        for (String s : array1) {
            if (!map1.containsKey(s)) {
                map1.put(s, 1);
            } else {
                map1.put(s, map1.get(s) + 1);
            }
        }

        Map<String, Integer> map2 = new HashMap<>();
        String[] array2 = s2.split(""); //source: Stack Overflow
        for (String s : array2) {
            if (!map2.containsKey(s)) {
                map2.put(s, 1);
            } else {
                map2.put(s, map2.get(s) + 1);
            }
        }

        return map1.equals(map2);
    }
}

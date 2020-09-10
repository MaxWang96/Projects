import java.util.Arrays;

public class DistributionSorts {

    /* Destructively sorts ARR using counting sort. Assumes that ARR contains
       only 0, 1, ..., 9. */
    public static void countingSort(int[] arr) {
        int[] counting = new int[10];
        for (int i : arr) {
            counting[i] += 1;
        }
        int[] startIndex = new int[10];
        startIndex[1] = counting[0];
        for (int i = 2; i < 10; i++) {
            startIndex[i] = counting[i - 1] + startIndex[i - 1];
        }
        int[] newArray = new int[arr.length];
        for (int i : arr) {
            newArray[startIndex[i]] = i;
            startIndex[i]++;
        }
        System.arraycopy(newArray, 0, arr, 0, arr.length);
    }


    /* Destructively sorts ARR using LSD radix sort. */
    public static void lsdRadixSort(int[] arr) {
        int maxDigit = mostDigitsIn(arr);
        for (int d = 0; d < maxDigit; d++) {
            countingSortOnDigit(arr, d);
        }
    }

    /* A helper method for radix sort. Modifies ARR to be sorted according to
       DIGIT-th digit. When DIGIT is equal to 0, sort the numbers by the
       rightmost digit of each number. */
    private static void countingSortOnDigit(int[] arr, int digit) {
        int[] counting = new int[10];
        int[] digitValue = new int[arr.length];
        int number;
        for (int i = 0; i < arr.length; i++) {
            number = (int) (arr[i] / Math.pow(10, digit));
            digitValue[i] = number % 10;
        }
        for (int i : digitValue) {
            counting[i] += 1;
        }
        int[] startIndex = new int[10];
        startIndex[1] = counting[0];
        for (int i = 2; i < 10; i++) {
            startIndex[i] = counting[i - 1] + startIndex[i - 1];
        }
        int[] newArray = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            newArray[startIndex[digitValue[i]]] = arr[i];
            startIndex[digitValue[i]]++;
        }
        System.arraycopy(newArray, 0, arr, 0, arr.length);
    }

    /* Returns the largest number of digits that any integer in ARR has. */
    private static int mostDigitsIn(int[] arr) {
        int maxDigitsSoFar = 0;
        for (int num : arr) {
            int numDigits = (int) (Math.log10(num) + 1);
            if (numDigits > maxDigitsSoFar) {
                maxDigitsSoFar = numDigits;
            }
        }
        return maxDigitsSoFar;
    }

    /* Returns a random integer between 0 and 9999. */
    private static int randomInt() {
        return (int) (10000 * Math.random());
    }

    /* Returns a random integer between 0 and 9. */
    private static int randomDigit() {
        return (int) (10 * Math.random());
    }

    private static void runCountingSort(int len) {
        int[] arr1 = new int[len];
        for (int i = 0; i < arr1.length; i++) {
            arr1[i] = randomDigit();
        }
        System.out.println("Original array: " + Arrays.toString(arr1));
        countingSort(arr1);
        if (arr1 != null) {
            System.out.println("Should be sorted: " + Arrays.toString(arr1));
        }
    }

    private static void runLSDRadixSort(int len) {
        int[] arr2 = new int[len];
        for (int i = 0; i < arr2.length; i++) {
//            arr2[i] = randomDigit();
            arr2[i] = randomInt();
        }
        System.out.println("Original array: " + Arrays.toString(arr2));
        lsdRadixSort(arr2);
        System.out.println("Should be sorted: " + Arrays.toString(arr2));

    }

    public static void main(String[] args) {
//        runCountingSort(20);
//        runLSDRadixSort(3);
        runLSDRadixSort(30);
    }
}
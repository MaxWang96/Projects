package bearmaps.utils.pq;

import org.junit.Test;

import java.util.Random;

import static org.junit.Assert.*;

public class MinHeapPQTest {
    @Test
    public void fuzzTest() {
        MinHeapPQ<Integer> toTest = new MinHeapPQ<>();
        Random generator = new Random();
        for (int i = 0; i <= 200000; i++) {
            toTest.insert(i, generator.nextDouble());
        }
        for (int i = 0; i <= 200000; i++) {
            toTest.changePriority(i, generator.nextDouble());
        }
    }
}
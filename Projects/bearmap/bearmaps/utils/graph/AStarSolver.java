package bearmaps.utils.graph;

import bearmaps.utils.pq.MinHeapPQ;

import java.util.*;

public class AStarSolver<Vertex> implements ShortestPathsSolver<Vertex> {
    private final List<Vertex> solution = new LinkedList<>();
    private double distance;
    private int numExplored;
    private double totalTime;
    private boolean timeout = false;
    private boolean solved = false;

    public AStarSolver(AStarGraph<Vertex> input, Vertex start, Vertex end, double timeout) {
        long startTime = System.currentTimeMillis();
        long endTime = startTime + (long) timeout * 1000;
        Map<Vertex, Double> distance = new HashMap<>();
        Map<Vertex, Vertex> predecessor = new HashMap<>();
        Set<Vertex> visited = new HashSet<>();
        MinHeapPQ<Vertex> fringe = new MinHeapPQ<>();
        fringe.insert(start, 0);
        distance.put(start, 0.0);
        predecessor.put(start, start);
        visited.add(start);
        Vertex curr;
        List<WeightedEdge<Vertex>> neighbors;
        while (fringe.size() != 0 && !fringe.peek().equals(end)) {
            if (System.currentTimeMillis() > endTime) {
                this.timeout = true;
                return;
            }
            curr = fringe.poll();
            numExplored++;
            visited.add(curr);
            neighbors = input.neighbors(curr);
            for (WeightedEdge<Vertex> e : neighbors) {
                if (!visited.contains(e.to())) {
                    if (!distance.containsKey(e.to())) {
                        distance.put(e.to(), e.weight() + distance.get(curr));
                        predecessor.put(e.to(), curr);
                        fringe.insert(e.to(), distance.get(e.to()) + input.estimatedDistanceToGoal(e.to(), end));
                    } else if (distance.get(e.to()) > e.weight() + distance.get(curr)) {
                        distance.put(e.to(), e.weight() + distance.get(curr));
                        predecessor.put(e.to(), curr);
                        fringe.insert(e.to(), distance.get(e.to()) + input.estimatedDistanceToGoal(e.to(), end));
                    }
                }
            }
        }
        if (fringe.size() == 0) {
            return;
        }
        solved = true;
        Vertex toAdd = end;
        solution.add(toAdd);
        while (!toAdd.equals(start)) {
            toAdd = predecessor.get(toAdd);
            solution.add(toAdd);
        }
        Collections.reverse(solution);
        this.distance = distance.get(end);
        totalTime = ((double) (System.currentTimeMillis() - startTime)) / 1000;
    }

    public SolverOutcome outcome() {
        if (timeout) {
            return SolverOutcome.TIMEOUT;
        }
        if (solved) {
            return SolverOutcome.SOLVED;
        }
        return SolverOutcome.UNSOLVABLE;
    }

    public List<Vertex> solution() {
        if (timeout || !solved) {
            return new LinkedList<>();
        }
        return solution;
    }

    public double solutionWeight() {
        if (timeout || !solved) {
            return 0;
        }
        return distance;
    }

    public int numStatesExplored() {
        return numExplored;
    }

    public double explorationTime() {
        return totalTime;
    }
}

"""DSA prerequisite graph for Wrong-Answer Genealogy.
Maps concept -> prerequisites. When a student fails a problem testing X,
we trace back to the earliest missing prerequisite."""

PREREQ_DAG = {
    "Bubble Sort": ["Array Basics", "Comparison & Swap"],
    "Quick Sort": ["Array Basics", "Recursion", "Pivot Selection"],
    "Binary Search": ["Array Basics", "Sorted Array Property"],
    "Linked List": ["Pointer Concepts", "Dynamic Memory"],
    "BST Insert/Search": ["Tree Structure", "Recursion"],
    "Graph BFS": ["Graph Representation", "Queue"],
    "Dijkstra": ["Graph BFS", "Priority Queue", "Greedy Strategy"],
    "Dynamic Programming": ["Recursion", "Memoization", "Optimal Substructure"],
    "Amortized Analysis": ["Big-O Notation", "Average Case"],
    "Hash Table": ["Hash Function", "Collision Handling"],
}

# Reverse lookup: which concepts this concept is required for
REQUIRED_BY = {v: k for k, prereqs in PREREQ_DAG.items() for v in prereqs}

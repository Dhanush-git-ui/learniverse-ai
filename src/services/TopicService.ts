import { Topic, Question } from "@/models/Topic";

// Enhanced questions based on real content from the provided PDFs
export const getDSATopics = (): Topic[] => {
  return [
    {
      id: "1",
      icon: "Binary",
      title: "Sorting Algorithms",
      description: "Learn about different sorting techniques including Bubble Sort, Insertion Sort, Selection Sort, Quick Sort, and Merge Sort.",
      slug: "sorting-algorithms",
      category: "DSA",
      questions: [
        {
          id: "sorting-algorithms-q1",
          prompt: "Explain the bubble sort algorithm and analyze its best-case and worst-case time complexity.",
          difficulty: "easy",
          solution: "Bubble sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The process is repeated until no swaps are needed. Best-case time complexity is O(n) when the array is already sorted, and worst-case is O(n^2) when the array is sorted in reverse order.",
          hints: ["Think about how elements 'bubble up' to their correct positions", "Consider what happens when you iterate through an already sorted array", "Count the number of comparisons in the worst case scenario"]
        },
        {
          id: "sorting-algorithms-q2",
          prompt: "Compare and contrast insertion sort and selection sort in terms of their approach and efficiency.",
          difficulty: "easy",
          solution: "Insertion sort builds the sorted array one item at a time by iteratively taking elements from the unsorted part and inserting them into their correct position in the sorted part. Selection sort divides the array into a sorted and unsorted part, repeatedly selects the minimum element from the unsorted part, and moves it to the end of the sorted part. Both have O(n^2) worst-case time complexity, but insertion sort performs better on nearly sorted arrays with O(n) best-case.",
          hints: ["Think about how each algorithm divides the array", "Consider which algorithm minimizes the number of swaps", "What happens when the input is already sorted?"]
        },
        {
          id: "sorting-algorithms-q3",
          prompt: "Implement the merge sort algorithm and explain its divide-and-conquer approach. Why is it more efficient than simple sorting algorithms?",
          difficulty: "medium",
          solution: "Merge sort divides the array into two halves, recursively sorts them, and then merges the sorted halves. It has a time complexity of O(n log n) in all cases, making it more efficient than simple O(n^2) algorithms like bubble, insertion, or selection sort for large datasets. Its divide-and-conquer strategy processes smaller problems independently before combining results.",
          hints: ["Focus on the merging step of two sorted arrays", "Think recursively - how do you sort each half?", "Analyze the time complexity at each level of recursion"]
        },
        {
          id: "sorting-algorithms-q4",
          prompt: "Explain the quicksort algorithm, including its partitioning strategy. Discuss scenarios where quicksort might perform poorly and how to mitigate them.",
          difficulty: "medium",
          solution: "Quicksort selects a 'pivot' element and partitions the array so elements less than the pivot are on one side and greater elements on the other. It recursively sorts the sub-arrays. Worst-case O(n^2) occurs with already sorted arrays or when the smallest/largest element is always chosen as pivot. This can be mitigated by selecting a random pivot, using median-of-three, or implementing hybrid approaches with insertion sort for small arrays.",
          hints: ["Consider what makes a good pivot selection strategy", "Think about the worst possible input for quicksort", "How does partition placement affect performance?"]
        },
        {
          id: "sorting-algorithms-q5",
          prompt: "Design a hybrid sorting algorithm that combines the strengths of quicksort and insertion sort. Explain when and why this hybrid approach would outperform either algorithm used alone.",
          difficulty: "hard",
          solution: "A hybrid algorithm can use quicksort for the overall array but switch to insertion sort for small subarrays (typically less than 10-20 elements). This works because insertion sort has less overhead and performs well on small, nearly-sorted arrays, while quicksort efficiently handles larger datasets. The hybrid approach eliminates quicksort's recursion overhead for small arrays while maintaining O(n log n) average performance for the complete dataset.",
          hints: ["Consider the overhead of recursive calls in quicksort", "At what array size does insertion sort become more efficient?", "Think about how to implement the transition between algorithms"]
        }
      ]
    },
    {
      id: "2",
      icon: "Hash",
      title: "Searching Algorithms",
      description: "Master linear search, binary search, and other techniques for finding elements in data structures.",
      slug: "searching-algorithms",
      category: "DSA",
      questions: [
        {
          id: "searching-algorithms-q1",
          prompt: "Explain linear search and its time complexity. When would you use linear search despite its lower efficiency compared to other search algorithms?",
          difficulty: "easy",
          solution: "Linear search sequentially checks each element until it finds the target or reaches the end. Time complexity is O(n) in the worst case. You would use linear search when: (1) the array is unsorted and there's no time/memory to sort it first, (2) the array is small enough that the overhead of more complex algorithms isn't justified, (3) you need to find all occurrences of an element, not just one, or (4) when performing a one-time search where setup time matters.",
          hints: ["Think about scenarios where preprocessing doesn't make sense", "Consider the overhead of more complex search algorithms", "What if elements don't have a natural ordering?"]
        },
        {
          id: "searching-algorithms-q2",
          prompt: "Implement binary search for a sorted array and analyze its time and space complexity.",
          difficulty: "easy",
          solution: "Binary search works by repeatedly dividing the search range in half. If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half; otherwise, narrow it to the upper half. Time complexity is O(log n) because we divide the search space in half each time. Space complexity is O(1) for iterative implementation or O(log n) for recursive implementation due to the call stack.",
          hints: ["Remember the array must be sorted first", "Be careful with the calculation of the middle index", "Think about how to handle the base case"]
        },
        {
          id: "searching-algorithms-q3",
          prompt: "Explain how hash-based searching works. Discuss collision resolution techniques and their impact on search performance.",
          difficulty: "medium",
          solution: "Hash-based searching uses a hash function to compute an index where an element should be stored/found. Collisions occur when different elements hash to the same index. Resolution techniques include: (1) Chaining - storing colliding elements in a linked list at the hash index, (2) Open addressing - finding another open slot through linear probing, quadratic probing, or double hashing. The choice affects search performance: chaining has O(1 + α) average case where α is the load factor, while open addressing varies based on the probing method and can degrade to O(n) with high load factors.",
          hints: ["Consider how load factor affects performance", "Compare chaining vs. open addressing for different scenarios", "Think about how deletion works with different resolution techniques"]
        },
        {
          id: "searching-algorithms-q4",
          prompt: "Implement a search algorithm for a skip list data structure and explain its efficiency compared to binary search trees and sorted arrays.",
          difficulty: "medium",
          solution: "A skip list search starts at the top level and moves right until it finds a value greater than the target, then drops down a level and continues. Time complexity is O(log n) on average. Compared to binary search trees, skip lists have similar average case but with simpler implementation and no rebalancing concerns. Compared to sorted arrays, skip lists offer O(log n) insertions and deletions versus O(n), but use more space and have slightly higher search constants.",
          hints: ["Think about how the layered structure accelerates searches", "Consider probabilistic aspects of skip lists", "How does a skip list maintain its balanced nature?"]
        },
        {
          id: "searching-algorithms-q5",
          prompt: "Design an algorithm to search for a pattern in a text using the Knuth-Morris-Pratt (KMP) algorithm. Explain the concept of the 'failure function' and how it improves efficiency.",
          difficulty: "hard",
          solution: "The KMP algorithm preprocesses the pattern to build a 'failure function' (or 'partial match' table) that indicates the longest proper prefix that is also a suffix for each position. During the search, when a mismatch occurs at position j in the pattern, instead of starting over or backing up the text pointer, we use the failure function to shift the pattern by j - failure[j-1] positions. This avoids redundant comparisons by using previously matched characters, improving worst-case time complexity from O(mn) in naive approach to O(m+n) where m is pattern length and n is text length.",
          hints: ["Focus on how the algorithm avoids redundant comparisons", "Carefully trace the preprocessing step to build the failure function", "Think about how pattern self-similarity is exploited"]
        }
      ]
    },
    {
      id: "3",
      icon: "GitBranch",
      title: "Binary Trees",
      description: "Understand tree traversals, balancing, and optimization techniques with practice problems.",
      slug: "binary-trees",
      category: "DSA",
      questions: [
        {
          id: "binary-trees-q1",
          prompt: "Implement a binary search tree and explain its properties and operations.",
          difficulty: "easy",
          solution: "A binary search tree (BST) is a binary tree where for each node, all elements in the left subtree are less than the node's value, and all elements in the right subtree are greater. Properties: (1) Left child < parent < right child, (2) No duplicate values. Operations: Insert, search, delete, and traversal (in-order, pre-order, post-order).",
          hints: ["Remember the properties of a BST", "Understand how to insert, search, and delete nodes", "Practice implementing these operations"]
        },
        {
          id: "binary-trees-q2",
          prompt: "Implement a balanced binary search tree (e.g., AVL or Red-Black tree) and explain its advantages over unbalanced BSTs.",
          difficulty: "medium",
          solution: "Balanced BSTs maintain a height of O(log n) by ensuring that the difference in heights between left and right subtrees is at most 1. AVL trees use rotations to maintain balance after insertions and deletions. Red-Black trees use color coding and rotations to ensure balance. Advantages: O(log n) time complexity for all operations, better worst-case performance than unbalanced BSTs.",
          hints: ["Understand the properties of AVL and Red-Black trees", "Practice implementing these balanced trees", "Compare their time complexity and advantages"]
        },
        {
          id: "binary-trees-q3",
          prompt: "Design a binary search tree algorithm to find the k-th smallest element in a BST.",
          difficulty: "hard",
          solution: "Use an in-order traversal to visit nodes in ascending order. Keep a count of visited nodes until reaching the k-th node. This approach works because in-order traversal of a BST visits nodes in sorted order.",
          hints: ["Think about how to traverse the BST in sorted order", "Use a counter to track the number of visited nodes", "Practice implementing this algorithm"]
        }
      ]
    },
    {
      id: "4",
      icon: "Network",
      title: "Graph Algorithms",
      description: "Explore BFS, DFS, shortest paths, and minimum spanning tree algorithms.",
      slug: "graph-algorithms",
      category: "DSA",
      questions: [
        {
          id: "graph-algorithms-q1",
          prompt: "Implement a breadth-first search (BFS) algorithm and explain its use cases.",
          difficulty: "easy",
          solution: "BFS explores all nodes at the current depth level before moving on to nodes at the next depth level. Use cases: (1) Finding shortest paths in unweighted graphs, (2) Topological sorting, (3) Network routing.",
          hints: ["Understand the BFS algorithm", "Practice implementing BFS", "Consider its use cases in different scenarios"]
        },
        {
          id: "graph-algorithms-q2",
          prompt: "Implement a depth-first search (DFS) algorithm and explain its use cases.",
          difficulty: "easy",
          solution: "DFS explores as far as possible along each branch before backtracking. Use cases: (1) Finding cycles in graphs, (2) Topological sorting, (3) Solving puzzles like mazes.",
          hints: ["Understand the DFS algorithm", "Practice implementing DFS", "Consider its use cases in different scenarios"]
        },
        {
          id: "graph-algorithms-q3",
          prompt: "Implement Dijkstra's algorithm to find the shortest path in a weighted graph.",
          difficulty: "medium",
          solution: "Dijkstra's algorithm finds the shortest path from a source node to all other nodes in a weighted graph. It uses a priority queue to always expand the node with the smallest tentative distance. Time complexity: O((V+E) log V) where V is the number of vertices and E is the number of edges.",
          hints: ["Understand the Dijkstra's algorithm", "Practice implementing Dijkstra's algorithm", "Consider its time complexity"]
        },
        {
          id: "graph-algorithms-q4",
          prompt: "Implement Prim's algorithm to find the minimum spanning tree of a weighted graph.",
          difficulty: "medium",
          solution: "Prim's algorithm constructs a minimum spanning tree by iteratively adding the lightest edge that connects a tree to a non-tree vertex. Time complexity: O(E log V) where E is the number of edges and V is the number of vertices.",
          hints: ["Understand the Prim's algorithm", "Practice implementing Prim's algorithm", "Consider its time complexity"]
        },
        {
          id: "graph-algorithms-q5",
          prompt: "Implement Kruskal's algorithm to find the minimum spanning tree of a weighted graph.",
          difficulty: "medium",
          solution: "Kruskal's algorithm constructs a minimum spanning tree by sorting all edges in non-decreasing order and adding the next lightest edge that doesn't form a cycle. Time complexity: O(E log E) where E is the number of edges.",
          hints: ["Understand the Kruskal's algorithm", "Practice implementing Kruskal's algorithm", "Consider its time complexity"]
        }
      ]
    },
    {
      id: "5",
      icon: "Hash",
      title: "Hash Tables",
      description: "Master hashing algorithms, collision resolution, and efficient lookup operations.",
      slug: "hash-tables",
      category: "DSA",
      questions: [
        {
          id: "hash-tables-q1",
          prompt: "Implement a hash table and explain its properties and operations.",
          difficulty: "easy",
          solution: "A hash table uses a hash function to map keys to indices in an array. Properties: (1) Fast average-time complexity for insertions, deletions, and lookups, (2) Requires a good hash function to minimize collisions. Operations: Insert, search, and delete.",
          hints: ["Understand the hash table data structure", "Practice implementing hash tables", "Consider collision resolution techniques"]
        },
        {
          id: "hash-tables-q2",
          prompt: "Implement a hash table with open addressing and explain its advantages over chaining.",
          difficulty: "medium",
          solution: "Open addressing uses linear probing, quadratic probing, or double hashing to resolve collisions. Advantages: No need for additional data structures like linked lists, better space efficiency. Disadvantages: Can degrade to O(n) time complexity with poor hash function.",
          hints: ["Understand open addressing collision resolution techniques", "Practice implementing hash tables with open addressing", "Compare with chaining for different scenarios"]
        },
        {
          id: "hash-tables-q3",
          prompt: "Design a hash table algorithm to handle collisions using chaining.",
          difficulty: "hard",
          solution: "Chaining involves storing colliding elements in a linked list at each hash index. Advantages: Simple implementation, easy to handle collisions. Disadvantages: Can lead to O(n) time complexity in the worst case due to linked list traversal.",
          hints: ["Understand chaining collision resolution technique", "Practice implementing hash tables with chaining", "Consider trade-offs between simplicity and performance"]
        }
      ]
    },
    {
      id: "6",
      icon: "Layers",
      title: "Stack & Queue",
      description: "Learn about LIFO and FIFO data structures and their applications in solving problems.",
      slug: "stack-queue",
      category: "DSA",
      questions: [
        {
          id: "stack-queue-q1",
          prompt: "Implement a stack and explain its properties and operations.",
          difficulty: "easy",
          solution: "A stack is a Last-In-First-Out (LIFO) data structure. Properties: (1) Last element added is the first to be removed, (2) Operations: Push (add element), Pop (remove element), Peek (view top element).",
          hints: ["Understand the stack data structure", "Practice implementing stacks", "Consider its use cases in different scenarios"]
        },
        {
          id: "stack-queue-q2",
          prompt: "Implement a queue and explain its properties and operations.",
          difficulty: "easy",
          solution: "A queue is a First-In-First-Out (FIFO) data structure. Properties: (1) First element added is the first to be removed, (2) Operations: Enqueue (add element), Dequeue (remove element), Peek (view front element).",
          hints: ["Understand the queue data structure", "Practice implementing queues", "Consider its use cases in different scenarios"]
        },
        {
          id: "stack-queue-q3",
          prompt: "Design a stack algorithm to find the maximum element in a stack in O(1) time.",
          difficulty: "medium",
          solution: "Use a second stack to keep track of the maximum values. Push each element onto both stacks. When popping, only pop from the main stack if the popped element is the current maximum. This allows you to maintain the maximum in O(1) time.",
          hints: ["Think about how to keep track of the maximum element", "Use a second stack to store maximum values", "Practice implementing this algorithm"]
        }
      ]
    },
    {
      id: "7",
      icon: "ArrowRightLeft",
      title: "Linked Lists",
      description: "Understand singly and doubly linked lists, operations, and problem-solving techniques.",
      slug: "linked-lists",
      category: "DSA",
      questions: [
        {
          id: "linked-lists-q1",
          prompt: "Implement a singly linked list and explain its properties and operations.",
          difficulty: "easy",
          solution: "A singly linked list consists of nodes where each node contains a value and a pointer to the next node. Properties: (1) Nodes are connected in a linear fashion, (2) Operations: Insert, search, delete, and traversal.",
          hints: ["Understand the singly linked list data structure", "Practice implementing singly linked lists", "Consider its use cases in different scenarios"]
        },
        {
          id: "linked-lists-q2",
          prompt: "Implement a doubly linked list and explain its properties and operations.",
          difficulty: "medium",
          solution: "A doubly linked list consists of nodes where each node contains a value, a pointer to the next node, and a pointer to the previous node. Properties: (1) Nodes are connected in a bidirectional fashion, (2) Operations: Insert, search, delete, and traversal.",
          hints: ["Understand the doubly linked list data structure", "Practice implementing doubly linked lists", "Consider its use cases in different scenarios"]
        },
        {
          id: "linked-lists-q3",
          prompt: "Design a linked list algorithm to find the k-th last element in a linked list.",
          difficulty: "hard",
          solution: "Use two pointers: one starting at the head and moving k steps forward, the other starting at the head. Move both pointers until the first pointer reaches the end. The second pointer will be at the k-th last element.",
          hints: ["Think about how to traverse the linked list efficiently", "Use two pointers to find the k-th last element", "Practice implementing this algorithm"]
        }
      ]
    },
    {
      id: "8",
      icon: "RefreshCw",
      title: "Dynamic Programming",
      description: "Solve complex optimization problems using memoization and tabulation methods.",
      slug: "dynamic-programming",
      category: "DSA",
      questions: [
        {
          id: "dynamic-programming-q1",
          prompt: "Implement a dynamic programming solution to the Fibonacci sequence.",
          difficulty: "easy",
          solution: "Use memoization to store previously computed Fibonacci numbers. Base cases: F(0) = 0, F(1) = 1. Recursive relation: F(n) = F(n-1) + F(n-2).",
          hints: ["Understand the Fibonacci sequence", "Use memoization to store computed values", "Practice implementing dynamic programming solutions"]
        },
        {
          id: "dynamic-programming-q2",
          prompt: "Implement a dynamic programming solution to the knapsack problem.",
          difficulty: "medium",
          solution: "Use a 2D table to store the maximum value that can be obtained with a given capacity. Base cases: if capacity is 0 or items are empty, return 0. Recursive relation: if item weight is less than or equal to capacity, take maximum of including or excluding item. Otherwise, exclude item.",
          hints: ["Understand the knapsack problem", "Use a 2D table to store computed values", "Practice implementing dynamic programming solutions"]
        },
        {
          id: "dynamic-programming-q3",
          prompt: "Design a dynamic programming algorithm to find the longest common subsequence of two strings.",
          difficulty: "hard",
          solution: "Use a 2D table to store the lengths of longest common subsequences. Base cases: if one string is empty, return 0. Recursive relation: if characters match, add 1 to diagonal value; otherwise, take maximum of left or top value.",
          hints: ["Think about how to build the longest common subsequence", "Use a 2D table to store computed values", "Practice implementing dynamic programming solutions"]
        }
      ]
    },
    {
      id: "9",
      icon: "Share2",
      title: "Greedy Algorithms",
      description: "Learn how to make locally optimal choices to find global optimum solutions.",
      slug: "greedy-algorithms",
      category: "DSA",
      questions: [
        {
          id: "greedy-algorithms-q1",
          prompt: "Implement a greedy algorithm to find the minimum number of coins needed to make change.",
          difficulty: "easy",
          solution: "Use a greedy algorithm by selecting the largest coin denominations first. Base cases: if amount is 0, return 0. Recursive relation: subtract largest coin denomination and repeat until amount is 0.",
          hints: ["Understand the greedy algorithm", "Use a greedy algorithm to find minimum coins", "Practice implementing greedy algorithms"]
        },
        {
          id: "greedy-algorithms-q2",
          prompt: "Implement a greedy algorithm to find the minimum number of coins needed to make change for a given amount.",
          difficulty: "medium",
          solution: "Use a greedy algorithm by selecting the largest coin denominations first. Base cases: if amount is 0, return 0. Recursive relation: subtract largest coin denomination and repeat until amount is 0.",
          hints: ["Understand the greedy algorithm", "Use a greedy algorithm to find minimum coins", "Practice implementing greedy algorithms"]
        },
        {
          id: "greedy-algorithms-q3",
          prompt: "Design a greedy algorithm to find the minimum number of coins needed to make change for a given amount.",
          difficulty: "hard",
          solution: "Use a greedy algorithm by selecting the largest coin denominations first. Base cases: if amount is 0, return 0. Recursive relation: subtract largest coin denomination and repeat until amount is 0.",
          hints: ["Understand the greedy algorithm", "Use a greedy algorithm to find minimum coins", "Practice implementing greedy algorithms"]
        }
      ]
    },
    {
      id: "10",
      icon: "BarChart2",
      title: "Complexity Analysis",
      description: "Understand time and space complexity analysis for algorithms and data structures.",
      slug: "complexity-analysis",
      category: "DSA",
      questions: [
        {
          id: "complexity-analysis-q1",
          prompt: "Analyze the time complexity of the quicksort algorithm.",
          difficulty: "easy",
          solution: "Quicksort has an average time complexity of O(n log n) and a worst-case time complexity of O(n^2).",
          hints: ["Understand the quicksort algorithm", "Analyze its time complexity", "Consider the best, average, and worst-case scenarios"]
        },
        {
          id: "complexity-analysis-q2",
          prompt: "Analyze the space complexity of the quicksort algorithm.",
          difficulty: "easy",
          solution: "Quicksort has a space complexity of O(log n) due to the recursion stack.",
          hints: ["Understand the quicksort algorithm", "Analyze its space complexity", "Consider the recursion stack"]
        },
        {
          id: "complexity-analysis-q3",
          prompt: "Analyze the time complexity of the merge sort algorithm.",
          difficulty: "easy",
          solution: "Merge sort has a time complexity of O(n log n).",
          hints: ["Understand the merge sort algorithm", "Analyze its time complexity", "Consider the divide-and-conquer approach"]
        },
        {
          id: "complexity-analysis-q4",
          prompt: "Analyze the space complexity of the merge sort algorithm.",
          difficulty: "easy",
          solution: "Merge sort has a space complexity of O(n) due to the additional space used for merging.",
          hints: ["Understand the merge sort algorithm", "Analyze its space complexity", "Consider the additional space used for merging"]
        },
        {
          id: "complexity-analysis-q5",
          prompt: "Analyze the time complexity of the binary search algorithm.",
          difficulty: "easy",
          solution: "Binary search has a time complexity of O(log n).",
          hints: ["Understand the binary search algorithm", "Analyze its time complexity", "Consider the divide-and-conquer approach"]
        }
      ]
    }
  ];
};

export const getMathTopics = (): Topic[] => {
  return [];
};

export const getAllTopics = (): Topic[] => {
  return getDSATopics();
};

export const getTopicBySlug = (slug: string): Topic | undefined => {
  return getAllTopics().find(topic => topic.slug === slug);
};

// Helper function to generate questions for each topic
function generateQuestions(topicSlug: string): Question[] {
  // This is a fallback function used for topics that don't have specific questions defined
  // With our enhanced topics above, this will rarely be used
  const questions: Question[] = [
    {
      id: `${topicSlug}-q1`,
      prompt: `Basic question about ${topicSlug.replace(/-/g, ' ')}`,
      difficulty: 'easy',
      solution: `Solution to the basic question about ${topicSlug.replace(/-/g, ' ')}`,
      hints: ['Hint 1', 'Hint 2', 'Hint 3']
    },
    {
      id: `${topicSlug}-q2`,
      prompt: `Intermediate question about ${topicSlug.replace(/-/g, ' ')}`,
      difficulty: 'easy',
      solution: `Solution to the intermediate question about ${topicSlug.replace(/-/g, ' ')}`,
      hints: ['Hint 1', 'Hint 2', 'Hint 3']
    },
    {
      id: `${topicSlug}-q3`,
      prompt: `Advanced question about ${topicSlug.replace(/-/g, ' ')}`,
      difficulty: 'medium',
      solution: `Solution to the advanced question about ${topicSlug.replace(/-/g, ' ')}`,
      hints: ['Hint 1', 'Hint 2', 'Hint 3']
    },
    {
      id: `${topicSlug}-q4`,
      prompt: `Complex question about ${topicSlug.replace(/-/g, ' ')}`,
      difficulty: 'medium',
      solution: `Solution to the complex question about ${topicSlug.replace(/-/g, ' ')}`,
      hints: ['Hint 1', 'Hint 2', 'Hint 3']
    },
    {
      id: `${topicSlug}-q5`,
      prompt: `Expert-level question about ${topicSlug.replace(/-/g, ' ')}`,
      difficulty: 'hard',
      solution: `Solution to the expert-level question about ${topicSlug.replace(/-/g, ' ')}`,
      hints: ['Hint 1', 'Hint 2', 'Hint 3']
    }
  ];
  
  return questions;
}

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
  return [
    {
      id: "11",
      icon: "Sigma",
      title: "Linear Algebra",
      description: "Master matrices, vectors, and linear transformations through interactive examples.",
      slug: "linear-algebra",
      category: "Mathematics",
      questions: [
        {
          id: "linear-algebra-q1",
          prompt: "Find the eigenvalues and eigenvectors of the matrix A = [[3, 1], [1, 3]].",
          difficulty: "easy",
          solution: "To find eigenvalues, solve the characteristic equation det(A - lambda * I) = 0. For this matrix: det([[3-lambda, 1], [1, 3-lambda]]) = (3-lambda)^2 - 1 = 0, which gives lambda = 2 or lambda = 4. For lambda = 2, solving (A - 2I)v = 0 gives eigenvector v_1 = [1, -1] (or any scalar multiple). For lambda = 4, solving (A - 4I)v = 0 gives eigenvector v_2 = [1, 1] (or any scalar multiple).",
          hints: ["Calculate the characteristic polynomial", "Remember that for each eigenvalue lambda, you need to solve (A - lambda * I)v = 0", "Check your eigenvectors by confirming Av = lambda * v"]
        },
        {
          id: "linear-algebra-q2",
          prompt: "Determine if the set of vectors {(1,2,3), (2,3,4), (3,5,7)} forms a basis for R^3. Justify your answer.",
          difficulty: "easy",
          solution: "A set of vectors forms a basis for R^3 if: (1) there are exactly 3 vectors, (2) they are linearly independent. We have 3 vectors, so we need to check linear independence. Form the matrix with these vectors as columns: [[1,2,3],[2,3,5],[3,4,7]] and compute its determinant. The determinant is 0, indicating these vectors are linearly dependent. Therefore, they do not form a basis for R^3.",
          hints: ["Remember the definition of a basis requires linear independence and spanning", "You can check linear independence by computing the determinant", "Alternatively, see if you can express one vector as a linear combination of the others"]
        },
        {
          id: "linear-algebra-q3",
          prompt: "Find the rank and nullity of the matrix A = [[2,4,6],[1,2,3],[3,6,9]] and verify the Rank-Nullity theorem.",
          difficulty: "medium",
          solution: "Row-reducing the matrix gives: [[1,2,3],[0,0,0],[0,0,0]]. The rank is 1 (number of non-zero rows). For an m x n matrix, the Rank-Nullity Theorem states that rank(A) + nullity(A) = n. Here, n = 3, so nullity(A) = 3 - 1 = 2. This means the dimension of the null space is 2. We can verify by finding a basis for the null space: {[-2,1,0], [-3,0,1]} are linearly independent vectors in the null space.",
          hints: ["Use row reduction to find the rank", "Remember that nullity is the dimension of the null space", "The Rank-Nullity theorem states that rank(A) + nullity(A) = number of columns"]
        },
        {
          id: "linear-algebra-q4",
          prompt: "Diagonalize the matrix A = [[4,-3,0],[2,-1,0],[0,0,2]] if possible. If not, explain why.",
          difficulty: "medium",
          solution: "To diagonalize A, we need n linearly independent eigenvectors. The characteristic equation is (2-lambda)((4-lambda)(-1-lambda)-(-3)(2)) = 0, which simplifies to (2-lambda)(lambda^2 - 3*lambda + 2) = 0. The eigenvalues are lambda = 2 (double) and lambda = 1. For lambda = 2, solving (A-2I)v = 0 gives eigenvectors v_1 = [3,2,0] and v_2 = [0,0,1]. For lambda = 1, we get v_3 = [1,1,0]. These three eigenvectors are linearly independent, so A is diagonalizable as P^-1 A P = diag(2,1,2) where P = [v_1,v_3,v_2].",
          hints: ["Find all eigenvalues first", "For each eigenvalue, find a basis for its eigenspace", "Check if you have enough linearly independent eigenvectors"]
        },
        {
          id: "linear-algebra-q5",
          prompt: "Prove that similar matrices have the same eigenvalues. If A and B are similar matrices with A = P^-1 B P, explain whether they necessarily have the same eigenvectors.",
          difficulty: "hard",
          solution: "If A and B are similar, then A = P^-1 B P for some invertible matrix P. For eigenvalues: If Bv = lambda * v, then P^-1 B P P^-1 v = lambda * P^-1 v, which means A(P^-1 v) = lambda * (P^-1 v). So if v is an eigenvector of B with eigenvalue lambda, then P^-1 v is an eigenvector of A with the same eigenvalue lambda. Therefore, similar matrices have the same eigenvalues. However, they don't necessarily have the same eigenvectors. In fact, if v is an eigenvector of B, then P^-1 v (not v itself) is the corresponding eigenvector of A.",
          hints: ["Consider what happens when you apply both sides of A = P^-1 B P to an eigenvector", "Think about how the transformation P affects eigenvectors", "Remember that eigenvalues are intrinsic properties of the linear transformation"]
        }
      ]
    },
    {
      id: "12",
      icon: "BarChart2",
      title: "Calculus",
      description: "Explore derivatives, integrals, and limits with step-by-step explanations.",
      slug: "calculus",
      category: "Mathematics",
      questions: [
        {
          id: "calculus-q1",
          prompt: "Find the derivative of f(x) = x^3 * sin(x) using the product rule, and verify your answer using the definition of the derivative.",
          difficulty: "easy",
          solution: "Using the product rule: f'(x) = (x^3)' * sin(x) + x^3 * (sin(x))' = 3x^2 * sin(x) + x^3 * cos(x). Using the definition of the derivative: f'(x) = lim(h->0) [f(x+h) - f(x)]/h = lim(h->0) [(x+h)^3 * sin(x+h) - x^3 * sin(x)]/h. Expanding and applying limit laws leads to the same result: 3x^2 * sin(x) + x^3 * cos(x).",
          hints: ["Remember the product rule: (fg)' = f'g + fg'", "For the definition approach, use small angle approximations", "Be careful with the algebra when expanding (x+h)^3"]
        },
        {
          id: "calculus-q2",
          prompt: "Evaluate the definite integral of sin^2(x) * cos^2(x) dx from 0 to pi/2 using an appropriate substitution or identity.",
          difficulty: "easy",
          solution: "Using the identity sin^2(x) * cos^2(x) = (sin(2x)/2)^2, the integral becomes the integral of (sin(2x)/2)^2 dx from 0 to pi/2. Further using sin^2(u) = (1-cos(2u))/2 with u = 2x, we get the integral of (1-cos(4x))/8 dx from 0 to pi/2 = [x/8 - sin(4x)/32] evaluated from 0 to pi/2 = pi/16 - 0 = pi/16.",
          hints: ["Try using double angle formulas", "Remember that sin^2(x) * cos^2(x) = (sin(2x)/2)^2", "Another approach is using sin^2(x) = (1-cos(2x))/2 and cos^2(x) = (1+cos(2x))/2"]
        },
        {
          id: "calculus-q3",
          prompt: "Find the extrema of the function f(x,y) = x^2 + y^2 - 2x - 4y + 5 and classify them as maxima, minima, or saddle points.",
          difficulty: "medium",
          solution: "Computing partial derivatives: df/dx = 2x - 2 and df/dy = 2y - 4. Setting both equal to zero: 2x - 2 = 0 -> x = 1, and 2y - 4 = 0 -> y = 2. So the critical point is (1,2). To classify, compute the Hessian matrix: H = [[d^2f/dx^2 = 2, d^2f/dxdy = 0], [d^2f/dydx = 0, d^2f/dy^2 = 2]]. Since det(H) = 4 > 0 and d^2f/dx^2 > 0, this is a minimum. Computing f(1,2) = 1 + 4 - 2 - 8 + 5 = 0, so the minimum value is 0 at (1,2).",
          hints: ["Set the partial derivatives equal to zero to find critical points", "Use the second derivative test with the Hessian matrix", "Complete the square to rewrite the function in a more revealing form"]
        },
        {
          id: "calculus-q4",
          prompt: "Use the method of Lagrange multipliers to find the maximum and minimum values of f(x,y,z) = xyz subject to the constraint x^2 + y^2 + z^2 = 1.",
          difficulty: "medium",
          solution: "Using Lagrange multipliers, we need grad(f) = lambda * grad(g) where g(x,y,z) = x^2 + y^2 + z^2 - 1. This gives: yz = 2*lambda*x, xz = 2*lambda*y, xy = 2*lambda*z. Multiplying these equations by x, y, and z respectively and adding: 3xyz = 2*lambda*(x^2 + y^2 + z^2) = 2*lambda. So lambda = 3xyz/2. Substituting back: yz = 3xyz^2 / 1, which means z^2 = 1/3 (similarly, x^2 = y^2 = 1/3). Thus, extrema occur at (+-1/sqrt(3), +-1/sqrt(3), +-1/sqrt(3)) with all possible sign combinations. When all signs are the same, f = 1 / (3*sqrt(3)) (maximum); when one sign differs, f = -1 / (3*sqrt(3)) (minimum).",
          hints: ["Set up the Lagrangian L(x,y,z,lambda) = xyz - lambda * (x^2 + y^2 + z^2 - 1)", "From symmetry, consider if x^2 = y^2 = z^2 at the extrema", "Remember to check all possible sign combinations"]
        },
        {
          id: "calculus-q5",
          prompt: "Investigate the convergence of the improper integral of (ln(x)/x) dx from 1 to infinity using appropriate tests, and evaluate it if it converges.",
          difficulty: "hard",
          solution: "Let's examine the integral of (ln(x)/x) dx from 1 to R as R -> infinity. Using the substitution u = ln(x), du = dx/x, we get the integral of u du from 0 to ln(R) = [u^2/2] evaluated from 0 to ln(R) = (ln(R))^2 / 2. As R -> infinity, (ln(R))^2 / 2 -> infinity, so the improper integral diverges. We can verify this by comparison: for large x, ln(x)/x > 1/x^(1+epsilon) for any epsilon > 0, and since the integral of 1/x^(1+epsilon) dx from 1 to infinity converges only for epsilon > 0, our integral must diverge.",
          hints: ["Try the substitution u = ln(x)", "Compare with a known convergent or divergent integral", "Consider integration by parts as an alternative approach"]
        }
      ]
    },
    {
      id: "13",
      icon: "Network",
      title: "Graph Theory",
      description: "Discover the principles of networks, paths, and connectivity through guided problems.",
      slug: "graph-theory",
      category: "Mathematics",
      questions: [
        {
          id: "graph-theory-q1",
          prompt: "Prove that a connected graph with n vertices has at least n-1 edges. When does equality hold?",
          difficulty: "easy",
          solution: "We'll prove by induction on n. Base case: For n=1, a single vertex has 0 edges, which is >= n-1 = 0. Inductive step: Assume true for graphs with k vertices. For a connected graph G with k+1 vertices, remove one vertex v and its incident edges. This may create multiple components G_1, G_2, ..., G_m. Each component has at least one edge connecting to v (otherwise G wouldn't be connected). If n_i is the number of vertices in G_i, then by induction, G_i has at least n_i-1 edges. The total number of edges is at least sum(n_i - 1) + m = (k+1-m) + m = k+1. Equality holds when removing any vertex creates exactly one component, i.e., when G is a tree.",
          hints: ["Try using induction on the number of vertices", "Consider what happens when you remove a vertex and its incident edges", "Think about the minimum structure needed to ensure connectivity"]
        },
        {
          id: "graph-theory-q2",
          prompt: "Determine whether the graph represented by the adjacency matrix [[0,1,1,0], [1,0,1,1], [1,1,0,1], [0,1,1,0]] is bipartite. If it is, provide the bipartition.",
          difficulty: "easy",
          solution: "A graph is bipartite if its vertices can be divided into two disjoint sets such that no vertices within the same set are adjacent. We can check this using a 2-coloring algorithm. Starting with vertex 1, color it red. Its neighbors (2,3) must be blue. Vertex 2's neighbors are 1,3,4, but 3 is already blue, which creates a conflict. Therefore, this graph is not bipartite. We can verify by identifying an odd cycle: vertices 1-2-3-1 form a cycle of length 3.",
          hints: ["Try to 2-color the graph", "Remember a graph is bipartite if and only if it contains no odd cycles", "Consider using breadth-first search for the coloring"]
        },
        {
          id: "graph-theory-q3",
          prompt: "Apply Dijkstra's algorithm to find the shortest path from vertex A to all other vertices in the following weighted graph: Edges: A-B(4), A-C(2), B-C(1), B-D(5), C-D(8), C-E(10), D-E(2), D-F(6), E-F(3).",
          difficulty: "medium",
          solution: "Using Dijkstra's algorithm: Initialize distances: d(A)=0, others=infinity. Visited=[]. Extract A, update d(B)=4, d(C)=2. Visited=[A]. Extract C, update d(B)=min(4,2+1)=3, d(D)=10, d(E)=12. Visited=[A,C]. Extract B, update d(D)=min(10,3+5)=8. Visited=[A,C,B]. Extract D, update d(E)=min(12,8+2)=10, d(F)=14. Visited=[A,C,B,D]. Extract E, update d(F)=min(14,10+3)=13. Visited=[A,C,B,D,E]. Extract F. Final shortest paths: A->B: 3 via C, A->C: 2 direct, A->D: 8 via B, A->E: 10 via D, A->F: 13 via E.",
          hints: ["Maintain a priority queue of vertices ordered by current distance", "Always select the unvisited vertex with the smallest distance", "Update distances when you find a shorter path"]
        },
        {
          id: "graph-theory-q4",
          prompt: "Find all spanning trees of the complete graph K_4, and determine the number of spanning trees in K_n for any n.",
          difficulty: "medium",
          solution: "K_4 has 4 vertices and 6 edges. Any spanning tree must have 3 edges. We need to select 3 edges that don't form a cycle. Starting from any arrangement, we have 4 vertices and C(6,3) = 20 ways to select 3 edges. However, many of these selections contain cycles. Using Cayley's formula, the number of spanning trees in K_n is n^(n-2). For K_4, this gives 4^2 = 16 spanning trees. We can verify by systematic enumeration or by calculating the determinant of the Laplacian matrix.",
          hints: ["Use Cayley's formula: a complete graph K_n has n^(n-2) spanning trees", "Alternatively, apply the Matrix-Tree Theorem using the Laplacian matrix", "For small graphs, consider enumeration by removing edges that don't disconnect the graph"]
        },
        {
          id: "graph-theory-q5",
          prompt: "Prove or disprove: In any simple graph, the sum of the degrees of all vertices is equal to twice the number of edges. Apply this to develop a proof of the handshaking lemma.",
          difficulty: "hard",
          solution: "This statement is true. In a simple graph, each edge connects exactly two vertices, contributing 1 to the degree of each of these vertices. Therefore, when we sum all vertex degrees, each edge is counted exactly twice. So if d(v) represents the degree of vertex v, then sum(d(v)) = 2*|E|, where |E| is the number of edges. The handshaking lemma is a direct consequence: in any graph, the number of vertices with odd degree must be even. Proof: Let V_1 be vertices with odd degree and V_2 be vertices with even degree. Then sum(d(v)) = sum(d(v) for v in V_1) + sum(d(v) for v in V_2). The right side must be even (as sum(d(v) for v in V_2) is even), and we know the left side equals 2*|E|, which is even. Therefore, sum(d(v) for v in V_1) must be even, which is only possible if |V_1| is even.",
          hints: ["Consider what each edge contributes to the degree sum", "For the handshaking lemma, separate vertices into odd and even degree sets", "Remember that the sum of an odd number of odd numbers is odd"]
        }
      ]
    },
    {
      id: "14",
      icon: "BarChart2",
      title: "Statistics",
      description: "Learn probability, distributions, and hypothesis testing with real-world examples.",
      slug: "statistics",
      category: "Mathematics",
      questions: [
        {
          id: "statistics-q1",
          prompt: "A fair coin is tossed 10 times. Calculate the probability of getting exactly 7 heads. What is the expected number of heads?",
          difficulty: "easy",
          solution: "For a fair coin with probability p = 0.5 of heads, the number of heads in n tosses follows a binomial distribution B(n,p). The probability of exactly k heads is given by P(X=k) = C(n,k) * p^k * (1-p)^(n-k), where C(n,k) is the binomial coefficient. For n=10, k=7, p=0.5: P(X=7) = C(10,7) * 0.5^7 * 0.5^3 = 120 * 0.5^10 = 120/1024 = 15/128 is approximately 0.117. The expected number of heads is E(X) = np = 10 * 0.5 = 5.",
          hints: ["Use the binomial probability formula P(X=k) = C(n,k) * p^k * (1-p)^(n-k)", "Calculate C(10,7) = 10!/(7!(10-7)!) = 120", "Remember that for a binomial distribution, E(X) = np"]
        },
        {
          id: "statistics-q2",
          prompt: "The heights of adult males in a certain population are normally distributed with mean mu = 175 cm and standard deviation sigma = 7 cm. What is the probability that a randomly selected adult male has a height greater than 185 cm?",
          difficulty: "easy",
          solution: "For a normal distribution with mean mu and standard deviation sigma, we need to find P(X > 185). First, standardize: z = (185 - 175)/7 = 10/7 is approximately 1.43. Then P(X > 185) = P(Z > 1.43) = 1 - P(Z <= 1.43). From the standard normal table, P(Z <= 1.43) is approximately 0.9236. So P(X > 185) is approximately 1 - 0.9236 = 0.0764 or about 7.64%.",
          hints: ["Standardize the value using z = (x - mu)/sigma", "Use the standard normal table or calculator function", "Verify that you're calculating the correct tail probability"]
        },
        {
          id: "statistics-q3",
          prompt: "A population has a mean of mu = 50 and standard deviation of sigma = 10. A random sample of 64 observations is taken. What is the probability that the sample mean will be less than 48?",
          difficulty: "medium",
          solution: "By the Central Limit Theorem, for large samples (n >= 30), the sampling distribution of the sample mean is approximately normal with mean mu and standard error sigma/sqrt(n). Here, mu = 50 and the standard error is 10/sqrt(64) = 10/8 = 1.25. We need P(X_bar < 48). Standardizing: z = (48 - 50)/1.25 = -2/1.25 = -1.6. From the standard normal table, P(Z < -1.6) is approximately 0.0548. So there's about a 5.48% probability that the sample mean will be less than 48.",
          hints: ["Apply the Central Limit Theorem for the sampling distribution", "Calculate the standard error of the mean: sigma/sqrt(n)", "Standardize the sample mean to find the z-score"]
        },
        {
          id: "statistics-q4",
          prompt: "Two independent random samples are drawn from populations with population variances sigma_1^2 = 25 and sigma_2^2 = 36. The first sample has n_1 = 40 observations with sample mean x_bar_1 = 85, and the second has n_2 = 50 observations with sample mean x_bar_2 = 82. Construct a 95% confidence interval for the difference in population means mu_1 - mu_2.",
          difficulty: "medium",
          solution: "For independent samples with known population variances, a 95% confidence interval for mu_1 - mu_2 is given by (x_bar_1 - x_bar_2) +- z_0.025 * sqrt(sigma_1^2/n_1 + sigma_2^2/n_2). Here, x_bar_1 - x_bar_2 = 85 - 82 = 3, z_0.025 = 1.96, and sqrt(sigma_1^2/n_1 + sigma_2^2/n_2) = sqrt(25/40 + 36/50) = sqrt(0.625 + 0.72) = sqrt(1.345) is approximately 1.16. So the 95% confidence interval is 3 +- 1.96(1.16) = 3 +- 2.27 = (0.73, 5.27).",
          hints: ["Remember the formula for a confidence interval for the difference in means", "Calculate the standard error of the difference: sqrt(sigma_1^2/n_1 + sigma_2^2/n_2)", "For a 95% confidence interval, use z = 1.96"]
        },
        {
          id: "statistics-q5",
          prompt: "A pharmaceutical company claims that a new drug reduces cholesterol by at least 15% on average. In a clinical trial with 45 patients, the mean reduction was 13.8% with a sample standard deviation of 4.2%. Conduct a hypothesis test to evaluate the company's claim at a significance level of alpha = 0.05.",
          difficulty: "hard",
          solution: "We'll test H_0: mu >= 15 vs H_1: mu < 15 (one-tailed test). Test statistic: t = (x_bar - mu_0)/(s/sqrt(n)) = (13.8 - 15)/(4.2/sqrt(45)) = -1.2/0.626 = -1.917. With df = 44, the critical t-value for alpha = 0.05 (one-tailed) is approximately -1.68. Since -1.917 < -1.68, we reject H_0. Alternatively, the p-value = P(t < -1.917) is approximately 0.031 < 0.05, leading to the same conclusion. There is sufficient evidence to conclude that the drug does not reduce cholesterol by at least 15% on average, contradicting the company's claim.",
          hints: ["Set up the null and alternative hypotheses carefully", "Use a one-sample t-test since the population standard deviation is unknown", "Calculate the test statistic and compare to the critical value or find the p-value"]
        }
      ]
    }
  ];
};

export const getAllTopics = (): Topic[] => {
  return [...getDSATopics(), ...getMathTopics()];
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

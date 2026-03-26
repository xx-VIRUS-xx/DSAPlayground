/* =============================================
   DSA Playground — Content Data
   All topic content, code snippets, quizzes
   ============================================= */

const CONTENT = {

// ─────────────────────────────────────────────
// PROBLEM SOLVING APPROACH
// ─────────────────────────────────────────────
approach: {
    title: "🎯 How to Approach Any Coding Problem",
    desc: "A repeatable 5-step framework that works for any LeetCode, HackerRank, or interview problem.",
    steps: [
        {
            title: "Understand the Problem",
            points: [
                "Read the problem statement 2–3 times. Don't rush.",
                "Identify <strong>inputs</strong>, <strong>outputs</strong>, and <strong>constraints</strong>.",
                "Ask clarifying questions: Can inputs be negative? Empty? Sorted?",
                "Walk through provided examples by hand. Create your own edge cases.",
                "Restate the problem in your own words."
            ]
        },
        {
            title: "Identify the Pattern",
            points: [
                "Does it involve searching in sorted data? → <strong>Binary Search</strong>",
                "Need to track pairs or compare from both ends? → <strong>Two Pointers</strong>",
                "Subarray/substring of fixed or variable size? → <strong>Sliding Window</strong>",
                "Making optimal choices at each step? → <strong>Greedy</strong>",
                "Overlapping subproblems? → <strong>Dynamic Programming</strong>",
                "Exploring all paths or combinations? → <strong>Backtracking / DFS</strong>",
                "Level-by-level tree processing? → <strong>BFS</strong>",
                "See the full Patterns section for all 14 core patterns."
            ]
        },
        {
            title: "Plan Your Approach (Before Writing Code!)",
            points: [
                "Write pseudocode or bullet-point steps.",
                "Identify the data structures you'll need (hashmap, stack, heap, etc.).",
                "Determine the time and space complexity of your approach.",
                "Start with the brute force, then optimize.",
                "Discuss trade-offs: Can you trade space for time?"
            ]
        },
        {
            title: "Implement the Solution",
            points: [
                "Translate your pseudocode into clean code.",
                "Use meaningful variable names (left, right, not i, j when doing two pointers).",
                "Handle edge cases at the top of your function.",
                "Write modular code — extract helper functions when logic gets complex.",
                "Don't optimize prematurely; get a working solution first."
            ]
        },
        {
            title: "Test & Optimize",
            points: [
                "Dry-run your code with the given examples.",
                "Test with edge cases: empty input, single element, max constraint values.",
                "Analyze actual time/space complexity vs. the problem constraints.",
                "Can you improve? Often O(n²) brute force → O(n log n) or O(n) with the right pattern.",
                "If stuck, explain your approach out loud (rubber duck debugging)."
            ]
        }
    ],
    tips: [
        { type: "tip", title: "The 45-Minute Rule", text: "In interviews, spend the first 10 minutes understanding & planning, 25 minutes coding, and 10 minutes testing. Most people rush into coding and waste time debugging." },
        { type: "tip", title: "Think Out Loud", text: "Interviewers want to see your thought process more than a perfect solution. Narrate your thinking, mention trade-offs, and explain why you chose a particular approach." },
        { type: "warn", title: "Common Mistake", text: "Don't jump to the optimal solution immediately. Start with brute force, explain its complexity, then improve. This shows structured thinking." }
    ]
},

// ─────────────────────────────────────────────
// LEETCODE PATTERNS
// ─────────────────────────────────────────────
patterns: [
    {
        id: "two-pointers",
        title: "Two Pointers",
        icon: "👉👈",
        difficulty: "Easy-Medium",
        description: "Use two pointers to traverse data from different positions (start/end, slow/fast) to solve problems in O(n) instead of O(n²).",
        whenToUse: [
            "Sorted array or linked list problems",
            "Finding pairs that satisfy a condition",
            "Removing duplicates in-place",
            "Comparing elements from both ends"
        ],
        howItWorks: "Place one pointer at the start and one at the end (or two at the start moving at different speeds). Move them towards each other based on a condition until they meet.",
        examples: [
            "Two Sum II (sorted array)",
            "3Sum",
            "Container With Most Water",
            "Remove Duplicates from Sorted Array",
            "Trapping Rain Water"
        ],
        code: {
            lang: "python",
            title: "Two Sum II — Sorted Array",
            code: `def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1    # Need bigger sum
        else:
            right -= 1   # Need smaller sum

    return [-1, -1]  # No solution found`
        },
        complexity: { time: "O(n)", space: "O(1)" },
        quiz: {
            question: "When is Two Pointers NOT ideal?",
            options: [
                "When the array is sorted",
                "When the array is unsorted and you need to find pairs",
                "When comparing elements from opposite ends",
                "When removing duplicates in-place"
            ],
            correct: 1,
            explanation: "Two pointers on an unsorted array usually requires sorting first (O(n log n)), or you should use a hash map instead for O(n) lookup."
        }
    },
    {
        id: "sliding-window",
        title: "Sliding Window",
        icon: "🪟",
        difficulty: "Medium",
        description: "Maintain a window (subarray/substring) that slides through data. Avoids recomputing from scratch — instead, add/remove elements as the window moves.",
        whenToUse: [
            "Maximum/minimum subarray or substring of size k",
            "Longest substring with at most k distinct characters",
            "Finding anagram occurrences in a string",
            "Any contiguous sequence optimization"
        ],
        howItWorks: "Start with a window at the beginning. Expand the right end to include elements. When the window condition is violated, shrink from the left. Track the optimal answer.",
        examples: [
            "Maximum Sum Subarray of Size K",
            "Longest Substring Without Repeating Characters",
            "Minimum Window Substring",
            "Permutation in String",
            "Fruits Into Baskets"
        ],
        code: {
            lang: "python",
            title: "Longest Substring Without Repeating Characters",
            code: `def length_of_longest_substring(s):
    char_index = {}  # char -> last seen index
    left = 0
    max_len = 0

    for right in range(len(s)):
        if s[right] in char_index:
            # Move left past the repeated char
            left = max(left, char_index[s[right]] + 1)

        char_index[s[right]] = right
        max_len = max(max_len, right - left + 1)

    return max_len`
        },
        complexity: { time: "O(n)", space: "O(min(n, m)) where m = charset size" },
        quiz: {
            question: "What makes Sliding Window better than brute force for subarray problems?",
            options: [
                "It uses less memory",
                "It avoids recomputing the entire window when it moves",
                "It can handle unsorted arrays",
                "It only works on strings"
            ],
            correct: 1,
            explanation: "Sliding window incrementally updates the window state (add new element, remove old) instead of recomputing from scratch for every position, reducing O(n×k) to O(n)."
        }
    },
    {
        id: "fast-slow",
        title: "Fast & Slow Pointers",
        icon: "🐇🐢",
        difficulty: "Easy-Medium",
        description: "Also called Floyd's Tortoise and Hare. Two pointers move at different speeds to detect cycles, find middle elements, or solve linked list puzzles.",
        whenToUse: [
            "Detecting cycles in linked lists or arrays",
            "Finding the middle of a linked list",
            "Finding the start of a cycle",
            "Happy Number problem"
        ],
        howItWorks: "Slow pointer moves 1 step, fast moves 2 steps. If there's a cycle, they'll meet. If fast reaches the end, there's no cycle. The meeting point reveals cycle properties.",
        examples: [
            "Linked List Cycle (I & II)",
            "Find the Middle of Linked List",
            "Happy Number",
            "Find the Duplicate Number",
            "Palindrome Linked List"
        ],
        code: {
            lang: "python",
            title: "Detect Cycle in Linked List",
            code: `def has_cycle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next          # 1 step
        fast = fast.next.next     # 2 steps

        if slow == fast:
            return True   # Cycle detected!

    return False  # No cycle

def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Reset one pointer to head
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow  # Cycle start
    return None`
        },
        complexity: { time: "O(n)", space: "O(1)" },
        quiz: {
            question: "Why does slow pointer move 1 step and fast 2 steps?",
            options: [
                "It's faster than using a hash set",
                "They will always meet inside the cycle if one exists",
                "It minimizes memory usage",
                "It doesn't matter, any different speeds work"
            ],
            correct: 1,
            explanation: "With speeds 1 and 2, the fast pointer closes the gap by 1 node per iteration. This guarantees they meet within one full cycle traversal of the slow pointer."
        }
    },
    {
        id: "merge-intervals",
        title: "Merge Intervals",
        icon: "📐",
        difficulty: "Medium",
        description: "Sort intervals by start time, then merge overlapping ones by comparing the end of the current interval with the start of the next.",
        whenToUse: [
            "Merging overlapping intervals",
            "Inserting into sorted intervals",
            "Finding gaps between intervals",
            "Meeting room scheduling problems"
        ],
        howItWorks: "Sort by start time. Iterate and check if the current interval overlaps the previous. If yes, merge by extending the end. If no, add as a new interval.",
        examples: [
            "Merge Intervals",
            "Insert Interval",
            "Non-overlapping Intervals",
            "Meeting Rooms I & II",
            "Interval List Intersections"
        ],
        code: {
            lang: "python",
            title: "Merge Overlapping Intervals",
            code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        last_end = merged[-1][1]

        if start <= last_end:  # Overlapping
            merged[-1][1] = max(last_end, end)
        else:
            merged.append([start, end])

    return merged

# Example: [[1,3],[2,6],[8,10],[15,18]]
# → [[1,6],[8,10],[15,18]]`
        },
        complexity: { time: "O(n log n)", space: "O(n)" },
        quiz: {
            question: "Why is sorting essential for merge intervals?",
            options: [
                "It reduces space complexity",
                "It ensures overlapping intervals are adjacent for easy merging",
                "It makes the output sorted",
                "It's not essential, just a preference"
            ],
            correct: 1,
            explanation: "Without sorting, overlapping intervals could be anywhere in the list, requiring O(n²) comparisons. Sorting makes them adjacent so a single pass works."
        }
    },
    {
        id: "binary-search",
        title: "Modified Binary Search",
        icon: "🔍",
        difficulty: "Medium",
        description: "Classic binary search with variations: search in rotated arrays, find boundaries, search in 2D matrices, and more.",
        whenToUse: [
            "Searching in sorted arrays",
            "Finding first/last occurrence",
            "Searching in rotated sorted arrays",
            "Finding a peak element",
            "Minimizing/maximizing a value (binary search on answer)"
        ],
        howItWorks: "Divide search space in half each step. Adjust left/right boundaries based on the problem condition. Key insight: binary search works any time you can eliminate half the search space.",
        examples: [
            "Search in Rotated Sorted Array",
            "Find Minimum in Rotated Array",
            "Search a 2D Matrix",
            "Find Peak Element",
            "Koko Eating Bananas (Binary Search on Answer)"
        ],
        code: {
            lang: "python",
            title: "Binary Search Variants",
            code: `# Standard Binary Search
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Find First Occurrence (Left Boundary)
def find_first(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            result = mid
            right = mid - 1  # Keep searching left
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

# Search in Rotated Sorted Array
def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`
        },
        complexity: { time: "O(log n)", space: "O(1)" },
        quiz: {
            question: "Why use `mid = left + (right - left) // 2` instead of `(left + right) // 2`?",
            options: [
                "It's faster",
                "It avoids integer overflow for large values",
                "It gives a different result",
                "It handles negative numbers better"
            ],
            correct: 1,
            explanation: "When left + right exceeds the integer limit (in languages like C++/Java), it overflows. left + (right - left) // 2 avoids this. In Python it doesn't matter, but it's good practice."
        }
    },
    {
        id: "dfs-tree",
        title: "Tree DFS (Depth-First)",
        icon: "🌳",
        difficulty: "Easy-Medium",
        description: "Traverse a tree depth-first using recursion or a stack. Handles path problems, subtree checks, and tree construction.",
        whenToUse: [
            "Path sum problems",
            "Tree diameter / max depth",
            "Serialize / deserialize trees",
            "Validating BST properties",
            "Lowest Common Ancestor"
        ],
        howItWorks: "Start at root. Process current node (preorder), recurse on left subtree, recurse on right subtree. Variations: inorder (left, root, right) and postorder (left, right, root).",
        examples: [
            "Maximum Depth of Binary Tree",
            "Path Sum I, II, III",
            "Diameter of Binary Tree",
            "Validate BST",
            "Lowest Common Ancestor"
        ],
        code: {
            lang: "python",
            title: "Tree DFS Patterns",
            code: `# Max Depth (simple recursion)
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left),
                    max_depth(root.right))

# Path Sum
def has_path_sum(root, target):
    if not root:
        return False
    if not root.left and not root.right:
        return root.val == target
    return (has_path_sum(root.left, target - root.val) or
            has_path_sum(root.right, target - root.val))

# Validate BST (carry range down)
def is_valid_bst(root, lo=float('-inf'), hi=float('inf')):
    if not root:
        return True
    if not (lo < root.val < hi):
        return False
    return (is_valid_bst(root.left, lo, root.val) and
            is_valid_bst(root.right, root.val, hi))`
        },
        complexity: { time: "O(n)", space: "O(h) where h = tree height" },
        quiz: {
            question: "What is the space complexity of DFS on a skewed tree (worst case)?",
            options: [
                "O(1)",
                "O(log n)",
                "O(n)",
                "O(n²)"
            ],
            correct: 2,
            explanation: "A skewed tree has height n (every node has only one child), so the recursion stack uses O(n) space. For balanced trees, it's O(log n)."
        }
    },
    {
        id: "bfs-tree",
        title: "Tree BFS (Level-Order)",
        icon: "🌊",
        difficulty: "Medium",
        description: "Process a tree level by level using a queue. Essential for level-order traversal, zigzag, right-side view, and shortest path in unweighted graphs.",
        whenToUse: [
            "Level-order traversal",
            "Shortest path in unweighted graph",
            "Connecting nodes at the same level",
            "Zigzag traversal",
            "Finding depth-related properties"
        ],
        howItWorks: "Use a queue. Start with root. For each level, process all nodes in the queue, adding their children. The queue size at each step = number of nodes at that level.",
        examples: [
            "Binary Tree Level Order Traversal",
            "Binary Tree Zigzag Traversal",
            "Binary Tree Right Side View",
            "Minimum Depth of Binary Tree",
            "Connect Level Order Siblings"
        ],
        code: {
            lang: "python",
            title: "Level-Order Traversal",
            code: `from collections import deque

def level_order(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        current_level = []

        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(current_level)

    return result
# Output: [[3], [9, 20], [15, 7]]`
        },
        complexity: { time: "O(n)", space: "O(w) where w = max width" },
        quiz: {
            question: "What data structure is used for BFS?",
            options: ["Stack", "Queue", "Heap", "Hash Map"],
            correct: 1,
            explanation: "BFS uses a queue (FIFO) to process nodes level by level. DFS uses a stack (LIFO) — either explicitly or via recursion."
        }
    },
    {
        id: "subsets",
        title: "Subsets / Backtracking",
        icon: "🎲",
        difficulty: "Medium",
        description: "Generate all subsets, permutations, or combinations using backtracking. Add an element, recurse, then undo (backtrack) to explore all paths.",
        whenToUse: [
            "Generate all subsets or combinations",
            "Permutation generation",
            "Solving constraint satisfaction (Sudoku, N-Queens)",
            "Finding all valid paths",
            "Problems that say 'find all possible ...'"
        ],
        howItWorks: "At each step, you have a choice: include or exclude the current element. Recurse with both choices. When you've processed all elements, you have one complete subset. Backtrack by removing the last choice.",
        examples: [
            "Subsets I & II",
            "Permutations I & II",
            "Combination Sum I, II, III",
            "Letter Combinations of a Phone Number",
            "N-Queens"
        ],
        code: {
            lang: "python",
            title: "Subsets & Permutations",
            code: `# All Subsets
def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])  # Add copy
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()  # Backtrack!
    backtrack(0, [])
    return result

# All Permutations
def permutations(nums):
    result = []
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current,
                      remaining[:i] + remaining[i+1:])
            current.pop()  # Backtrack!
    backtrack([], nums)
    return result`
        },
        complexity: { time: "O(n × 2ⁿ) for subsets, O(n × n!) for permutations", space: "O(n) recursion depth" },
        quiz: {
            question: "What does 'backtracking' mean in this context?",
            options: [
                "Going back to the start of the array",
                "Undoing the last choice to explore alternative paths",
                "Using a stack to reverse the order",
                "Searching from right to left"
            ],
            correct: 1,
            explanation: "Backtracking means after exploring one path (e.g., including element X), you undo that choice (remove X) and try the next option. This explores all possible combinations."
        }
    },
    {
        id: "top-k",
        title: "Top K Elements",
        icon: "🏆",
        difficulty: "Medium",
        description: "Use a heap (priority queue) to efficiently find the K largest/smallest/most frequent elements without fully sorting.",
        whenToUse: [
            "Find K largest or smallest elements",
            "K most frequent elements",
            "K closest points to origin",
            "Merge K sorted lists",
            "Running median"
        ],
        howItWorks: "For top K largest: use a min-heap of size K. For each element, if it's larger than the heap's minimum, replace it. The heap always holds the K largest. Time: O(n log k) instead of O(n log n).",
        examples: [
            "Kth Largest Element in Array",
            "Top K Frequent Elements",
            "K Closest Points to Origin",
            "Sort Characters by Frequency",
            "Find Median from Data Stream"
        ],
        code: {
            lang: "python",
            title: "Top K Patterns",
            code: `import heapq

# Kth Largest Element
def find_kth_largest(nums, k):
    # Min-heap of size k
    heap = nums[:k]
    heapq.heapify(heap)

    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)

    return heap[0]  # Kth largest

# Top K Frequent Elements
def top_k_frequent(nums, k):
    from collections import Counter
    count = Counter(nums)
    # nlargest returns k items with highest counts
    return heapq.nlargest(k, count.keys(),
                          key=count.get)

# K Closest Points to Origin
def k_closest(points, k):
    # Max-heap (negate distance for max behavior)
    heap = []
    for x, y in points:
        dist = -(x*x + y*y)
        if len(heap) < k:
            heapq.heappush(heap, (dist, x, y))
        elif dist > heap[0][0]:
            heapq.heapreplace(heap, (dist, x, y))
    return [[x, y] for (_, x, y) in heap]`
        },
        complexity: { time: "O(n log k)", space: "O(k)" },
        quiz: {
            question: "Why use a min-heap (not max-heap) to find the K largest elements?",
            options: [
                "Min-heap is faster",
                "The root of a size-K min-heap is the Kth largest—we evict small elements",
                "Max-heap doesn't support removal",
                "Min-heap uses less memory"
            ],
            correct: 1,
            explanation: "A min-heap of size K always keeps the K largest seen so far. The root (minimum of the heap) is the Kth largest. Elements smaller than the root are ignored."
        }
    },
    {
        id: "dp",
        title: "Dynamic Programming",
        icon: "🧮",
        difficulty: "Medium-Hard",
        description: "Break problems into overlapping subproblems. Store results to avoid recomputation. The key is defining the state and transition.",
        whenToUse: [
            "Optimization problems (min/max cost, paths, etc.)",
            "Counting problems (number of ways to...)",
            "String matching / edit distance",
            "When recursion has overlapping subproblems",
            "Problems with 'optimal substructure'"
        ],
        howItWorks: "1) Define state: what does dp[i] represent? 2) Find transition: how does dp[i] relate to previous states? 3) Set base cases. 4) Choose top-down (memoization) or bottom-up (tabulation).",
        examples: [
            "Climbing Stairs",
            "Coin Change",
            "Longest Common Subsequence",
            "0/1 Knapsack",
            "House Robber",
            "Edit Distance"
        ],
        code: {
            lang: "python",
            title: "DP Patterns",
            code: `# Climbing Stairs (Fibonacci-style)
def climb_stairs(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1

# Coin Change (minimum coins)
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

# Longest Common Subsequence
def lcs(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

# 0/1 Knapsack
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0]*(capacity+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(capacity+1):
            dp[i][w] = dp[i-1][w]  # Don't take
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w-weights[i-1]] + values[i-1])`
        },
        complexity: { time: "Varies — typically O(n×m) or O(n×W)", space: "Often optimizable to O(n) with rolling array" },
        quiz: {
            question: "What distinguishes DP from plain recursion?",
            options: [
                "DP is always bottom-up",
                "DP stores results of subproblems to avoid recomputation",
                "DP only works on arrays",
                "DP doesn't use recursion"
            ],
            correct: 1,
            explanation: "DP = recursion + memoization. By caching subproblem results (either top-down with a memo dict, or bottom-up with a table), we avoid solving the same subproblem multiple times."
        }
    },
    {
        id: "monotonic-stack",
        title: "Monotonic Stack",
        icon: "📚",
        difficulty: "Medium-Hard",
        description: "A stack that maintains elements in increasing or decreasing order. Used to find the next greater/smaller element efficiently.",
        whenToUse: [
            "Next Greater Element problems",
            "Daily Temperatures (days until warmer)",
            "Largest Rectangle in Histogram",
            "Stock span problems",
            "Trapping Rain Water"
        ],
        howItWorks: "Iterate through elements. Before pushing, pop all elements that violate the monotonic property. Each popped element found its 'answer' (next greater/smaller). This gives O(n) because each element is pushed and popped at most once.",
        examples: [
            "Next Greater Element I & II",
            "Daily Temperatures",
            "Largest Rectangle in Histogram",
            "Trapping Rain Water",
            "Online Stock Span"
        ],
        code: {
            lang: "python",
            title: "Next Greater Element & Daily Temperatures",
            code: `# Daily Temperatures
# For each day, find how many days until warmer
def daily_temperatures(temperatures):
    n = len(temperatures)
    result = [0] * n
    stack = []  # Stack of indices (decreasing temps)

    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)

    return result

# Next Greater Element
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []  # Decreasing stack of indices

    for i in range(len(nums)):
        while stack and nums[i] > nums[stack[-1]]:
            result[stack.pop()] = nums[i]
        stack.append(i)

    return result`
        },
        complexity: { time: "O(n)", space: "O(n)" },
        quiz: {
            question: "Why is monotonic stack O(n) despite having a while loop inside a for loop?",
            options: [
                "The while loop only runs once",
                "Each element is pushed and popped at most once across all iterations",
                "The stack never grows beyond size 2",
                "It uses amortized analysis and is actually O(n²)"
            ],
            correct: 1,
            explanation: "Each element enters the stack once and leaves once. Total operations across all iterations = 2n. The inner while loop's total work across the entire for loop is bounded by n pops."
        }
    },
    {
        id: "graph-patterns",
        title: "Graph BFS / DFS",
        icon: "🕸️",
        difficulty: "Medium",
        description: "Traverse graphs using BFS (shortest path, level exploration) or DFS (path finding, cycle detection, connected components).",
        whenToUse: [
            "Shortest path in unweighted graph → BFS",
            "Connected components / islands → DFS or BFS",
            "Cycle detection → DFS with coloring",
            "Topological ordering → DFS or BFS (Kahn's)",
            "Bipartite check → BFS/DFS with coloring"
        ],
        howItWorks: "Represent graph as adjacency list. Use visited set to avoid re-visiting. BFS uses queue (level-by-level), DFS uses stack/recursion (go deep first).",
        examples: [
            "Number of Islands",
            "Clone Graph",
            "Course Schedule (cycle detection)",
            "Word Ladder (shortest transformation)",
            "Pacific Atlantic Water Flow"
        ],
        code: {
            lang: "python",
            title: "Graph BFS & DFS",
            code: `from collections import deque

# Number of Islands (DFS)
def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if (r < 0 or r >= rows or c < 0 or
            c >= cols or grid[r][c] == '0'):
            return
        grid[r][c] = '0'  # Mark visited
        dfs(r+1, c); dfs(r-1, c)
        dfs(r, c+1); dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count

# BFS Shortest Path
def shortest_path(graph, start, end):
    queue = deque([(start, [start])])
    visited = {start}

    while queue:
        node, path = queue.popleft()
        if node == end:
            return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return []  # No path found`
        },
        complexity: { time: "O(V + E)", space: "O(V)" },
        quiz: {
            question: "When should you use BFS over DFS for graphs?",
            options: [
                "When the graph is a tree",
                "When you need the shortest path in an unweighted graph",
                "When you need to find all paths",
                "When the graph is dense"
            ],
            correct: 1,
            explanation: "BFS explores nodes level by level, so the first time it reaches the target, it's via the shortest path (fewest edges). DFS may find a longer path first."
        }
    },
    {
        id: "topo-sort",
        title: "Topological Sort",
        icon: "🔄",
        difficulty: "Medium-Hard",
        description: "Linear ordering of vertices in a DAG (Directed Acyclic Graph) such that for every edge u→v, u comes before v. Essential for dependency resolution.",
        whenToUse: [
            "Course scheduling with prerequisites",
            "Build system dependency ordering",
            "Task scheduling",
            "Detecting cycles in directed graphs",
            "Alien dictionary problems"
        ],
        howItWorks: "Kahn's Algorithm (BFS): Calculate in-degrees. Start with nodes having in-degree 0. Process them, reduce neighbors' in-degrees. Repeat. If all nodes processed → valid ordering; else → cycle exists.",
        examples: [
            "Course Schedule I & II",
            "Alien Dictionary",
            "Minimum Height Trees",
            "Sequence Reconstruction",
            "Parallel Courses"
        ],
        code: {
            lang: "python",
            title: "Topological Sort (Kahn's Algorithm)",
            code: `from collections import deque, defaultdict

def topological_sort(num_courses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * num_courses

    # Build graph
    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    # Start with nodes having no prerequisites
    queue = deque()
    for i in range(num_courses):
        if in_degree[i] == 0:
            queue.append(i)

    order = []
    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we processed all nodes, no cycle
    if len(order) == num_courses:
        return order
    return []  # Cycle exists!`
        },
        complexity: { time: "O(V + E)", space: "O(V + E)" },
        quiz: {
            question: "What happens if the directed graph has a cycle?",
            options: [
                "Topological sort returns the cycle",
                "Topological sort is impossible—no valid ordering exists",
                "It just skips the cyclic nodes",
                "It reverses the cycle edges"
            ],
            correct: 1,
            explanation: "Topological sort only works on DAGs (Directed Acyclic Graphs). If there's a cycle, nodes in the cycle never reach in-degree 0, so not all nodes get processed."
        }
    },
    {
        id: "greedy",
        title: "Greedy Algorithms",
        icon: "💰",
        difficulty: "Medium",
        description: "Make the locally optimal choice at each step, hoping it leads to the globally optimal solution. Works when the greedy choice property holds.",
        whenToUse: [
            "Activity selection / interval scheduling",
            "Huffman coding",
            "Minimum number of coins (with standard denominations)",
            "Jump Game problems",
            "Task scheduling for maximum profit"
        ],
        howItWorks: "At each step, pick the best available option without reconsidering past choices. Key: prove that the greedy choice at each step leads to an optimal solution (exchange argument).",
        examples: [
            "Jump Game I & II",
            "Gas Station",
            "Task Scheduler",
            "Non-overlapping Intervals",
            "Partition Labels"
        ],
        code: {
            lang: "python",
            title: "Greedy Patterns",
            code: `# Jump Game - Can you reach the end?
def can_jump(nums):
    max_reach = 0
    for i in range(len(nums)):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + nums[i])
    return True

# Jump Game II - Min jumps to reach end
def jump(nums):
    jumps = 0
    current_end = 0
    farthest = 0

    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest

    return jumps

# Partition Labels
def partition_labels(s):
    last = {c: i for i, c in enumerate(s)}
    start = end = 0
    result = []

    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            result.append(end - start + 1)
            start = end + 1

    return result`
        },
        complexity: { time: "Typically O(n) or O(n log n)", space: "O(1) to O(n)" },
        quiz: {
            question: "How do you know if greedy will give the optimal answer?",
            options: [
                "If the problem is easy",
                "If the problem has the greedy choice property and optimal substructure",
                "If brute force is too slow",
                "Greedy always gives the optimal answer"
            ],
            correct: 1,
            explanation: "Greedy works when (1) making the locally best choice doesn't prevent finding the global optimum (greedy choice property), and (2) the optimal solution contains optimal solutions to subproblems."
        }
    }
],

// ─────────────────────────────────────────────
// DATA STRUCTURES
// ─────────────────────────────────────────────
dataStructures: [
    {
        id: "arrays",
        title: "Arrays & Strings",
        icon: "📏",
        description: "Contiguous memory. O(1) random access, O(n) insert/delete. The foundation of most interview problems.",
        keyPoints: [
            "Fixed size (static) or dynamic (Python list, Java ArrayList)",
            "Random access O(1) by index",
            "Insert/delete at end: O(1) amortized; at beginning/middle: O(n)",
            "Strings are essentially character arrays (immutable in Python/Java)",
            "Common techniques: Two Pointers, Sliding Window, Prefix Sum"
        ],
        operations: {
            "Access by index": "O(1)",
            "Search (unsorted)": "O(n)",
            "Search (sorted)": "O(log n)",
            "Insert at end": "O(1) amortized",
            "Insert at index": "O(n)",
            "Delete at index": "O(n)"
        },
        code: {
            lang: "python",
            title: "Common Array Patterns",
            code: `# Prefix Sum - Range sum queries in O(1)
def prefix_sum(nums):
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    # Sum from i to j = prefix[j+1] - prefix[i]
    return prefix

# Kadane's Algorithm - Max subarray sum
def max_subarray(nums):
    max_sum = current = nums[0]
    for num in nums[1:]:
        current = max(num, current + num)
        max_sum = max(max_sum, current)
    return max_sum

# Two-pass technique - Product of Array Except Self
def product_except_self(nums):
    n = len(nums)
    result = [1] * n
    # Left products
    left = 1
    for i in range(n):
        result[i] = left
        left *= nums[i]
    # Right products
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    return result`
        }
    },
    {
        id: "hashmaps",
        title: "Hash Maps & Sets",
        icon: "🗂️",
        description: "Key-value store with O(1) average lookup, insert, delete. The single most useful data structure for interviews.",
        keyPoints: [
            "Hash function maps keys to bucket indices",
            "Average O(1) for get, put, delete; worst case O(n) with collisions",
            "Collision handling: chaining (linked lists) or open addressing",
            "HashSet: only stores keys (unique elements)",
            "Use for counting, grouping, quick lookups, and duplicate detection"
        ],
        operations: {
            "Insert": "O(1) avg",
            "Lookup": "O(1) avg",
            "Delete": "O(1) avg",
            "Worst case (all)": "O(n)"
        },
        code: {
            lang: "python",
            title: "Hash Map Patterns",
            code: `# Two Sum (classic hash map usage)
def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Group Anagrams
def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = tuple(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())

# Frequency Counter pattern
from collections import Counter
def top_k_frequent(nums, k):
    count = Counter(nums)
    return [x for x, _ in count.most_common(k)]`
        }
    },
    {
        id: "linked-lists",
        title: "Linked Lists",
        icon: "🔗",
        description: "Nodes connected by pointers. O(1) insert/delete at known position, O(n) access. Common in pointer manipulation problems.",
        keyPoints: [
            "Singly linked: each node points to next",
            "Doubly linked: each node points to next AND prev",
            "No random access — must traverse from head",
            "Very common in interviews: reversal, cycle detection, merging",
            "Dummy head node simplifies edge cases"
        ],
        operations: {
            "Access by index": "O(n)",
            "Insert at head": "O(1)",
            "Insert at tail": "O(1) with tail pointer",
            "Delete node": "O(1) if reference given",
            "Search": "O(n)"
        },
        code: {
            lang: "python",
            title: "Linked List Operations",
            code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Reverse a Linked List
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev

# Merge Two Sorted Lists
def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    current = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    current.next = l1 or l2
    return dummy.next

# Find Middle (fast/slow pointers)
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`
        }
    },
    {
        id: "stacks-queues",
        title: "Stacks & Queues",
        icon: "📦",
        description: "Stack: LIFO (Last In, First Out). Queue: FIFO (First In, First Out). Essential for parsing, BFS, DFS, and undo operations.",
        keyPoints: [
            "Stack: push/pop from top — O(1). Used in DFS, parsing, undo",
            "Queue: enqueue at back, dequeue from front — O(1). Used in BFS",
            "Deque: double-ended queue — O(1) at both ends",
            "Monotonic Stack: maintains sorted order for next greater/smaller",
            "Priority Queue (Heap): dequeue by priority, not order"
        ],
        operations: {
            "Stack push/pop": "O(1)",
            "Stack peek": "O(1)",
            "Queue enqueue/dequeue": "O(1)",
            "Queue peek": "O(1)"
        },
        code: {
            lang: "python",
            title: "Stack & Queue Patterns",
            code: `# Valid Parentheses (Stack)
def is_valid(s):
    stack = []
    matching = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in matching:
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return len(stack) == 0

# Min Stack (O(1) getMin)
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def getMin(self):
        return self.min_stack[-1]

# Implement Queue using Two Stacks
class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x):
        self.in_stack.append(x)

    def pop(self):
        self._transfer()
        return self.out_stack.pop()

    def _transfer(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())`
        }
    },
    {
        id: "trees",
        title: "Trees (Binary Tree, BST)",
        icon: "🌲",
        description: "Hierarchical data structure. Binary Search Trees enable O(log n) operations when balanced. Fundamental to many interview problems.",
        keyPoints: [
            "Binary Tree: each node has at most 2 children",
            "BST: left child < parent < right child",
            "Balanced BST (AVL, Red-Black): guarantees O(log n) height",
            "Traversals: Inorder (L,Root,R), Preorder (Root,L,R), Postorder (L,R,Root)",
            "BST inorder traversal gives sorted order"
        ],
        operations: {
            "Search (BST balanced)": "O(log n)",
            "Insert (BST balanced)": "O(log n)",
            "Delete (BST balanced)": "O(log n)",
            "Traversal": "O(n)",
            "Space (all)": "O(n)"
        },
        code: {
            lang: "python",
            title: "Tree Operations",
            code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Inorder Traversal (iterative)
def inorder(root):
    result, stack = [], []
    current = root
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right
    return result

# Lowest Common Ancestor (BST)
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root

# Lowest Common Ancestor (Binary Tree)
def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root
    return left or right`
        }
    },
    {
        id: "heaps",
        title: "Heaps / Priority Queues",
        icon: "⛰️",
        description: "Complete binary tree where parent ≤ children (min-heap) or parent ≥ children (max-heap). O(log n) insert/extract, O(1) peek.",
        keyPoints: [
            "Min-Heap: smallest element at root",
            "Max-Heap: largest element at root",
            "Implemented as array: parent at i, children at 2i+1, 2i+2",
            "heapify: O(n) — build heap from array",
            "Python heapq is min-heap; negate values for max-heap"
        ],
        operations: {
            "Insert": "O(log n)",
            "Extract min/max": "O(log n)",
            "Peek min/max": "O(1)",
            "Heapify (build)": "O(n)",
            "Space": "O(n)"
        },
        code: {
            lang: "python",
            title: "Heap Patterns",
            code: `import heapq

# Merge K Sorted Lists
def merge_k_lists(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))

    dummy = current = ListNode(0)
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next

# Running Median (Two Heaps)
class MedianFinder:
    def __init__(self):
        self.small = []  # Max-heap (negated)
        self.large = []  # Min-heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)
        # Ensure max of small <= min of large
        heapq.heappush(self.large, -heapq.heappop(self.small))
        # Balance sizes
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`
        }
    },
    {
        id: "graphs",
        title: "Graphs",
        icon: "🕸️",
        description: "Nodes (vertices) connected by edges. Can be directed/undirected, weighted/unweighted. Many real-world problems map to graphs.",
        keyPoints: [
            "Representations: Adjacency List (space-efficient), Adjacency Matrix (O(1) edge lookup)",
            "BFS: shortest path (unweighted), level-order",
            "DFS: path finding, cycle detection, connected components",
            "Dijkstra: shortest path (weighted, non-negative edges)",
            "Union-Find: connected components, cycle detection in undirected graphs"
        ],
        operations: {
            "Add edge (adj list)": "O(1)",
            "Check edge (adj list)": "O(degree)",
            "Check edge (adj matrix)": "O(1)",
            "BFS/DFS": "O(V + E)",
            "Dijkstra": "O((V + E) log V)"
        },
        code: {
            lang: "python",
            title: "Graph Algorithms",
            code: `import heapq
from collections import defaultdict, deque

# Build adjacency list
def build_graph(edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)  # Remove for directed
    return graph

# Dijkstra's Shortest Path
def dijkstra(graph, start):
    dist = {start: 0}
    heap = [(0, start)]

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist.get(node, float('inf')):
            continue
        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist.get(neighbor, float('inf')):
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))

    return dist

# Union-Find (Disjoint Set)
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True`
        }
    },
    {
        id: "tries",
        title: "Tries (Prefix Trees)",
        icon: "🔤",
        description: "Tree-like structure for storing strings where common prefixes share nodes. Enables O(m) lookup (m = word length) and powerful prefix operations.",
        keyPoints: [
            "Each node represents a character",
            "Path from root to any node = a prefix",
            "Nodes may be marked as 'end of word'",
            "Used in autocomplete, spell checking, IP routing",
            "Space: O(alphabet_size × total_characters)"
        ],
        operations: {
            "Insert word": "O(m)",
            "Search word": "O(m)",
            "Search prefix": "O(m)",
            "Delete word": "O(m)",
            "Space": "O(N × m × alphabet)"
        },
        code: {
            lang: "python",
            title: "Trie Implementation",
            code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node`
        }
    }
],

// ─────────────────────────────────────────────
// ALGORITHMS
// ─────────────────────────────────────────────
algorithms: [
    {
        id: "sorting",
        title: "Sorting Algorithms",
        icon: "🔀",
        description: "Arranging elements in order. Understanding sorting is critical — it's the basis for binary search, merge operations, and many optimization techniques.",
        keyPoints: [
            "Comparison sorts cannot beat O(n log n) on average",
            "Stable sort: equal elements maintain relative order",
            "In-place: uses O(1) extra space",
            "Quick Sort: fastest in practice (O(n log n) avg), but O(n²) worst",
            "Merge Sort: always O(n log n), stable, but needs O(n) space"
        ],
        algoTable: [
            { name: "Bubble Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes" },
            { name: "Selection Sort", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "No" },
            { name: "Insertion Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes" },
            { name: "Merge Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes" },
            { name: "Quick Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "No" },
            { name: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No" }
        ],
        code: {
            lang: "python",
            title: "Merge Sort & Quick Sort",
            code: `# Merge Sort
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Quick Sort
def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        pivot_idx = partition(arr, lo, hi)
        quick_sort(arr, lo, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1`
        }
    },
    {
        id: "binary-search-algo",
        title: "Binary Search",
        icon: "🔍",
        description: "Halve the search space each step. Works on sorted data or any scenario where you can eliminate half the candidates. O(log n).",
        keyPoints: [
            "Requires a sorted or monotonic search space",
            "Each step eliminates half the options",
            "Binary Search on Answer: apply to optimization problems",
            "Watch for off-by-one errors: left <= right vs left < right",
            "Use left + (right - left) // 2 to avoid overflow"
        ],
        code: {
            lang: "python",
            title: "Binary Search on Answer Pattern",
            code: `# Koko Eating Bananas
# Find minimum eating speed to finish in h hours
def min_eating_speed(piles, h):
    import math

    def can_finish(speed):
        hours = sum(math.ceil(p / speed) for p in piles)
        return hours <= h

    left, right = 1, max(piles)
    while left < right:
        mid = left + (right - left) // 2
        if can_finish(mid):
            right = mid      # Try slower
        else:
            left = mid + 1   # Need faster

    return left

# Find Peak Element
def find_peak(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1   # Peak is to the right
        else:
            right = mid       # Peak is at mid or left
    return left`
        }
    },
    {
        id: "recursion-backtrack",
        title: "Recursion & Backtracking",
        icon: "🔁",
        description: "Recursion: solve a problem by solving smaller instances of itself. Backtracking: try all options, undo bad choices. The basis of DFS, tree traversal, and combinatorial problems.",
        keyPoints: [
            "Every recursion needs a base case (stopping condition)",
            "Think about: What's smaller? What's the simplest input?",
            "Backtracking = recursion + undo (explore → choose → explore → unchoose)",
            "Common pitfall: forgetting to backtrack (undo state changes)",
            "Memoization turns recursion into DP"
        ],
        code: {
            lang: "python",
            title: "Recursion & Backtracking Patterns",
            code: `# N-Queens (classic backtracking)
def solve_n_queens(n):
    result = []
    board = [['.' ] * n for _ in range(n)]

    def is_safe(row, col):
        for i in range(row):
            if board[i][col] == 'Q':
                return False
            # Check diagonals
            if col-(row-i) >= 0 and board[i][col-(row-i)] == 'Q':
                return False
            if col+(row-i) < n and board[i][col+(row-i)] == 'Q':
                return False
        return True

    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if is_safe(row, col):
                board[row][col] = 'Q'      # Choose
                backtrack(row + 1)          # Explore
                board[row][col] = '.'       # Un-choose

    backtrack(0)
    return result

# Word Search in Grid
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if (r < 0 or r >= rows or c < 0 or c >= cols
            or board[r][c] != word[idx]):
            return False

        temp = board[r][c]
        board[r][c] = '#'  # Mark visited

        found = (dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1) or
                 dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1))

        board[r][c] = temp  # Backtrack
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False`
        }
    },
    {
        id: "bit-manipulation",
        title: "Bit Manipulation",
        icon: "🔧",
        description: "Operate directly on binary representations. Extremely fast and space-efficient for certain problems.",
        keyPoints: [
            "AND (&): both bits 1 → 1",
            "OR (|): either bit 1 → 1",
            "XOR (^): different bits → 1; same → 0",
            "XOR properties: a^a=0, a^0=a (find single number!)",
            "Shift left (<<) = multiply by 2; shift right (>>) = divide by 2",
            "n & (n-1): removes lowest set bit (count bits, power of 2 check)"
        ],
        code: {
            lang: "python",
            title: "Bit Manipulation Tricks",
            code: `# Single Number (XOR all elements)
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num  # pairs cancel out
    return result

# Count Set Bits (Brian Kernighan)
def count_bits(n):
    count = 0
    while n:
        n &= (n - 1)  # Remove lowest set bit
        count += 1
    return count

# Power of 2 Check
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

# Get/Set/Clear bit at position i
def get_bit(n, i):   return (n >> i) & 1
def set_bit(n, i):   return n | (1 << i)
def clear_bit(n, i): return n & ~(1 << i)

# Reverse Bits
def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`
        }
    }
],

// ─────────────────────────────────────────────
// SYSTEM DESIGN
// ─────────────────────────────────────────────
systemDesign: [
    {
        id: "sd-fundamentals",
        title: "System Design Fundamentals",
        icon: "📐",
        description: "Core concepts you need before diving into any system design interview.",
        sections: [
            {
                title: "Scalability",
                content: `<p><strong>Vertical Scaling (Scale Up):</strong> Add more CPU, RAM, disk to a single machine. Limited by hardware ceiling.</p>
<p><strong>Horizontal Scaling (Scale Out):</strong> Add more machines. Used by most large systems. Requires load balancing and distributed data management.</p>
<div class="info-grid">
    <div class="info-item"><div class="label">Vertical</div><div class="value">Simpler but Limited</div></div>
    <div class="info-item"><div class="label">Horizontal</div><div class="value">Complex but Unlimited</div></div>
</div>`
            },
            {
                title: "Latency vs Throughput",
                content: `<p><strong>Latency:</strong> Time to complete one request (measured in ms). Users care about this.</p>
<p><strong>Throughput:</strong> Number of requests handled per second (RPS/QPS). System capacity.</p>
<div class="tip-box"><strong>💡 Pro Tip</strong><p>Always estimate numbers in interviews: 1 million users, 10% daily active, 5 requests/user = 500K requests/day ≈ 6 RPS. For peak, multiply by 5-10x.</p></div>`
            },
            {
                title: "CAP Theorem",
                content: `<p>In a distributed system, you can only guarantee <strong>2 out of 3</strong>:</p>
<ul>
    <li><strong>C</strong>onsistency: Every read gets the most recent write</li>
    <li><strong>A</strong>vailability: Every request gets a response (even if stale)</li>
    <li><strong>P</strong>artition Tolerance: System works despite network failures</li>
</ul>
<p>Since network partitions are inevitable, the real choice is <strong>CP vs AP</strong>:</p>
<div class="info-grid">
    <div class="info-item"><div class="label">CP Systems</div><div class="value">Banks, Inventory (data accuracy critical)</div></div>
    <div class="info-item"><div class="label">AP Systems</div><div class="value">Social media, DNS (availability critical)</div></div>
</div>`
            },
            {
                title: "Back-of-the-Envelope Estimation",
                content: `<p>Key numbers every engineer should know:</p>
<ul>
    <li>L1 cache: <strong>0.5 ns</strong> | L2 cache: <strong>7 ns</strong> | RAM: <strong>100 ns</strong></li>
    <li>SSD random read: <strong>150 μs</strong> | HDD seek: <strong>10 ms</strong></li>
    <li>Network round trip (same datacenter): <strong>0.5 ms</strong></li>
    <li>Network round trip (cross-continent): <strong>150 ms</strong></li>
    <li>1 day = <strong>86,400 seconds</strong> ≈ <strong>100K seconds</strong></li>
    <li>1 million requests/day ≈ <strong>12 RPS</strong></li>
    <li>1 char = 1 byte | 1 image ≈ 300 KB | 1 video minute ≈ 50 MB</li>
</ul>`
            }
        ]
    },
    {
        id: "sd-components",
        title: "Key Components",
        icon: "🧱",
        description: "Building blocks used in almost every system design.",
        sections: [
            {
                title: "Load Balancer",
                content: `<p>Distributes incoming traffic across multiple servers.</p>
<div class="diagram-box">Client → [Load Balancer] → Server 1
                         → Server 2
                         → Server 3</div>
<p><strong>Algorithms:</strong></p>
<ul>
    <li>Round Robin: Rotate through servers in order</li>
    <li>Weighted Round Robin: More traffic to stronger servers</li>
    <li>Least Connections: Route to server with fewest active connections</li>
    <li>IP Hash: Same client always goes to same server (sticky sessions)</li>
</ul>
<p><strong>Layers:</strong> L4 (transport — TCP/UDP) vs L7 (application — HTTP headers, cookies)</p>`
            },
            {
                title: "Caching",
                content: `<p>Store frequently accessed data in fast storage (RAM) to reduce latency and database load.</p>
<div class="diagram-box">Client → App Server → [Cache] → Database
                    (check cache first, fallback to DB)</div>
<p><strong>Strategies:</strong></p>
<ul>
    <li><strong>Cache-Aside:</strong> App checks cache, if miss → read DB → update cache</li>
    <li><strong>Write-Through:</strong> Write to cache AND DB simultaneously</li>
    <li><strong>Write-Behind:</strong> Write to cache, async write to DB later</li>
    <li><strong>Read-Through:</strong> Cache itself loads from DB on miss</li>
</ul>
<p><strong>Eviction Policies:</strong> LRU (Least Recently Used), LFU (Least Frequently Used), TTL (Time to Live)</p>
<div class="warn-box"><strong>⚠️ Cache Invalidation</strong><p>\"There are only two hard things in CS: cache invalidation and naming things.\" Always plan how stale data will be refreshed.</p></div>`
            },
            {
                title: "CDN (Content Delivery Network)",
                content: `<p>Geographically distributed servers that cache static content (images, CSS, JS, videos) close to users.</p>
<div class="diagram-box">User (London) → CDN Edge (London) → [Cache Hit] → Return

User (London) → CDN Edge (London) → [Cache Miss] → Origin Server (US) → Return + Cache</div>
<p><strong>Types:</strong> Push CDN (you push content) vs Pull CDN (CDN fetches on first request)</p>
<p><strong>Examples:</strong> CloudFlare, AWS CloudFront, Akamai</p>`
            },
            {
                title: "Database Choices",
                content: `<div class="info-grid">
    <div class="info-item"><div class="label">SQL (Relational)</div><div class="value">ACID, structured data, joins. PostgreSQL, MySQL</div></div>
    <div class="info-item"><div class="label">NoSQL Document</div><div class="value">Flexible schema, JSON docs. MongoDB, CouchDB</div></div>
    <div class="info-item"><div class="label">NoSQL Key-Value</div><div class="value">Simple, fast, cache. Redis, DynamoDB</div></div>
    <div class="info-item"><div class="label">NoSQL Column</div><div class="value">Analytics, time-series. Cassandra, HBase</div></div>
    <div class="info-item"><div class="label">NoSQL Graph</div><div class="value">Relationships. Neo4j, Amazon Neptune</div></div>
    <div class="info-item"><div class="label">Search Engine</div><div class="value">Full-text search. Elasticsearch, Solr</div></div>
</div>
<div class="tip-box"><strong>💡 Decision Guide</strong><p>Need joins + transactions? → SQL. Need flexibility + scale? → NoSQL. Need search? → Elasticsearch. Most systems use multiple databases for different needs.</p></div>`
            },
            {
                title: "Message Queues",
                content: `<p>Asynchronous communication between services. Producer sends messages, consumer processes them later.</p>
<div class="diagram-box">Producer → [Message Queue] → Consumer
  (web server)   (Kafka/RabbitMQ)   (worker)</div>
<p><strong>Benefits:</strong></p>
<ul>
    <li>Decoupling: producer and consumer don't need to be online simultaneously</li>
    <li>Buffering: handle traffic spikes by queuing requests</li>
    <li>Reliability: messages persist even if consumer crashes</li>
    <li>Scalability: add more consumers to process faster</li>
</ul>
<p><strong>Examples:</strong> Kafka (high throughput, log-based), RabbitMQ (traditional), SQS (AWS managed)</p>`
            }
        ]
    },
    {
        id: "sd-scaling",
        title: "Database Scaling",
        icon: "📈",
        description: "Techniques to scale databases from thousands to billions of records.",
        sections: [
            {
                title: "Indexing",
                content: `<p>Create ordered references to speed up lookups. Like a book's index vs reading every page.</p>
<ul>
    <li><strong>B-Tree Index:</strong> General purpose, good for range queries. O(log n) lookup.</li>
    <li><strong>Hash Index:</strong> O(1) exact match. Not useful for ranges.</li>
    <li><strong>Composite Index:</strong> Index on multiple columns (order matters!).</li>
</ul>
<div class="warn-box"><strong>⚠️ Over-indexing</strong><p>Every index slows down writes (index must be updated). Only index columns used in WHERE, JOIN, and ORDER BY clauses.</p></div>`
            },
            {
                title: "Replication",
                content: `<p>Copy data across multiple servers for availability and read performance.</p>
<div class="diagram-box">Writes →  [Primary DB]  → Replication → [Replica 1]
                                            → [Replica 2]
Reads  ←  [Replica 1 or 2]  (distribute read traffic)</div>
<p><strong>Types:</strong></p>
<ul>
    <li><strong>Leader-Follower:</strong> One primary handles writes, replicas handle reads</li>
    <li><strong>Leader-Leader:</strong> Multiple primaries accept writes (conflict resolution needed)</li>
    <li><strong>Synchronous:</strong> Write confirmed after all replicas updated (consistent, slower)</li>
    <li><strong>Asynchronous:</strong> Write confirmed immediately, replicas update later (faster, eventual consistency)</li>
</ul>`
            },
            {
                title: "Sharding (Partitioning)",
                content: `<p>Split data across multiple databases. Each shard holds a subset of the total data.</p>
<div class="diagram-box">User data split by User ID:
Shard 1: Users 1-1M
Shard 2: Users 1M-2M
Shard 3: Users 2M-3M</div>
<p><strong>Strategies:</strong></p>
<ul>
    <li><strong>Range-based:</strong> Split by ranges (IDs 1-1M, 1M-2M). Simple, but may cause hotspots.</li>
    <li><strong>Hash-based:</strong> hash(key) % num_shards. Better distribution.</li>
    <li><strong>Consistent Hashing:</strong> Minimizes data movement when adding/removing shards.</li>
</ul>
<div class="warn-box"><strong>⚠️ Challenges</strong><p>Cross-shard queries are expensive. Joins across shards are complex. Rebalancing when adding shards requires data migration. Avoid sharding until you truly need it.</p></div>`
            },
            {
                title: "Consistent Hashing",
                content: `<p>Special hashing that minimizes remapping when nodes are added/removed. Used by DynamoDB, Cassandra, and most distributed caches.</p>
<div class="diagram-box">Hash Ring (0 to 2^32):

        Server A
       /         \\
  Key1             Server B
      |           /
  Key2       Key3
       \\    /
        Server C

Each key maps to the next server clockwise.</div>
<p><strong>Virtual Nodes:</strong> Each physical server gets multiple positions on the ring for better balance.</p>
<p><strong>When adding a server:</strong> Only keys between the new server and its predecessor need to move — instead of redistributing everything.</p>`
            }
        ]
    },
    {
        id: "sd-case-studies",
        title: "Case Studies",
        icon: "📝",
        description: "Walk through common system design interview questions step by step.",
        sections: [
            {
                title: "Design a URL Shortener (TinyURL)",
                content: `<h4>Requirements</h4>
<ul>
    <li>Given a long URL, generate a short URL</li>
    <li>Redirect short URL to original</li>
    <li>100M URLs/day, 10:1 read:write ratio</li>
</ul>
<h4>High-Level Design</h4>
<div class="diagram-box">Write:  Client → API → Generate Short Code → Store (DB) → Return Short URL
Read:   Client → API → Lookup Short Code (DB/Cache) → 301 Redirect</div>
<h4>Key Decisions</h4>
<ul>
    <li><strong>Short code:</strong> Base62 encoding (a-z, A-Z, 0-9). 7 chars = 62^7 ≈ 3.5 trillion options</li>
    <li><strong>ID generation:</strong> Auto-increment ID → Base62, or random + check uniqueness</li>
    <li><strong>Storage:</strong> NoSQL (simple key-value: short_code → long_url)</li>
    <li><strong>Caching:</strong> Redis cache for hot URLs (80/20 rule)</li>
    <li><strong>Scale:</strong> 100M writes/day = ~1.2K writes/sec. Cache handles read load.</li>
</ul>`
            },
            {
                title: "Design a Chat System (WhatsApp)",
                content: `<h4>Requirements</h4>
<ul>
    <li>1-on-1 and group messaging</li>
    <li>Online/offline status</li>
    <li>Message delivery + read receipts</li>
    <li>50M daily active users</li>
</ul>
<h4>High-Level Design</h4>
<div class="diagram-box">User A → WebSocket → Chat Server → Message Queue → Chat Server → WebSocket → User B
                                         ↓
                                   Message Store (DB)
                                         ↓
                              If User B offline → Push Notification</div>
<h4>Key Decisions</h4>
<ul>
    <li><strong>Protocol:</strong> WebSocket for real-time bidirectional communication</li>
    <li><strong>Message Storage:</strong> Per-user message table, partitioned by user_id + timestamp</li>
    <li><strong>Presence:</strong> Heartbeat every 30s via WebSocket. If missed → offline</li>
    <li><strong>Group Chat:</strong> Fan-out on write (for small groups) or fan-out on read (for large channels)</li>
    <li><strong>Message Queue:</strong> Kafka for reliable message delivery between servers</li>
</ul>`
            },
            {
                title: "Design a News Feed (Twitter/Instagram)",
                content: `<h4>Requirements</h4>
<ul>
    <li>Users can post content (text, images)</li>
    <li>Users see a feed from people they follow</li>
    <li>Feed should be near real-time</li>
    <li>300M monthly active users</li>
</ul>
<h4>Two Approaches</h4>
<div class="diagram-box">Fan-out on Write (Push Model):
User posts → Push to all followers' feed caches (pre-computed)
✅ Fast reads  ❌ Slow writes for users with many followers

Fan-out on Read (Pull Model):
User opens app → Query all followed users' posts → Merge & rank
✅ Fast writes  ❌ Slow reads</div>
<h4>Hybrid Approach (What Twitter Uses)</h4>
<ul>
    <li>Regular users: Fan-out on write (push to followers' caches)</li>
    <li>Celebrity users (1M+ followers): Fan-out on read (pull when followers open app)</li>
    <li>Feed ranking: ML model based on recency, engagement, relevance</li>
    <li>Storage: Redis for feed cache, Blob store for media, SQL for user data</li>
</ul>`
            },
            {
                title: "Design a Rate Limiter",
                content: `<h4>Requirements</h4>
<ul>
    <li>Limit API requests (e.g., 100 requests per minute per user)</li>
    <li>Return 429 Too Many Requests when exceeded</li>
    <li>Low latency, distributed</li>
</ul>
<h4>Algorithms</h4>
<ul>
    <li><strong>Token Bucket:</strong> Tokens added at fixed rate. Each request costs 1 token. Allows bursts.</li>
    <li><strong>Sliding Window:</strong> Count requests in the last N seconds. Most accurate.</li>
    <li><strong>Fixed Window Counter:</strong> Count per time window. Simple but allows bursts at boundaries.</li>
    <li><strong>Leaky Bucket:</strong> Process requests at fixed rate. Excess queued or dropped.</li>
</ul>
<div class="diagram-box">Request → [Rate Limiter Middleware]
                    ↓
            Check Redis Counter
                /        \\
           Under Limit    Over Limit
              ↓              ↓
         Forward to API   429 Response</div>
<p><strong>Storage:</strong> Redis (fast, supports atomic increment + TTL). Key: user_id:minute_timestamp, Value: count</p>`
            }
        ]
    },
    {
        id: "sd-approach",
        title: "SD Interview Framework",
        icon: "🎯",
        description: "The systematic approach to ace any system design interview.",
        sections: [
            {
                title: "Step 1: Requirements Clarification (3-5 min)",
                content: `<p>Ask questions to narrow scope. Interviewers WANT you to ask these:</p>
<ul>
    <li>Who are the users? How many? (scale)</li>
    <li>What are the core features? (scope — you can't design everything)</li>
    <li>What are the non-functional requirements? (latency, consistency, availability)</li>
    <li>Is it read-heavy or write-heavy?</li>
    <li>Do we need real-time updates?</li>
    <li>What's the expected data size?</li>
</ul>`
            },
            {
                title: "Step 2: Back-of-Envelope Estimation (2-3 min)",
                content: `<p>Quick math to size the system:</p>
<ul>
    <li>Daily Active Users (DAU)</li>
    <li>Requests per second (peak vs average)</li>
    <li>Storage needs (per record × total records × retention)</li>
    <li>Bandwidth (request size × RPS)</li>
    <li>Cache size (follow the 80/20 rule: cache 20% of hot data)</li>
</ul>`
            },
            {
                title: "Step 3: High-Level Design (10-15 min)",
                content: `<p>Draw the big picture with core components:</p>
<ul>
    <li>Client / Mobile / Web → API Gateway / Load Balancer</li>
    <li>Application Servers (stateless, horizontally scaled)</li>
    <li>Database (what type? how partitioned?)</li>
    <li>Cache layer (Redis/Memcached)</li>
    <li>Message Queue (for async processing)</li>
    <li>CDN (for static content)</li>
</ul>
<p>Define APIs for core operations (e.g., POST /shorten, GET /:code)</p>`
            },
            {
                title: "Step 4: Deep Dive (10-15 min)",
                content: `<p>The interviewer picks areas to explore. Be ready to go deep on:</p>
<ul>
    <li>Database schema design</li>
    <li>Scaling bottlenecks and how to address them</li>
    <li>Data partitioning / sharding strategy</li>
    <li>Consistency vs availability trade-offs</li>
    <li>Error handling and failure scenarios</li>
    <li>Monitoring and alerting</li>
</ul>`
            },
            {
                title: "Step 5: Wrap Up (3-5 min)",
                content: `<p>Summarize and discuss:</p>
<ul>
    <li>Recap the design and key decisions</li>
    <li>Identify potential bottlenecks</li>
    <li>Discuss future improvements (what would you add with more time?)</li>
    <li>Error handling strategies</li>
    <li>Operational concerns: monitoring, deployment, testing</li>
</ul>`
            }
        ]
    }
],

// ─────────────────────────────────────────────
// COMPLEXITY CHEAT SHEET
// ─────────────────────────────────────────────
cheatsheet: {
    title: "📋 Time & Space Complexity Cheat Sheet",
    desc: "Quick reference for all major data structure and algorithm complexities.",
    tables: [
        {
            title: "Data Structure Operations",
            headers: ["Data Structure", "Access", "Search", "Insert", "Delete", "Space"],
            rows: [
                ["Array", "O(1)", "O(n)", "O(n)", "O(n)", "O(n)"],
                ["Dynamic Array", "O(1)", "O(n)", "O(1)*", "O(n)", "O(n)"],
                ["Linked List", "O(n)", "O(n)", "O(1)", "O(1)", "O(n)"],
                ["Stack", "O(n)", "O(n)", "O(1)", "O(1)", "O(n)"],
                ["Queue", "O(n)", "O(n)", "O(1)", "O(1)", "O(n)"],
                ["Hash Table", "N/A", "O(1)*", "O(1)*", "O(1)*", "O(n)"],
                ["BST (balanced)", "O(log n)", "O(log n)", "O(log n)", "O(log n)", "O(n)"],
                ["BST (worst)", "O(n)", "O(n)", "O(n)", "O(n)", "O(n)"],
                ["Heap", "O(1)†", "O(n)", "O(log n)", "O(log n)", "O(n)"],
                ["Trie", "N/A", "O(m)", "O(m)", "O(m)", "O(N×m)"]
            ],
            notes: "* = amortized average. † = peek only (min or max)."
        },
        {
            title: "Sorting Algorithms",
            headers: ["Algorithm", "Best", "Average", "Worst", "Space", "Stable"],
            rows: [
                ["Bubble Sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
                ["Selection Sort", "O(n²)", "O(n²)", "O(n²)", "O(1)", "No"],
                ["Insertion Sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
                ["Merge Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "Yes"],
                ["Quick Sort", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "No"],
                ["Heap Sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)", "No"],
                ["Counting Sort", "O(n+k)", "O(n+k)", "O(n+k)", "O(k)", "Yes"],
                ["Radix Sort", "O(nk)", "O(nk)", "O(nk)", "O(n+k)", "Yes"]
            ]
        },
        {
            title: "Graph Algorithms",
            headers: ["Algorithm", "Time Complexity", "Space", "Use Case"],
            rows: [
                ["BFS", "O(V + E)", "O(V)", "Shortest path (unweighted)"],
                ["DFS", "O(V + E)", "O(V)", "Path finding, cycle detection"],
                ["Dijkstra", "O((V+E) log V)", "O(V)", "Shortest path (weighted)"],
                ["Bellman-Ford", "O(V × E)", "O(V)", "Negative edges allowed"],
                ["Floyd-Warshall", "O(V³)", "O(V²)", "All-pairs shortest path"],
                ["Topological Sort", "O(V + E)", "O(V)", "Dependency ordering"],
                ["Kruskal's MST", "O(E log E)", "O(V)", "Min spanning tree"],
                ["Prim's MST", "O((V+E) log V)", "O(V)", "Min spanning tree (dense)"]
            ]
        }
    ]
}

}; // end CONTENT

// Sort algorithm code for display in visualizer
const SORT_CODES = {
    bubble: {
        lang: "python",
        title: "Bubble Sort",
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # Already sorted
    return arr`
    },
    selection: {
        lang: "python",
        title: "Selection Sort",
        code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
    },
    insertion: {
        lang: "python",
        title: "Insertion Sort",
        code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
    },
    merge: {
        lang: "python",
        title: "Merge Sort",
        code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
    },
    quick: {
        lang: "python",
        title: "Quick Sort",
        code: `def quick_sort(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo < hi:
        pivot_idx = partition(arr, lo, hi)
        quick_sort(arr, lo, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1`
    }
};

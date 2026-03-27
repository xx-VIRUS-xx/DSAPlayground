/* ═══════════════════════════════════════════════════
   THE ALGORITHM CHRONICLES — World & Quest Data
   ═══════════════════════════════════════════════════ */

const WORLD = {

  /* ─── Lore ─────────────────────────────────────── */
  lore: {
    intro: [
      "In the beginning, the Great Architect wrote the First Algorithm — and the Kingdom of Code was born.",
      "For ages, the realm flourished. Data flowed through Structures like rivers. Algorithms guided every decision.",
      "But the Chaos Compiler crept in, corrupting loops, shattering trees, drowning graphs in infinite recursion.",
      "You are the Code Wanderer — summoned from beyond the compile barrier.",
      "Eight realms await your mastery. Restore the algorithms. Save the kingdom."
    ]
  },

  /* ─── Hero Titles by Level ──────────────────────── */
  titles: [
    "Apprentice Coder",    // 1
    "Array Scout",          // 2
    "Hash Ranger",          // 3
    "Binary Seeker",        // 4
    "Tree Climber",         // 5
    "Graph Pathfinder",     // 6
    "DP Architect",         // 7
    "Heap Sovereign",       // 8
    "System Lord",          // 9
    "Algorithm Master"      // 10
  ],

  /* ─── Realms ────────────────────────────────────── */
  realms: [

    /* ══════════════════════════════════════
       REALM 1 — ARRAY PLAINS
    ══════════════════════════════════════ */
    {
      id: "arrays",
      name: "The Array Plains",
      icon: "🏕️",
      color: "#00b894",
      glowColor: "rgba(0,184,148,0.4)",
      x: 42, y: 78,   // % positions on map
      unlockRequires: [],
      xpReward: 50,
      story: {
        arrival: "You arrive at the vast Array Plains — flat, ordered, and stretching to the horizon. Index stones mark every footstep. The villagers speak of a time when you could reach any stone in a single leap.",
        conflict: "But the Chaos Compiler has shuffled the stones. Duplicates have appeared. Subarrays are missing. The Two-Pointer Twins are arguing at opposite ends of the field.",
        resolution: "Master the Array arts — traversal, sliding windows, two pointers — and the Plains will be restored."
      },
      concepts: [
        {
          title: "Arrays & The Index Stones",
          icon: "📊",
          xp: 15,
          theory: `<p>An array is an ordered collection of elements stored in contiguous memory. Each element sits on an <strong>Index Stone</strong> — reachable in <strong>O(1)</strong> time.</p>
<ul>
  <li><strong>Access:</strong> O(1) — jump directly to any index</li>
  <li><strong>Search:</strong> O(n) — walk the plains (O(log n) if sorted)</li>
  <li><strong>Insert/Delete:</strong> O(n) — stones must shift</li>
  <li><strong>Space:</strong> O(n)</li>
</ul>
<p>The <em>Index Stone</em> metaphor: think of the array as a row of numbered pedestals. The number is the index; the object on it is the value.</p>`,
          code: `# Traverse — O(n)
for i, val in enumerate(arr):
    print(f"Index {i}: {val}")

# Two Pointer — O(n)
left, right = 0, len(arr) - 1
while left < right:
    if arr[left] + arr[right] == target:
        return [left, right]
    elif arr[left] + arr[right] < target:
        left += 1
    else:
        right -= 1

# Sliding Window (fixed size k) — O(n)
window_sum = sum(arr[:k])
max_sum = window_sum
for i in range(k, len(arr)):
    window_sum += arr[i] - arr[i - k]
    max_sum = max(max_sum, window_sum)`
        },
        {
          title: "The Sliding Window Scroll",
          icon: "🪟",
          xp: 20,
          theory: `<p>The <strong>Sliding Window</strong> is a sacred scroll found in the Plains. It lets you examine a contiguous subarray without re-reading elements — reducing O(n²) brute force to <strong>O(n)</strong>.</p>
<p><strong>When to use:</strong> Any problem asking for "max/min/sum of subarray of size k" or "longest substring with condition X".</p>
<ul>
  <li><strong>Fixed Window:</strong> slide a window of size k</li>
  <li><strong>Variable Window:</strong> expand right, shrink left when condition violated</li>
</ul>`,
          code: `# Variable Sliding Window — Longest subarray sum ≤ target
def max_subarray(arr, target):
    left = 0
    curr_sum = 0
    max_len = 0
    for right in range(len(arr)):
        curr_sum += arr[right]
        while curr_sum > target:
            curr_sum -= arr[left]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`
        }
      ],
      quests: [
        { id: "q-two-sum", title: "Two Sum — The Pair of Stones", difficulty: "Easy", xp: 20, url: "https://leetcode.com/problems/two-sum/", hint: "Use a hashmap to store complement distances." },
        { id: "q-max-subarray", title: "Maximum Subarray — Kadane's Spell", difficulty: "Medium", xp: 30, url: "https://leetcode.com/problems/maximum-subarray/", hint: "Kadane: track curr_max and global_max." },
        { id: "q-container-water", title: "Container With Most Water", difficulty: "Medium", xp: 30, url: "https://leetcode.com/problems/container-with-most-water/", hint: "Two pointers. Move the shorter wall inward." },
        { id: "q-longest-sub", title: "Longest Subarray Without Repeat", difficulty: "Medium", xp: 35, url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", hint: "Sliding window with a set." }
      ],
      boss: {
        name: "The Unsorted Leviathan",
        description: "A massive beast formed from shuffled index stones. To defeat it, you must sort the plains and find the median of two sorted arrays.",
        problem: { title: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", xp: 60 }
      }
    },

    /* ══════════════════════════════════════
       REALM 2 — HASH FOREST
    ══════════════════════════════════════ */
    {
      id: "hashing",
      name: "The Hash Forest",
      icon: "🌿",
      color: "#74b9ff",
      glowColor: "rgba(116,185,255,0.4)",
      x: 22, y: 58,
      unlockRequires: ["arrays"],
      xpReward: 60,
      story: {
        arrival: "You enter the Hash Forest, where every tree has a unique name carved into it. Villagers can find any tree in an instant — as if by magic. The magic is hashing.",
        conflict: "The Chaos Compiler scattered the name-plaques. Now lookups take forever. Collision sprites cause duplicate names to appear on different trees.",
        resolution: "Learn hashmaps and sets — achieve O(1) lookups — and drive out the collision sprites."
      },
      concepts: [
        {
          title: "Hashmaps — The Name-Tree Pact",
          icon: "🗝️",
          xp: 15,
          theory: `<p>A <strong>Hashmap</strong> maps keys to values using a hash function — like each tree having a secret rune that tells you exactly which grove it lives in.</p>
<ul>
  <li><strong>Get/Set/Delete:</strong> O(1) average, O(n) worst (collisions)</li>
  <li><strong>Use for:</strong> frequency counts, caching, anagram detection, two-sum</li>
</ul>
<p><strong>Hash Collision:</strong> When two keys hash to the same bucket. Solved via chaining (linked list per bucket) or open addressing.</p>`,
          code: `# Frequency map — O(n)
freq = {}
for ch in s:
    freq[ch] = freq.get(ch, 0) + 1

# Group Anagrams — O(n·k log k)
from collections import defaultdict
groups = defaultdict(list)
for word in words:
    groups[tuple(sorted(word))].append(word)
return list(groups.values())`
        },
        {
          title: "Sets — The Sacred Circle",
          icon: "⭕",
          xp: 10,
          theory: `<p>A <strong>Set</strong> is a hashmap with no values — just keys. It answers "have I seen this before?" in O(1).</p>
<p><strong>Classic use:</strong> cycle detection, duplicate removal, "contains" checks.</p>`,
          code: `# Longest consecutive sequence — O(n)
nums_set = set(nums)
best = 0
for n in nums_set:
    if n - 1 not in nums_set:   # start of a sequence
        length = 1
        while n + length in nums_set:
            length += 1
        best = max(best, length)
return best`
        }
      ],
      quests: [
        { id: "q-valid-anagram", title: "Valid Anagram — Rune Matching", difficulty: "Easy", xp: 15, url: "https://leetcode.com/problems/valid-anagram/", hint: "Count char frequencies with a dict." },
        { id: "q-group-anagrams", title: "Group Anagrams — Grove Sorting", difficulty: "Medium", xp: 25, url: "https://leetcode.com/problems/group-anagrams/", hint: "Sort each word as key in defaultdict." },
        { id: "q-top-k", title: "Top K Frequent Elements", difficulty: "Medium", xp: 30, url: "https://leetcode.com/problems/top-k-frequent-elements/", hint: "Bucket sort by frequency." },
        { id: "q-lcs", title: "Longest Consecutive Sequence", difficulty: "Medium", xp: 35, url: "https://leetcode.com/problems/longest-consecutive-sequence/", hint: "Only start counting from sequence heads." }
      ],
      boss: {
        name: "The Collision Hydra",
        description: "A many-headed beast born from hash collisions. Each head is a duplicate key. You must design a hashmap from scratch to contain it.",
        problem: { title: "Design HashMap", url: "https://leetcode.com/problems/design-hashmap/", xp: 60 }
      }
    },

    /* ══════════════════════════════════════
       REALM 3 — BINARY MOUNTAINS
    ══════════════════════════════════════ */
    {
      id: "binary-search",
      name: "Binary Mountains",
      icon: "⛰️",
      color: "#a29bfe",
      glowColor: "rgba(162,155,254,0.4)",
      x: 62, y: 58,
      unlockRequires: ["arrays"],
      xpReward: 65,
      story: {
        arrival: "The Binary Mountains rise in perfect symmetry — left half always smaller, right half always larger. An ancient oracle lives at the peak. She can answer any 'Is X here?' question in log(n) steps.",
        conflict: "The Chaos Compiler has created false peaks (rotated mountains) and hidden valleys. The oracle is confused. She needs you to teach her the art of the midpoint.",
        resolution: "Master binary search — in sorted arrays, rotated arrays, and on answer spaces — to restore the oracle's sight."
      },
      concepts: [
        {
          title: "Binary Search — The Midpoint Oracle",
          icon: "🔭",
          xp: 20,
          theory: `<p>Binary search eliminates <strong>half</strong> the search space each step. On a sorted array of size n, it finds any element in <strong>O(log n)</strong> instead of O(n).</p>
<p><strong>Template (always works):</strong></p>
<ul>
  <li>lo, hi = 0, len(arr) - 1</li>
  <li>while lo <= hi: mid = (lo + hi) // 2</li>
  <li>Shift lo or hi based on condition</li>
</ul>
<p><strong>Binary Search on Answer Space:</strong> When you can check "is X feasible?" in O(n), search over X instead of the array.</p>`,
          code: `# Classic binary search — O(log n)
def search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1

# Search in rotated sorted array
def search_rotated(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        if arr[lo] <= arr[mid]:      # left half sorted
            if arr[lo] <= target < arr[mid]: hi = mid - 1
            else: lo = mid + 1
        else:                        # right half sorted
            if arr[mid] < target <= arr[hi]: lo = mid + 1
            else: hi = mid - 1
    return -1`
        }
      ],
      quests: [
        { id: "q-bin-search", title: "Binary Search — The Oracle's Test", difficulty: "Easy", xp: 15, url: "https://leetcode.com/problems/binary-search/", hint: "Classic lo/hi/mid template." },
        { id: "q-first-last", title: "Find First & Last Position", difficulty: "Medium", xp: 25, url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", hint: "Two binary searches — one for left boundary, one for right." },
        { id: "q-rotated", title: "Search Rotated Array — The Twisted Peak", difficulty: "Medium", xp: 35, url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", hint: "Determine which half is sorted, then decide where to look." },
        { id: "q-koko", title: "Koko Eating Bananas — Speed Oracle", difficulty: "Medium", xp: 40, url: "https://leetcode.com/problems/koko-eating-bananas/", hint: "Binary search on the answer space (speed)." }
      ],
      boss: {
        name: "The Infinite Mountain",
        description: "A mountain with no visible peak — it stretches beyond time. Find the square root of a number without using sqrt().",
        problem: { title: "Sqrt(x) — Binary Search on Answer", url: "https://leetcode.com/problems/sqrtx/", xp: 55 }
      }
    },

    /* ══════════════════════════════════════
       REALM 4 — TREE OF WISDOM
    ══════════════════════════════════════ */
    {
      id: "trees",
      name: "Tree of Wisdom",
      icon: "🌳",
      color: "#fdcb6e",
      glowColor: "rgba(253,203,110,0.4)",
      x: 42, y: 48,
      unlockRequires: ["hashing", "binary-search"],
      xpReward: 80,
      story: {
        arrival: "At the center of the realm grows the ancient Tree of Wisdom. Its branches hold the knowledge of generations. Each node holds a secret; to find it you must traverse root-to-leaf.",
        conflict: "The Chaos Compiler corrupted the tree — some subtrees were swapped, recursive paths loop endlessly, and the depth cannot be measured.",
        resolution: "Learn DFS and BFS. Understand recursion. Heal the tree and restore the knowledge paths."
      },
      concepts: [
        {
          title: "Tree Traversals — The Three Paths",
          icon: "🔀",
          xp: 20,
          theory: `<p>Three classic DFS traversals — all O(n):</p>
<ul>
  <li><strong>Inorder (L → Root → R):</strong> Gives BST nodes in sorted order</li>
  <li><strong>Preorder (Root → L → R):</strong> Used to serialize/clone trees</li>
  <li><strong>Postorder (L → R → Root):</strong> Delete tree, compute subtree values</li>
</ul>
<p><strong>BFS (Level Order):</strong> Use a queue. Process nodes level by level.</p>`,
          code: `# DFS — Inorder (recursive)
def inorder(node):
    if not node: return []
    return inorder(node.left) + [node.val] + inorder(node.right)

# BFS — Level order
from collections import deque
def level_order(root):
    if not root: return []
    q, result = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result`
        },
        {
          title: "Binary Search Trees — The Sorted Grove",
          icon: "🔑",
          xp: 15,
          theory: `<p>In a BST: <strong>left child < node < right child</strong>. Search, insert, delete are O(h) — O(log n) balanced, O(n) worst case.</p>
<p><strong>Key insight:</strong> Inorder traversal of a BST always gives sorted output. Use this to validate a BST or find the kth smallest.</p>`,
          code: `# Validate BST — pass bounds down
def is_valid_bst(node, lo=float('-inf'), hi=float('inf')):
    if not node: return True
    if not (lo < node.val < hi): return False
    return (is_valid_bst(node.left, lo, node.val) and
            is_valid_bst(node.right, node.val, hi))

# Lowest Common Ancestor of BST
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root`
        }
      ],
      quests: [
        { id: "q-max-depth", title: "Maximum Depth — Reaching the Crown", difficulty: "Easy", xp: 15, url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", hint: "DFS: 1 + max(depth(left), depth(right))." },
        { id: "q-invert-tree", title: "Invert Binary Tree — Mirror Spell", difficulty: "Easy", xp: 15, url: "https://leetcode.com/problems/invert-binary-tree/", hint: "Swap left and right at every node recursively." },
        { id: "q-level-order", title: "Level Order Traversal — The BFS Ritual", difficulty: "Medium", xp: 30, url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", hint: "BFS with deque; snapshot queue size per level." },
        { id: "q-lca", title: "Lowest Common Ancestor", difficulty: "Medium", xp: 35, url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", hint: "If both p and q exist in subtrees, current node is LCA." },
        { id: "q-diameter", title: "Diameter of Binary Tree", difficulty: "Easy", xp: 25, url: "https://leetcode.com/problems/diameter-of-binary-tree/", hint: "At each node: diameter = left_depth + right_depth." }
      ],
      boss: {
        name: "The Serpent Vine",
        description: "A vine that grew through the tree, connecting every node in a twisted path. Serialize and deserialize the tree to banish it.",
        problem: { title: "Serialize & Deserialize Binary Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", xp: 80 }
      }
    },

    /* ══════════════════════════════════════
       REALM 5 — THE STACK & QUEUE RUINS
    ══════════════════════════════════════ */
    {
      id: "stack-queue",
      name: "Stack & Queue Ruins",
      icon: "🏛️",
      color: "#e17055",
      glowColor: "rgba(225,112,85,0.4)",
      x: 22, y: 35,
      unlockRequires: ["hashing"],
      xpReward: 60,
      story: {
        arrival: "Ancient ruins of a civilization that prized order above all else. The Stack Priests believed in LIFO — last in, first out. The Queue Monks worshipped FIFO. Their temples stand side by side.",
        conflict: "The Chaos Compiler mixed them up. Brackets are unmatched. Monotonic stacks are broken. The monks and priests bicker endlessly.",
        resolution: "Master the Stack and Queue. Solve the bracket matching ritual, decode the monotonic prophecy."
      },
      concepts: [
        {
          title: "Stack — The LIFO Temple",
          icon: "📚",
          xp: 15,
          theory: `<p>A stack follows <strong>Last In, First Out (LIFO)</strong>. Think: a stack of plates — you take from the top.</p>
<ul>
  <li><strong>Push/Pop/Peek:</strong> O(1)</li>
  <li><strong>Use cases:</strong> bracket matching, function call simulation, undo/redo, monotonic stack</li>
</ul>
<p><strong>Monotonic Stack:</strong> Keep the stack in increasing or decreasing order to find next greater/smaller elements in O(n).</p>`,
          code: `# Valid Parentheses — O(n)
def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif not stack or stack[-1] != pairs[ch]:
            return False
        else:
            stack.pop()
    return not stack

# Next Greater Element — Monotonic Stack O(n)
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []  # indices
    for i, n in enumerate(nums):
        while stack and nums[stack[-1]] < n:
            result[stack.pop()] = n
        stack.append(i)
    return result`
        }
      ],
      quests: [
        { id: "q-valid-parens", title: "Valid Parentheses — Bracket Ritual", difficulty: "Easy", xp: 15, url: "https://leetcode.com/problems/valid-parentheses/", hint: "Push open brackets; pop and match on close." },
        { id: "q-min-stack", title: "Min Stack — The Memory Stone", difficulty: "Medium", xp: 25, url: "https://leetcode.com/problems/min-stack/", hint: "Maintain a parallel min-stack." },
        { id: "q-daily-temps", title: "Daily Temperatures — Heat Prophecy", difficulty: "Medium", xp: 30, url: "https://leetcode.com/problems/daily-temperatures/", hint: "Monotonic decreasing stack of indices." },
        { id: "q-lru", title: "LRU Cache — The Relic Keeper", difficulty: "Medium", xp: 45, url: "https://leetcode.com/problems/lru-cache/", hint: "OrderedDict or doubly-linked list + hashmap." }
      ],
      boss: {
        name: "The Asteroid Collision Titan",
        description: "Massive space rocks on a collision course. Simulate their fate using a stack.",
        problem: { title: "Asteroid Collision", url: "https://leetcode.com/problems/asteroid-collision/", xp: 65 }
      }
    },

    /* ══════════════════════════════════════
       REALM 6 — GRAPH LABYRINTH
    ══════════════════════════════════════ */
    {
      id: "graphs",
      name: "The Graph Labyrinth",
      icon: "🕸️",
      color: "#fd79a8",
      glowColor: "rgba(253,121,168,0.4)",
      x: 42, y: 28,
      unlockRequires: ["trees", "stack-queue"],
      xpReward: 100,
      story: {
        arrival: "The Graph Labyrinth — a vast network of nodes and edges stretching to the horizon. Some edges go one way; others, both. Some paths are weighted with gold; others, cursed.",
        conflict: "The Chaos Compiler created cycles where there should be none, broke shortest-path routes, and locked the topological gates.",
        resolution: "Master DFS, BFS, Dijkstra, and Union-Find to navigate the labyrinth and seal the Chaos gates."
      },
      concepts: [
        {
          title: "Graph Traversal — DFS & BFS",
          icon: "🗺️",
          xp: 20,
          theory: `<p>Graphs are nodes + edges. Key traversal strategies:</p>
<ul>
  <li><strong>DFS:</strong> Go deep. Use recursion or explicit stack. Good for: cycle detection, path existence, islands.</li>
  <li><strong>BFS:</strong> Go wide. Use a queue. Good for: shortest path (unweighted), level-by-level.</li>
  <li><strong>Always track visited set</strong> to avoid infinite loops in cyclic graphs.</li>
</ul>`,
          code: `# DFS — Count connected components
def num_components(n, edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    visited = set()
    def dfs(node):
        for nei in adj[node]:
            if nei not in visited:
                visited.add(nei); dfs(nei)
    count = 0
    for i in range(n):
        if i not in visited:
            visited.add(i); dfs(i); count += 1
    return count

# BFS — Shortest path (unweighted)
from collections import deque
def bfs_shortest(graph, start, end):
    q = deque([(start, 0)])
    visited = {start}
    while q:
        node, dist = q.popleft()
        if node == end: return dist
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei); q.append((nei, dist+1))
    return -1`
        },
        {
          title: "Union-Find — The Alliance Runes",
          icon: "🔗",
          xp: 25,
          theory: `<p><strong>Union-Find (Disjoint Set Union)</strong> tracks which nodes are connected. Two operations:</p>
<ul>
  <li><strong>find(x):</strong> which component is x in? — O(α(n)) ≈ O(1)</li>
  <li><strong>union(x, y):</strong> merge x and y's components</li>
</ul>
<p>Use for: cycle detection in undirected graphs, Kruskal's MST, redundant connections.</p>`,
          code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False  # already connected
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        return True`
        }
      ],
      quests: [
        { id: "q-num-islands", title: "Number of Islands — Island Census", difficulty: "Medium", xp: 30, url: "https://leetcode.com/problems/number-of-islands/", hint: "DFS each unvisited land cell, mark visited." },
        { id: "q-clone-graph", title: "Clone Graph — The Mirror Realm", difficulty: "Medium", xp: 35, url: "https://leetcode.com/problems/clone-graph/", hint: "DFS with an old→new node hashmap." },
        { id: "q-course-schedule", title: "Course Schedule — Topological Order", difficulty: "Medium", xp: 40, url: "https://leetcode.com/problems/course-schedule/", hint: "Detect cycle in directed graph — DFS with 3 states." },
        { id: "q-word-ladder", title: "Word Ladder — Lexical BFS", difficulty: "Hard", xp: 55, url: "https://leetcode.com/problems/word-ladder/", hint: "BFS. Replace each char and check if in wordSet." },
        { id: "q-network-delay", title: "Network Delay — Dijkstra's Path", difficulty: "Medium", xp: 50, url: "https://leetcode.com/problems/network-delay-time/", hint: "Dijkstra with min-heap priority queue." }
      ],
      boss: {
        name: "The Chaos Compiler's Fortress",
        description: "The Compiler's home — a massive directed graph with no clear exit. Find the critical connections (bridges) to collapse it.",
        problem: { title: "Critical Connections in a Network", url: "https://leetcode.com/problems/critical-connections-in-a-network/", xp: 100 }
      }
    },

    /* ══════════════════════════════════════
       REALM 7 — THE DP ABYSS
    ══════════════════════════════════════ */
    {
      id: "dp",
      name: "The DP Abyss",
      icon: "🌀",
      color: "#6c5ce7",
      glowColor: "rgba(108,92,231,0.4)",
      x: 18, y: 18,
      unlockRequires: ["graphs"],
      xpReward: 120,
      story: {
        arrival: "You descend into the DP Abyss — a spiral dungeon where every chamber echoes with the whispers of overlapping subproblems. Time bends here. The same problem is solved a thousand times without memoization.",
        conflict: "The Chaos Compiler exploits the exponential recursion. Without DP, the dungeon loops forever.",
        resolution: "Learn to memoize. Build bottom-up tables. Break the exponential curse."
      },
      concepts: [
        {
          title: "Dynamic Programming — The Memoization Runes",
          icon: "📖",
          xp: 30,
          theory: `<p>DP solves problems with <strong>overlapping subproblems</strong> and <strong>optimal substructure</strong>. Two approaches:</p>
<ul>
  <li><strong>Top-Down (Memoization):</strong> Recursion + cache. Natural to write.</li>
  <li><strong>Bottom-Up (Tabulation):</strong> Fill a DP table iteratively. More space-efficient.</li>
</ul>
<p><strong>DP Framework:</strong></p>
<ol>
  <li>Define the state: dp[i] means...</li>
  <li>Write the recurrence relation</li>
  <li>Identify base cases</li>
  <li>Determine traversal order</li>
</ol>`,
          code: `# Fibonacci — from O(2^n) to O(n)
# Memoized
from functools import lru_cache
@lru_cache(None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

# Tabulated
def fib_tab(n):
    if n <= 1: return n
    dp = [0] * (n+1)
    dp[1] = 1
    for i in range(2, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# 0/1 Knapsack — O(n*W)
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(W+1):
            dp[i][w] = dp[i-1][w]  # skip item i
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w-weights[i-1]] + values[i-1])
    return dp[n][W]`
        }
      ],
      quests: [
        { id: "q-climb-stairs", title: "Climbing Stairs — The Infinite Steps", difficulty: "Easy", xp: 15, url: "https://leetcode.com/problems/climbing-stairs/", hint: "It's Fibonacci: dp[i] = dp[i-1] + dp[i-2]." },
        { id: "q-coin-change", title: "Coin Change — The Alchemist's Gold", difficulty: "Medium", xp: 35, url: "https://leetcode.com/problems/coin-change/", hint: "dp[i] = min coins to make amount i." },
        { id: "q-lis", title: "Longest Increasing Subsequence", difficulty: "Medium", xp: 40, url: "https://leetcode.com/problems/longest-increasing-subsequence/", hint: "dp[i] = LIS ending at index i." },
        { id: "q-edit-dist", title: "Edit Distance — The Word Weaver", difficulty: "Hard", xp: 60, url: "https://leetcode.com/problems/edit-distance/", hint: "2D DP. dp[i][j] = min edits to convert word1[:i] → word2[:j]." },
        { id: "q-burst-balloons", title: "Burst Balloons — The Chaos Carnival", difficulty: "Hard", xp: 70, url: "https://leetcode.com/problems/burst-balloons/", hint: "Interval DP. Think about the LAST balloon to burst." }
      ],
      boss: {
        name: "The Infinite Echo",
        description: "A spirit that copies itself endlessly. Count the number of distinct subsequences to exhaust it.",
        problem: { title: "Distinct Subsequences", url: "https://leetcode.com/problems/distinct-subsequences/", xp: 100 }
      }
    },

    /* ══════════════════════════════════════
       REALM 8 — SYSTEM DESIGN CITADEL
    ══════════════════════════════════════ */
    {
      id: "system-design",
      name: "System Design Citadel",
      icon: "🏰",
      color: "#81ecec",
      glowColor: "rgba(129,236,236,0.4)",
      x: 62, y: 18,
      unlockRequires: ["graphs", "binary-search"],
      xpReward: 150,
      story: {
        arrival: "The Citadel of System Design stands at the edge of the world — where algorithms meet infrastructure. Millions of users hammer its gates. Architects debate CAP theorem in every hall.",
        conflict: "The Chaos Compiler has caused cascading failures — single points of failure, no rate limiting, databases with no indexing. The system is down.",
        resolution: "Learn the pillars of system design: scalability, databases, caching, load balancing. Restore the Citadel."
      },
      concepts: [
        {
          title: "Scalability — The Load Balancer Gates",
          icon: "⚖️",
          xp: 30,
          theory: `<p>Key system design concepts:</p>
<ul>
  <li><strong>Horizontal vs Vertical Scaling:</strong> Add more machines (H) vs upgrade one machine (V)</li>
  <li><strong>Load Balancer:</strong> Distributes traffic — Round Robin, Least Connections, IP Hash</li>
  <li><strong>CAP Theorem:</strong> Choose 2 of 3: Consistency, Availability, Partition Tolerance</li>
  <li><strong>SQL vs NoSQL:</strong> ACID vs BASE, structured vs flexible schema</li>
</ul>`,
          code: `# Rate Limiter — Token Bucket
class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.time()
    def allow_request(self):
        now = time.time()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity,
            self.tokens + elapsed * self.refill_rate)
        self.last_refill = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False`
        },
        {
          title: "Caching — The Reliquary",
          icon: "💎",
          xp: 25,
          theory: `<p>Caching stores frequently accessed data in fast memory (Redis, Memcached) to reduce DB load.</p>
<ul>
  <li><strong>Cache-Aside:</strong> App checks cache first; on miss, loads from DB and populates cache</li>
  <li><strong>Write-Through:</strong> Write to cache and DB simultaneously</li>
  <li><strong>Eviction Policies:</strong> LRU (Least Recently Used), LFU, TTL-based</li>
  <li><strong>Cache Stampede:</strong> Many misses hit DB simultaneously — use mutex/locks</li>
</ul>`,
          code: `# Consistent Hashing (simplified)
import hashlib
class ConsistentHash:
    def __init__(self, nodes, replicas=150):
        self.ring = {}
        self.sorted_keys = []
        for node in nodes:
            for i in range(replicas):
                key = self._hash(f"{node}:{i}")
                self.ring[key] = node
                self.sorted_keys.append(key)
        self.sorted_keys.sort()
    def _hash(self, s):
        return int(hashlib.md5(s.encode()).hexdigest(), 16)
    def get_node(self, key):
        h = self._hash(key)
        for k in self.sorted_keys:
            if h <= k: return self.ring[k]
        return self.ring[self.sorted_keys[0]]`
        }
      ],
      quests: [
        { id: "q-design-lru", title: "Design LRU Cache — The Relic Vault", difficulty: "Medium", xp: 45, url: "https://leetcode.com/problems/lru-cache/", hint: "OrderedDict or doubly-linked list + hashmap for O(1) ops." },
        { id: "q-design-twitter", title: "Design Twitter — The Town Crier", difficulty: "Medium", xp: 50, url: "https://leetcode.com/problems/design-twitter/", hint: "Heap merge of each user's tweet feeds." },
        { id: "q-design-search", title: "Design Search Autocomplete — The Oracle's Tongue", difficulty: "Hard", xp: 60, url: "https://leetcode.com/problems/design-search-autocomplete-system/", hint: "Trie + heap for top suggestions." }
      ],
      boss: {
        name: "The Infinite Traffic Storm",
        description: "Billions of requests flood the Citadel gates. Design a URL shortener that can handle 100M daily users.",
        problem: { title: "Design TinyURL — Rate Limiter + Base62", url: "https://leetcode.com/problems/encode-and-decode-tinyurl/", xp: 120 }
      }
    }

  ] // end realms

}; // end WORLD

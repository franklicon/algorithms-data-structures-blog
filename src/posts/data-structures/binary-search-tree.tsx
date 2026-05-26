import CodeFromRepo from '../../components/posts/CodeFromRepo';
import ComplexityTable from '../../components/posts/ComplexityTable';
import Callout from '../../components/posts/Callout';
import BSTVisualizer from '../../components/visualizers/BSTVisualizer';

export default function BinarySearchTreePost() {
  return (
    <article className="prose-editorial">
      <p className="font-display italic text-xl sm:text-2xl leading-snug text-ink/85 dark:text-paper/85 mb-10">
        A binary search tree replaces linear scanning with a recursive
        comparison: at every node, half of the remaining values fall to the
        left, half to the right. When the tree is reasonably balanced, that
        single decision per level collapses an O(n) search down to O(log n) —
        the same trade that powers every sorted index in every database in
        production.
      </p>

      <h2>The idea</h2>
      <p>
        A <strong>binary search tree</strong> (BST) is a binary tree that
        maintains an ordering invariant: for every node, every value in its{' '}
        <em>left</em> subtree is strictly less than the node’s own value, and
        every value in its <em>right</em> subtree is strictly greater. The
        invariant is local — only the immediate parent–child relationship
        matters at each step — but it composes into a global guarantee: an
        in-order traversal of the tree visits every value in sorted order, and
        a lookup compares the target against the node, then descends to exactly
        one of the two subtrees, never both.
      </p>
      <p>
        That single choice per level is the entire performance argument. A
        balanced tree of <code>n</code> nodes has height{' '}
        <code>⌈log₂(n + 1)⌉</code>, so any operation that follows a root-to-leaf
        path runs in O(log n). The catch — and it is a significant one — is
        that the BST has no self-correcting mechanism. Insertions in sorted
        order produce a tree that has degenerated into a linked list, and every
        operation collapses back to O(n). Self-balancing variants (AVL,
        red-black, and friends) exist precisely to enforce the invariant that
        the plain BST cannot.
      </p>

      <BSTVisualizer />

      <Callout variant="insight" title="Try it">
        Start by clicking <code>InOrder</code> on the default tree — the
        sequence chips fill in <code>10, 25, 35, 50, 60, 75, 90</code>, the
        sorted order of every value present. Then{' '}
        <code>Insert(80)</code>, <code>Insert(65)</code>, and{' '}
        <code>Insert(5)</code>; watch each new value descend the comparison
        path and land in the only legal slot. <code>Contains(35)</code> lights
        up the exact path the search visits — root, then left subtree, then
        right subtree of <code>25</code> — three comparisons against a tree of
        seven nodes. Finally, <code>Remove(50)</code> the root and watch the
        successor-swap: <code>60</code> takes the root’s place and disappears
        from its original position, because that is precisely what the C#
        implementation does to maintain the ordering invariant without
        rewiring half the tree.
      </Callout>

      <h2>The Node</h2>
      <p>
        Each node carries a value and two child references. Unlike the singly
        linked list’s single <code>Next</code>, the BST node needs both{' '}
        <code>Left</code> and <code>Right</code> — and unlike the stack’s or
        queue’s value type, the BST’s value must be <em>comparable</em>, since
        every operation reduces to a sequence of three-way comparisons. The
        type constraint <code>where T : IComparable&lt;T&gt;</code> on the
        outer class is what makes <code>root.Value.CompareTo(value)</code> a
        well-defined operation for every <code>T</code> the tree is ever
        instantiated with.
      </p>

      <CodeFromRepo
        path="src/DataStructures/Trees/BinarySearchTree.cs"
        extractClass="Node"
        filename="BinarySearchTree.cs · Node"
        caption="The nested Node class — pulled live from the source repo"
      />

      <h2>The contract</h2>
      <p>
        <code>IBinarySearchTree&lt;T&gt;</code> publishes the operations that
        define the abstraction: <code>Insert</code>, <code>Contains</code>, and{' '}
        <code>Remove</code> for mutation and lookup; three traversal methods
        (<code>InOrder</code>, <code>PreOrder</code>, <code>PostOrder</code>)
        that materialize the tree’s contents in three different orderings; and{' '}
        <code>Count</code>/<code>IsEmpty</code> for size queries. There is no{' '}
        <code>Peek</code> here as there was in the stack or queue — a BST has
        no single privileged element to peek at. The closest analogue is the
        minimum (leftmost leaf) or maximum (rightmost leaf), and those are
        derived from a partial traversal rather than published as first-class
        operations.
      </p>

      <CodeFromRepo
        path="src/DataStructures/Trees/IBinarySearchTree.cs"
        caption="The interface — pulled live from the source repo"
      />

      <h2>The tree, in C#</h2>
      <p>
        Every mutating operation in this implementation is recursive and
        immutable along the touched path: the top-level method assigns{' '}
        <code>_root = Insert(_root, value)</code>, and the recursive helper
        returns either a new node (at the base case) or the original subtree
        with one of its child links reassigned. The pattern{' '}
        <code>root.Right = Insert(root.Right, value)</code> is doing two things
        at once — descending into the correct subtree and reattaching the
        possibly-new subtree on the way back up.
      </p>
      <p>
        <code>Remove</code> is the operation that earns the structure its
        complexity. The leaf and one-child cases are trivial — return the
        surviving child, decrement count, done. The two-child case is the
        interesting one: find the in-order successor (the minimum of the right
        subtree), copy its value into the node being removed, then recursively
        remove the successor from the right subtree. The node object stays
        where it is and adopts a new value; the duplicated leaf gets unlinked
        in the recursive call. This keeps both the BST invariant and the tree’s
        existing shape intact with the minimum possible reshuffling.
      </p>

      <CodeFromRepo
        path="src/DataStructures/Trees/BinarySearchTree.cs"
        caption="Pulled live from the source repo"
      />

      <Callout variant="note">
        If the snippet above shows a “couldn’t load” message, the file simply
        hasn’t been pushed to the repo yet. The post is wired to pull from{' '}
        <code>src/DataStructures/Trees/BinarySearchTree.cs</code> on the{' '}
        <code>main</code> branch.
      </Callout>

      <h2>Walking the cost of each operation</h2>
      <p>
        Every BST operation that touches the tree follows a single root-to-leaf
        path, so the cost of any individual operation is proportional to the
        tree’s height. The asymptotic story therefore splits in two: what the
        height is when the tree is well-shaped, and what it degenerates to when
        the tree is not.
      </p>
      <p>
        <strong>Best and average case.</strong> For a tree built from values
        inserted in a roughly random order, the expected height is{' '}
        <code>O(log n)</code>. <code>Insert</code>, <code>Contains</code>, and{' '}
        <code>Remove</code> all walk one such path and run in O(log n)
        expected time. The traversal methods are linear regardless of shape —
        they must visit every node by definition — but the recursive call stack
        they use is bounded by the tree’s height, not its size.
      </p>
      <p>
        <strong>Worst case.</strong> The worst-case input is a sorted sequence:
        inserting <code>1, 2, 3, …, n</code> produces a tree in which every
        node’s left child is null and every right child is the next value — a
        linked list dressed as a tree. Height is <code>n</code>, every
        operation is O(n), and the implicit O(log n) promise is gone. This is
        the failure mode that motivates self-balancing trees, which we will
        cover in the next post.
      </p>

      <ComplexityTable
        caption="BinarySearchTree<T> — asymptotic costs (h = tree height)"
        rows={[
          { operation: 'Insert(T)', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', note: 'walks one root-to-leaf comparison path; worst case when the tree is a degenerate chain' },
          { operation: 'Contains(T)', best: 'O(1)', average: 'O(log n)', worst: 'O(n)', note: 'best case is a match at the root; otherwise descends one path until finding the value or hitting null' },
          { operation: 'Remove(T)', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', note: 'two-child case adds a successor lookup that walks at most one additional path of the same height' },
          { operation: 'InOrder() / PreOrder() / PostOrder()', best: 'O(n)', average: 'O(n)', worst: 'O(n)', note: 'every traversal visits every node exactly once; recursion uses O(h) auxiliary stack space' },
          { operation: 'Count (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'maintained as an integer field, incremented on Insert and decremented on the leaf/one-child Remove branches' },
          { operation: 'IsEmpty (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'derived from Count' },
          { operation: 'Space', average: 'O(n)', note: 'one node allocation per element; recursion depth is O(h), which is O(log n) when balanced and O(n) when degenerate' },
        ]}
      />

      <Callout variant="warning" title="The plain BST is shape-sensitive — by design, nothing rebalances it">
        Every cost in the table above is conditional on the tree being
        reasonably bushy. The vanilla BST has no enforcement mechanism: it
        accepts whatever shape its insertion sequence dictates. Inserting
        already-sorted data is a worst case the implementation will not warn
        you about, and it produces a structure with the asymptotic behavior of
        a linked list while paying the per-node overhead of a tree. Production
        code that needs ordered set or map semantics with guaranteed O(log n)
        bounds reaches for a self-balancing variant — typically a{' '}
        <strong>red-black tree</strong> or <strong>AVL tree</strong> — which
        does the rebalancing work after each mutation to keep the height
        logarithmic regardless of input order.
      </Callout>

      <Callout variant="note" title="What the .NET Base Class Library actually ships">
        There is no plain BST in <code>System.Collections.Generic</code>. The
        BCL’s ordered containers —{' '}
        <code>SortedSet&lt;T&gt;</code> and{' '}
        <code>SortedDictionary&lt;TKey, TValue&gt;</code> — are red-black trees
        with worst-case O(log n) on every operation. The unordered{' '}
        <code>HashSet&lt;T&gt;</code> and{' '}
        <code>Dictionary&lt;TKey, TValue&gt;</code> are hash tables with O(1)
        average-case access but no ordering guarantee. Reach for a BST-shaped
        structure when you need <em>ordered</em> iteration, range queries, or
        predecessor/successor lookups; reach for a hash table when key order is
        irrelevant and raw throughput matters.
      </Callout>

      <h2>When to actually reach for one</h2>
      <p>
        The BST’s combination of ordered iteration and logarithmic point-access
        is what makes it the substrate underneath an entire family of
        production-grade structures. Its uses cluster around problems where the
        ordering of keys is not incidental but essential.
      </p>
      <h3>Ordered iteration and range queries</h3>
      <p>
        An in-order traversal of a BST yields every key in sorted order in
        linear time — no separate sort step, no auxiliary structure. A bounded
        variant of the same traversal yields every key in a half-open interval{' '}
        <code>[lo, hi)</code> in O(log n + k) time, where k is the number of
        keys in the range. Databases and search indexes rely on exactly this
        property: a B-tree (the BST’s disk-friendly multi-way cousin) is what
        lets a query like{' '}
        <code>WHERE created_at BETWEEN '2025-01-01' AND '2025-02-01'</code>{' '}
        scan only the relevant slice of an index rather than the entire table.
      </p>
      <h3>Predecessor and successor lookups</h3>
      <p>
        Given a key, find the next-largest or next-smallest key present in the
        structure. A hash table cannot answer this question without scanning
        every entry; a BST answers it in O(log n) by following the comparison
        path and tracking the most recent leftward (or rightward) turn. Job
        schedulers, interval managers, and rate limiters that need the next
        deadline after a given timestamp all lean on this operation.
      </p>
      <h3>Ranked and indexed structures</h3>
      <p>
        Augmenting each node with a subtree-size field turns a BST into an
        order-statistic tree: it can answer “what is the k-th smallest key?”
        and “what is the rank of this key?” in O(log n). Game leaderboards,
        percentile queries, and any system that needs to report a key’s
        position within an ordered population uses some variant of this
        augmentation.
      </p>
      <h3>Sorted maps and sets in language standard libraries</h3>
      <p>
        Beyond .NET’s <code>SortedSet</code> and <code>SortedDictionary</code>,
        every major language ships an ordered-key container backed by a
        self-balancing BST: C++’s <code>std::set</code> and{' '}
        <code>std::map</code>, Java’s <code>TreeSet</code> and{' '}
        <code>TreeMap</code>, Rust’s <code>BTreeSet</code> and{' '}
        <code>BTreeMap</code>. The plain BST in this post is the algorithmic
        spine of all of them; the balancing layer is what makes them safe to
        use in production.
      </p>

      <h2>What’s next</h2>
      <p>
        Two natural extensions follow directly. The first is a pair of{' '}
        <strong>self-balancing BSTs</strong> — AVL trees, which maintain a
        strict height invariant via single and double rotations, and red-black
        trees, which use a looser color-balance invariant for less work per
        mutation at the cost of a slightly taller tree. Both restore the
        O(log n) guarantee on every operation, in every input order. The
        second is the <strong>binary heap</strong>, which discards the BST’s
        in-order invariant in favor of a much weaker heap-order invariant — a
        parent is only required to dominate its immediate children — and earns
        an O(1) extract-min as the reward. Heaps are the natural backing
        structure for priority queues, which we will cover next.
      </p>

      <hr className="hairline my-12" />

      <p className="font-mono text-xs text-ink/50 dark:text-paper/50">
        Source code, tests, and benchmarks live in the{' '}
        <a
          href="https://github.com/franklicon/algorithms-data-structures"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember underline"
        >
          companion repository
        </a>
        .
      </p>
    </article>
  );
}

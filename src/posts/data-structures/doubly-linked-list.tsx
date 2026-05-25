import CodeFromRepo from '../../components/posts/CodeFromRepo';
import ComplexityTable from '../../components/posts/ComplexityTable';
import Callout from '../../components/posts/Callout';
import DoublyLinkedListVisualizer from '../../components/visualizers/DoublyLinkedListVisualizer';

export default function DoublyLinkedListPost() {
  return (
    <article className="prose-editorial">
      <p className="font-display italic text-xl sm:text-2xl leading-snug text-ink/85 dark:text-paper/85 mb-10">
        A doubly linked list is the upgrade you reach for when the O(n)
        <code> RemoveLast</code> of a singly linked list becomes the bottleneck —
        paid for with an extra pointer per node and a small amount of additional
        bookkeeping on every mutation.
      </p>

      <h2>The idea</h2>
      <p>
        A <strong>doubly linked list</strong> is structurally identical to a
        singly linked list with one change: every node carries{' '}
        <em>two</em> pointers — one to the next node and one to the previous
        node. That single addition resolves the most painful asymmetry of the
        singly linked variant: removing the last element no longer requires
        walking the list to find its predecessor, because the tail already
        knows it via <code>Previous</code>.
      </p>
      <p>
        The list itself maintains the same external shape as our singly linked
        implementation: a <code>head</code>, a <code>tail</code>, and a{' '}
        <code>Count</code>. Both lists implement the same{' '}
        <code>ILinkedList&lt;T&gt;</code> interface — only their internal
        mechanics and asymptotic costs differ.
      </p>

      <DoublyLinkedListVisualizer />

      <Callout variant="insight" title="Try it">
        Call <code>RemoveLast</code> several times. The visual feedback is the
        same as the singly linked visualizer, but the underlying mechanics are
        entirely different — there is no traversal. The list reaches the new
        tail in a single pointer dereference through <code>_tail.Previous</code>.
      </Callout>

      <h2>The Node</h2>
      <p>
        The node gains a <code>Previous</code> reference alongside its existing{' '}
        <code>Next</code>. Both are nullable: the head’s <code>Previous</code>{' '}
        is <code>null</code>, the tail’s <code>Next</code> is <code>null</code>,
        and an isolated single-node list has both ends as <code>null</code>{' '}
        simultaneously.
      </p>

      <CodeFromRepo
        path="src/DataStructures/LinkedLists/DoublyLinkedList.cs"
        extractClass="Node"
        filename="DoublyLinkedList.cs · Node"
        caption="The Node class — pulled live from the source repo"
      />

      <Callout variant="note" title="The cost of the extra pointer">
        On a 64-bit runtime, each additional reference adds 8 bytes per node.
        For a list of one million small values, that is roughly an extra 8 MB
        of heap pressure compared with a singly linked equivalent — not free,
        but usually negligible against the algorithmic gains the second
        pointer enables.
      </Callout>

      <h2>The list, in C#</h2>
      <p>
        Because <code>DoublyLinkedList&lt;T&gt;</code> satisfies the same{' '}
        <code>ILinkedList&lt;T&gt;</code> contract as its singly linked sibling,
        client code that depends on the interface is fully substitutable. What
        changes is what happens inside each method — every mutation now updates
        two pointers (forward and backward) instead of one, and the boundary
        cases are slightly more involved.
      </p>

      <CodeFromRepo
        path="src/DataStructures/LinkedLists/DoublyLinkedList.cs"
        caption="Pulled live from the source repo"
      />

      <Callout variant="note">
        If the snippet above shows a “couldn’t load” message, the file simply
        hasn’t been pushed to the repo yet. The post is wired to pull from{' '}
        <code>src/DataStructures/LinkedLists/DoublyLinkedList.cs</code> on the{' '}
        <code>main</code> branch.
      </Callout>

      <h2>Walking the cost of each operation</h2>
      <p>
        Every public mutation on <code>DoublyLinkedList&lt;T&gt;</code> now
        completes in constant time. The asymmetry that defined the singly
        linked list — O(1) <code>AddLast</code> against O(n){' '}
        <code>RemoveLast</code> — is gone. The price is paid uniformly on every
        insertion and deletion: each operation must rewire two pointers instead
        of one, which raises the constant factor but leaves the asymptotic
        class unchanged. <code>Contains</code> remains a linear scan; no
        amount of bidirectional traversal can avoid examining each element
        when searching for an unordered value.
      </p>

      <ComplexityTable
        caption="DoublyLinkedList<T> — asymptotic costs"
        rows={[
          { operation: 'AddFirst(T)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'inserts at head; updates the new node’s Next and the old head’s Previous' },
          { operation: 'AddLast(T)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'inserts at tail; updates the new node’s Previous and the old tail’s Next' },
          { operation: 'RemoveFirst()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'advances head; clears the new head’s Previous; throws InvalidOperationException when empty' },
          { operation: 'RemoveLast()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'now O(1) — _tail.Previous gives the new tail directly, no traversal needed' },
          { operation: 'Contains(T)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', note: 'linear scan via EqualityComparer<T>.Default; identical to the singly linked case' },
          { operation: 'Count (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'maintained as an integer field on every mutation' },
          { operation: 'IsEmpty (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'derived from Count' },
          { operation: 'Space', average: 'O(n)', note: 'each node carries two references (Next + Previous); ~2× the per-node pointer overhead of a singly linked list' },
        ]}
      />

      <Callout variant="warning" title="The same cache penalty still applies">
        A doubly linked list inherits the cache-locality problem of any
        pointer-chasing structure. Adding a backward pointer does not improve
        traversal performance — nodes still live at arbitrary heap addresses,
        and each step is still a potential cache miss. The doubly linked list
        wins on algorithmic flexibility, not on iteration speed.
      </Callout>

      <h2>When to actually reach for one</h2>
      <p>
        The doubly linked list earns its place wherever a singly linked list
        is conceptually correct but its tail-side asymmetry becomes a
        performance problem, or wherever the ability to traverse a sequence in
        either direction is itself a requirement.
      </p>
      <h3>LRU caches done properly</h3>
      <p>
        The canonical O(1) least-recently-used cache combines a hash map with
        a doubly linked list. Each cache entry is a node; the map resolves a
        key to its node in O(1); the list orders entries by recency. On a hit,
        the entry is unlinked from its current position and pushed to the
        head — both halves of that operation are O(1) precisely because the
        node carries a <code>Previous</code> pointer. The singly linked
        variant cannot deliver this guarantee: unlinking an interior node
        without a back-pointer requires either O(n) traversal or a separate
        parent map, neither of which is acceptable for a cache.
      </p>
      <h3>Browser history and editor undo/redo</h3>
      <p>
        Back and forward navigation maps directly onto the two pointers of a
        doubly linked node. Each visited page or applied edit becomes a node;
        the back button is a <code>Previous</code> traversal, the forward
        button is a <code>Next</code> traversal, and committing a new state
        from somewhere in the middle of the history truncates the forward
        chain in O(1).
      </p>
      <h3>.NET’s built-in LinkedList&lt;T&gt;</h3>
      <p>
        The Base Class Library’s <code>System.Collections.Generic.LinkedList&lt;T&gt;</code>{' '}
        is itself a doubly linked list, and it exposes a public{' '}
        <code>LinkedListNode&lt;T&gt;</code> type for exactly this reason:
        callers that already hold a reference to a node can remove or splice
        it in O(1) via <code>Remove(LinkedListNode&lt;T&gt;)</code>. That
        contract is only possible because the node carries a backward pointer.
      </p>

      <h2>What’s next</h2>
      <p>
        The doubly linked list is the structural foundation for two further
        variants worth knowing. The <strong>circular doubly linked list</strong>{' '}
        connects tail back to head and head back to tail, eliminating the need
        for null checks at the boundaries and producing a clean implementation
        of round-robin schedulers and ring buffers. The <strong>skip list</strong>{' '}
        layers probabilistic shortcut pointers on top of an ordered linked
        list to achieve expected O(log n) search, insertion, and deletion —
        the linked-list answer to balanced binary search trees, and the
        backbone of several production key-value stores including Redis sorted
        sets.
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

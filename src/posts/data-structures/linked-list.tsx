import CodeFromRepo from '../../components/posts/CodeFromRepo';
import ComplexityTable from '../../components/posts/ComplexityTable';
import Callout from '../../components/posts/Callout';
import LinkedListVisualizer from '../../components/visualizers/LinkedListVisualizer';

export default function LinkedListPost() {
  return (
    <article className="prose-editorial">
      <p className="font-display text-2xl leading-snug text-ink/90 dark:text-paper/90 mb-10 italic">
        A linked list is the data structure to reach for when you need
        constant-time insertion at the boundaries of a sequence and stable
        references that survive structural changes — in exchange for random
        access and a per-node memory overhead.
      </p>

      <h2>The idea</h2>
      <p>
        An array places its elements side-by-side in one contiguous block of
        memory. A <strong>linked list</strong> does the opposite: each element
        lives wherever the allocator decides, and every element carries a small
        breadcrumb — a <em>pointer</em> — that says where the next one is.
      </p>
      <p>
        In a <strong>singly linked list</strong> each node holds two things:
        the value, and a reference to the next node. The list itself maintains
        a <code>head</code> reference to the first node and — in the
        implementation we use here — a <code>tail</code> reference to the last
        one. The terminal node’s <code>Next</code> pointer is{' '}
        <code>null</code>, marking the end of the chain.
      </p>

      <LinkedListVisualizer />

      <Callout variant="insight" title="Try it">
        Call <code>AddFirst</code> and notice how the rest of the list does{' '}
        <em>not</em> move. Now compare that mentally with an array: inserting at
        the front forces every existing element to shift one slot to the right.
        That’s the trade.
      </Callout>

      <h2>The Node</h2>
      <p>
        The smallest possible building block. A class with a value and a pointer
        to the next node. In C# we make it generic so the same structure can
        hold integers, strings, or any other type.
      </p>

      <CodeFromRepo
        path="src/DataStructures/LinkedLists/SinglyLinkedList.cs"
        extractClass="Node"
        filename="SinglyLinkedList.cs · Node"
        caption="The Node class — pulled live from the source repo"
      />

      <Callout variant="note" title="Why nullable Next?">
        The last node in the chain has no successor. Modeling{' '}
        <code>Next</code> as <code>Node?</code> — the nested class with the
        outer <code>T</code> implied — makes that explicit and lets the C#
        nullable-reference analyzer catch dereferences you forgot to guard.
      </Callout>

      <h2>The list, in C#</h2>
      <p>
        With the node type defined, the list itself remains remarkably compact.{' '}
        <code>SinglyLinkedList&lt;T&gt;</code> maintains three pieces of state —
        a private <code>_head</code> reference, a private <code>_tail</code>{' '}
        reference, and a public <code>Count</code> — and exposes four mutating
        operations plus a membership test on top of them. The tail pointer is
        what allows <code>AddLast</code> to run in constant time. The canonical
        implementation lives in the companion repository:
      </p>

      <CodeFromRepo
        path="src/DataStructures/LinkedLists/SinglyLinkedList.cs"
        caption="Pulled live from the source repo"
      />

      <Callout variant="note">
        If the snippet above shows a “couldn’t load” message, the file simply
        hasn’t been pushed to the repo yet. The post is wired to pull from{' '}
        <code>src/DataStructures/LinkedLists/SinglyLinkedList.cs</code> on the{' '}
        <code>main</code> branch.
      </Callout>

      <h2>Walking the cost of each operation</h2>
      <p>
        Three of the four mutating operations on{' '}
        <code>SinglyLinkedList&lt;T&gt;</code> run in constant time:{' '}
        <code>AddFirst</code>, <code>AddLast</code>, and{' '}
        <code>RemoveFirst</code> each touch a fixed number of references. The
        fourth — <code>RemoveLast</code> — is the one to examine carefully.
        Even though the list maintains a <code>_tail</code> pointer for
        constant-time appends, removing the last node still requires a full
        traversal from the head to locate its predecessor, because a singly
        linked node has no back-reference. This asymmetry between O(1){' '}
        <code>AddLast</code> and O(n) <code>RemoveLast</code> is the canonical
        motivation for upgrading to a doubly linked list. The{' '}
        <code>Contains</code> method is a linear scan with an early exit on
        match.
      </p>

      <ComplexityTable
        caption="SinglyLinkedList<T> — asymptotic costs"
        rows={[
          { operation: 'AddFirst(T)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'inserts at head; assigns the tail when the list was empty' },
          { operation: 'AddLast(T)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'constant time because a tail pointer is maintained' },
          { operation: 'RemoveFirst()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'advances head; throws InvalidOperationException when the list is empty' },
          { operation: 'RemoveLast()', best: 'O(n)', average: 'O(n)', worst: 'O(n)', note: 'must walk from head to locate the new tail; no back-pointer exists' },
          { operation: 'Contains(T)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', note: 'linear scan via EqualityComparer<T>.Default; best case is a match at head' },
          { operation: 'Count (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'maintained as an integer field on every mutation' },
          { operation: 'IsEmpty (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'derived from Count' },
          { operation: 'Space', average: 'O(n)', note: 'one node allocation per element, plus two list-level references' },
        ]}
      />

      <Callout variant="warning" title="The hidden cost: cache misses">
        Asymptotic notation hides a real-world penalty. Because nodes sit in
        arbitrary memory locations, every pointer-chase risks a cache miss. An
        array traversal at the same Big-O class is often <em>several times</em>{' '}
        faster on modern hardware. Don’t pick a linked list just because the
        Big-O looks better on paper — measure.
      </Callout>

      <h2>When to actually reach for one</h2>
      <p>
        In production C# code, <code>List&lt;T&gt;</code> — backed by a
        contiguous array — outperforms a linked list for the vast majority of
        workloads, thanks to cache locality and amortized O(1) appends. A
        singly linked list earns its place in a narrower set of scenarios where
        its specific guarantees matter.
      </p>
      <h3>Queues and stacks without fixed-size buffers</h3>
      <p>
        When implementing a FIFO queue or LIFO stack that must grow without
        periodic array resizes, a singly linked list provides O(1) operations
        end-to-end. The companion repository builds exactly this:{' '}
        <code>LinkedListQueue&lt;T&gt;</code> keeps head and tail pointers so{' '}
        <code>Enqueue</code> appends at the tail and <code>Dequeue</code>{' '}
        advances the head — both O(1). <code>LinkedListStack&lt;T&gt;</code>{' '}
        needs only a single <code>_top</code> reference, since{' '}
        <code>Push</code>, <code>Pop</code>, and <code>Peek</code> all act on
        the same end.
      </p>
      <h3>LRU caches</h3>
      <p>
        Pairing a <em>doubly</em> linked list with a hash map yields the
        canonical O(1) LRU cache. The list orders entries by recency; the map
        resolves a key to its node in constant time. Evicting the
        least-recently-used entry then becomes a single list-level pointer
        rewire. A singly linked list cannot fill this role on its own — the
        O(n) cost of locating a predecessor is precisely what the doubly linked
        variant eliminates.
      </p>
      <h3>Undo histories and edit timelines</h3>
      <p>
        When the dominant operations are “append a step” and “occasionally
        rewind,” a linked list maps naturally onto the workload. Branching
        histories — the data shape behind Git’s commit graph — generalize the
        same idea into a directed acyclic graph of nodes.
      </p>

      <h2>Common interview variants</h2>
      <p>
        Four problems account for the majority of linked-list interview
        questions: <strong>reverse a linked list</strong> — the iterative
        three-pointer solution runs in O(n) time and O(1) space;{' '}
        <strong>detect a cycle</strong> — Floyd’s tortoise-and-hare algorithm
        achieves O(n) time and O(1) space; <strong>find the middle node</strong>{' '}
        — a slow/fast pointer pair reaches the midpoint in a single pass; and{' '}
        <strong>merge two sorted lists</strong> — the foundation of merge sort
        on linked lists, one of the few sorting contexts in which lists
        outperform arrays because the merge step requires no auxiliary
        allocation.
      </p>

      <Callout variant="insight" title="The pattern behind the patterns">
        Three of those four problems rely on the <em>two-pointer technique</em>{' '}
        — one pointer advances slowly, the other advances quickly. The pattern
        generalizes well beyond linked lists, appearing throughout array and
        string algorithms.
      </Callout>

      <h2>What’s next</h2>
      <p>
        With the singly linked list understood, the natural progressions are
        the <strong>doubly linked list</strong> — two pointers per node, which
        reduces <code>RemoveLast</code> and arbitrary-node deletion to O(1) —
        and the <strong>circular linked list</strong>, in which the tail’s{' '}
        <code>Next</code> points back to the head, a structure well suited to
        round-robin scheduling and ring buffers. Both extend the same model
        with additional bookkeeping.
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

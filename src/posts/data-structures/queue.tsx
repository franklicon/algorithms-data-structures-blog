import CodeFromRepo from '../../components/posts/CodeFromRepo';
import ComplexityTable from '../../components/posts/ComplexityTable';
import Callout from '../../components/posts/Callout';
import QueueVisualizer from '../../components/visualizers/QueueVisualizer';

export default function QueuePost() {
  return (
    <article className="prose-editorial">
      <p className="font-display italic text-xl sm:text-2xl leading-snug text-ink/85 dark:text-paper/85 mb-10">
        A queue is the data structure of first-in, first-out discipline —
        items enter at one end and leave at the other, in the same order they
        arrived. A singly linked list with both a <code>_head</code> and a{' '}
        <code>_tail</code> pointer is the natural fit, because each end serves
        a different operation.
      </p>

      <h2>The idea</h2>
      <p>
        A <strong>queue</strong> is an abstract data type with two defining
        operations: <code>Enqueue</code> appends a value at the back, and{' '}
        <code>Dequeue</code> removes and returns the value at the front. A
        third operation, <code>Peek</code>, returns the front value without
        removing it. The discipline is <strong>first-in, first-out</strong>:
        the order in which values are removed exactly matches the order in
        which they were inserted.
      </p>
      <p>
        Where a stack accesses a single end, a queue accesses two. That single
        change drives the entire implementation: a linked-list-backed queue
        must maintain both a <code>_head</code> reference (where{' '}
        <code>Dequeue</code> and <code>Peek</code> read) and a{' '}
        <code>_tail</code> reference (where <code>Enqueue</code> writes).
        Without the tail pointer, <code>Enqueue</code> would have to traverse
        the chain from head to back on every insertion — an O(n) operation
        that destroys the entire value proposition.
      </p>

      <QueueVisualizer />

      <Callout variant="insight" title="Try it">
        Enqueue a value, then enqueue another, then call <code>Dequeue</code>{' '}
        twice. The values come out in the same order they went in — that is
        the FIFO guarantee. Notice that <code>Peek</code> returns the same
        value that the next <code>Dequeue</code> will: the front of the queue
        is the head of the underlying chain.
      </Callout>

      <h2>The Node</h2>
      <p>
        Identical to the node of any singly linked structure: a value and a
        forward pointer. The queue uses two list-level references to navigate
        the chain, but each node only needs to know what comes next.
      </p>

      <CodeFromRepo
        path="src/DataStructures/Queues/LinkedListQueue.cs"
        extractClass="Node"
        filename="LinkedListQueue.cs · Node"
        caption="The Node class — pulled live from the source repo"
      />

      <h2>The queue, in C#</h2>
      <p>
        <code>LinkedListQueue&lt;T&gt;</code> implements the{' '}
        <code>IQueue&lt;T&gt;</code> contract — <code>Enqueue</code>,{' '}
        <code>Dequeue</code>, <code>Peek</code>, <code>Contains</code>,{' '}
        <code>Count</code>, and <code>IsEmpty</code>. The boundary case worth
        noticing is the transition between empty and non-empty: an{' '}
        <code>Enqueue</code> into an empty queue must set both{' '}
        <code>_head</code> and <code>_tail</code> to the new node, and a{' '}
        <code>Dequeue</code> that empties the queue must reset{' '}
        <code>_tail</code> to <code>null</code> so the next <code>Enqueue</code>{' '}
        does not dereference a stale reference.
      </p>

      <CodeFromRepo
        path="src/DataStructures/Queues/LinkedListQueue.cs"
        caption="Pulled live from the source repo"
      />

      <Callout variant="note">
        If the snippet above shows a “couldn’t load” message, the file simply
        hasn’t been pushed to the repo yet. The post is wired to pull from{' '}
        <code>src/DataStructures/Queues/LinkedListQueue.cs</code> on the{' '}
        <code>main</code> branch.
      </Callout>

      <h2>Walking the cost of each operation</h2>
      <p>
        All three queue-defining operations run in constant time.{' '}
        <code>Enqueue</code> allocates a node and rewires at most two
        references — the previous tail’s <code>Next</code> and the queue’s{' '}
        <code>_tail</code>. <code>Dequeue</code> reads the head value,
        advances <code>_head</code> to its successor, and handles the
        empty-after-removal case. <code>Peek</code> is a single dereference
        through <code>_head</code>. <code>Contains</code> remains a linear
        scan — and, as with stacks, searching a queue by value is rarely the
        operation the abstraction is designed for.
      </p>

      <ComplexityTable
        caption="LinkedListQueue<T> — asymptotic costs"
        rows={[
          { operation: 'Enqueue(T)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'appends at the tail using the maintained _tail pointer; assigns both head and tail when the queue was empty' },
          { operation: 'Dequeue()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'advances _head; resets _tail to null when the queue becomes empty; throws InvalidOperationException when already empty' },
          { operation: 'Peek()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'reads _head.Value without mutation; throws InvalidOperationException when empty' },
          { operation: 'Contains(T)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', note: 'linear scan from head to tail; best case is a match at the head' },
          { operation: 'Count (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'maintained as an integer field on every Enqueue and Dequeue' },
          { operation: 'IsEmpty (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'derived from Count' },
          { operation: 'Space', average: 'O(n)', note: 'one node allocation per element plus two list-level references (_head and _tail)' },
        ]}
      />

      <Callout variant="warning" title="Array-backed vs linked-list-backed queues">
        The .NET Base Class Library’s{' '}
        <code>System.Collections.Generic.Queue&lt;T&gt;</code> is backed by a
        circular array: <code>Enqueue</code> is <em>amortized</em> O(1),
        because periodic capacity growth triggers an O(n) array copy, and the
        circular indexing scheme avoids shifting elements on every{' '}
        <code>Dequeue</code>. The linked-list-backed variant delivers{' '}
        <em>worst-case</em> O(1) on every operation, with no resize step ever —
        at the cost of per-node heap allocations and the cache penalty of
        pointer-chasing. The same general rule applies as with stacks: prefer
        the array-backed implementation for throughput, prefer the linked-list
        variant when worst-case latency matters or when node references must
        remain stable.
      </Callout>

      <Callout variant="note" title="Thread safety">
        <code>LinkedListQueue&lt;T&gt;</code> is not thread-safe. Producer-
        consumer patterns across multiple threads require either external
        synchronization or a purpose-built concurrent queue — in the .NET
        ecosystem,{' '}
        <code>System.Collections.Concurrent.ConcurrentQueue&lt;T&gt;</code> or{' '}
        <code>BlockingCollection&lt;T&gt;</code> are the canonical choices.
      </Callout>

      <h2>When to actually reach for one</h2>
      <p>
        The queue appears wherever work must be processed in the order it was
        received, or wherever a system must decouple producers of data from
        consumers of data. Its applications span operating systems, algorithm
        design, and distributed systems.
      </p>
      <h3>Breadth-first search</h3>
      <p>
        Breadth-first traversal of a graph or tree is the canonical algorithmic
        use of a queue, mirroring the stack-driven depth-first traversal. The
        queue holds the frontier of unvisited nodes; each iteration dequeues
        the next node to expand and enqueues its unvisited neighbors. The
        FIFO ordering is what guarantees that nodes are visited in
        non-decreasing order of distance from the source — the property that
        makes BFS the standard algorithm for shortest paths on unweighted
        graphs.
      </p>
      <h3>Task and job scheduling</h3>
      <p>
        Operating system schedulers, web server request handlers, and
        background job processors all rely on queues to hold pending units of
        work. The simplest scheduling policy — first-come-first-served — is a
        direct application of a single FIFO queue. More sophisticated policies
        layer multiple queues with priority or fairness rules on top of the
        same underlying primitive.
      </p>
      <h3>Producer–consumer pipelines</h3>
      <p>
        Whenever one component generates work faster or slower than another
        consumes it, an intermediate queue absorbs the rate mismatch. Network
        sockets, audio buffers, log aggregators, and message brokers
        (RabbitMQ, Kafka, Amazon SQS) all expose queue semantics at their
        core, even when the underlying implementation is far more elaborate
        than a linked list — durability, partitioning, and at-least-once
        delivery layer additional guarantees on top of the FIFO primitive.
      </p>
      <h3>Bounded buffers and rate limiting</h3>
      <p>
        A fixed-capacity queue paired with a blocking or drop policy is the
        canonical building block for rate limiters and back-pressure mechanisms.
        Once the queue is full, new arrivals either wait, are rejected, or
        displace older entries — each policy enforces a different contract
        between producers and consumers under load.
      </p>

      <h2>What’s next</h2>
      <p>
        Two extensions generalize the queue in useful directions. A{' '}
        <strong>deque</strong> (double-ended queue) permits insertion and
        removal at both ends in O(1), unifying the stack and queue
        abstractions; a doubly linked list backs it naturally, since efficient
        removal from both ends requires the same back-pointer the deque needs.
        A <strong>priority queue</strong> replaces FIFO ordering with
        priority-driven ordering — the next element to dequeue is the one
        with the highest priority, not the one that arrived earliest. Priority
        queues are typically implemented as binary heaps, which provide O(log
        n) insertion and removal of the highest-priority element, and which
        we will cover when we reach the trees section.
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

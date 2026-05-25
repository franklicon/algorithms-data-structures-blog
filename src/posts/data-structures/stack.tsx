import CodeFromRepo from '../../components/posts/CodeFromRepo';
import ComplexityTable from '../../components/posts/ComplexityTable';
import Callout from '../../components/posts/Callout';
import StackVisualizer from '../../components/visualizers/StackVisualizer';

export default function StackPost() {
  return (
    <article className="prose-editorial">
      <p className="font-display italic text-xl sm:text-2xl leading-snug text-ink/85 dark:text-paper/85 mb-10">
        A stack is the data structure of last-in, first-out discipline — every
        operation touches the same end, every order of access is reversed. A
        linked list with a single <code>_top</code> pointer is the most direct
        way to express that discipline in code.
      </p>

      <h2>The idea</h2>
      <p>
        A <strong>stack</strong> is an abstract data type with two defining
        operations: <code>Push</code> places a value at the top, and{' '}
        <code>Pop</code> removes and returns the value at the top. A third
        operation, <code>Peek</code>, returns the top value without removing
        it. Every access happens at the same end, which is exactly the
        <strong> last-in, first-out</strong> ordering — the last value pushed
        is the first one popped.
      </p>
      <p>
        When the backing store is a singly linked list, the “top” is the
        head of the chain. A push prepends a new node; a pop advances{' '}
        <code>_top</code> to its successor; the bottom of the stack is the
        node whose <code>Next</code> is <code>null</code>. No tail pointer is
        required, because every mutation happens at the head — which is why{' '}
        <code>LinkedListStack&lt;T&gt;</code> tracks a single internal
        reference, <code>_top</code>, alongside <code>Count</code>.
      </p>

      <StackVisualizer />

      <Callout variant="insight" title="Try it">
        Push three values in succession, then call <code>Peek</code> and{' '}
        <code>Pop</code>. <code>Peek</code> reveals the top without disturbing
        the stack; <code>Pop</code> returns the same value and removes it.
        That distinction — observation versus mutation — is the entire reason{' '}
        <code>Peek</code> exists as a separate method.
      </Callout>

      <h2>The Node</h2>
      <p>
        Identical to the node of a singly linked list: a value and a forward
        pointer. The stack uses only one direction of traversal, so no
        backward link is needed.
      </p>

      <CodeFromRepo
        path="src/DataStructures/Stacks/LinkedListStack.cs"
        extractClass="Node"
        filename="LinkedListStack.cs · Node"
        caption="The Node class — pulled live from the source repo"
      />

      <h2>The stack, in C#</h2>
      <p>
        <code>LinkedListStack&lt;T&gt;</code> implements the{' '}
        <code>IStack&lt;T&gt;</code> contract — <code>Push</code>,{' '}
        <code>Pop</code>, <code>Peek</code>, <code>Contains</code>,{' '}
        <code>Count</code>, and <code>IsEmpty</code>. Because every mutation
        touches the top, both <code>Push</code> and <code>Pop</code> reduce to
        a handful of pointer assignments. <code>Pop</code> and{' '}
        <code>Peek</code> guard against the empty-stack case and throw{' '}
        <code>InvalidOperationException</code> rather than returning a sentinel
        value — the call site is forced to acknowledge the precondition.
      </p>

      <CodeFromRepo
        path="src/DataStructures/Stacks/LinkedListStack.cs"
        caption="Pulled live from the source repo"
      />

      <Callout variant="note">
        If the snippet above shows a “couldn’t load” message, the file simply
        hasn’t been pushed to the repo yet. The post is wired to pull from{' '}
        <code>src/DataStructures/Stacks/LinkedListStack.cs</code> on the{' '}
        <code>main</code> branch.
      </Callout>

      <h2>Walking the cost of each operation</h2>
      <p>
        Every operation on <code>LinkedListStack&lt;T&gt;</code> that touches
        the top runs in true constant time. <code>Push</code> allocates a
        single node and updates two references (<code>newNode.Next</code> and{' '}
        <code>_top</code>). <code>Pop</code> and <code>Peek</code> each
        perform a single dereference through <code>_top</code>. The only
        operation that escapes O(1) is <code>Contains</code>, which is a
        linear scan from top to bottom — and is rarely the right question to
        ask of a stack in the first place, since the entire point of the
        abstraction is to access elements in LIFO order rather than search
        them by value.
      </p>

      <ComplexityTable
        caption="LinkedListStack<T> — asymptotic costs"
        rows={[
          { operation: 'Push(T)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'allocates one node and rewires _top; true constant time, no resize step' },
          { operation: 'Pop()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'advances _top to its Next; throws InvalidOperationException when empty' },
          { operation: 'Peek()', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'reads _top.Value without mutating state; throws InvalidOperationException when empty' },
          { operation: 'Contains(T)', best: 'O(1)', average: 'O(n)', worst: 'O(n)', note: 'linear scan from top down; best case is a match at the top' },
          { operation: 'Count (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'maintained as an integer field on every Push and Pop' },
          { operation: 'IsEmpty (get)', best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'derived from Count' },
          { operation: 'Space', average: 'O(n)', note: 'one node allocation per element plus a single list-level _top reference' },
        ]}
      />

      <Callout variant="warning" title="Array-backed vs linked-list-backed stacks">
        The .NET Base Class Library’s{' '}
        <code>System.Collections.Generic.Stack&lt;T&gt;</code> is array-backed:{' '}
        <code>Push</code> is <em>amortized</em> O(1), because periodic capacity
        growth triggers an O(n) array copy. A linked-list-backed stack delivers{' '}
        <em>worst-case</em> O(1) on every push, with no resize step ever — at
        the cost of per-node heap allocations and poor cache locality. For
        general-purpose workloads, the array-backed version wins on throughput
        because contiguous memory dominates. Reach for the linked-list variant
        when worst-case latency matters more than average throughput, when
        node references must remain stable across growth, or when you need a
        building block for more advanced structures such as persistent
        (immutable) stacks.
      </Callout>

      <h2>When to actually reach for one</h2>
      <p>
        The stack is one of the most universally applied abstractions in
        software engineering. Several of its uses are foundational rather than
        optional — they show up in every language runtime and every
        non-trivial algorithm.
      </p>
      <h3>The call stack</h3>
      <p>
        Every modern language runtime maintains a stack of activation
        records — one frame per active function call, pushed on entry and
        popped on return. Local variables, the return address, and arguments
        all live in this structure. The LIFO discipline maps perfectly onto
        the call/return semantics of structured programming, and it is what
        makes recursion possible in the first place. Stack overflows are
        precisely the condition where this structure exhausts its bounded
        memory.
      </p>
      <h3>Expression evaluation and parsing</h3>
      <p>
        Postfix (Reverse Polish) expression evaluation uses a value stack:
        operands are pushed, operators pop their operands and push the result.
        The shunting-yard algorithm uses two stacks to convert infix
        expressions into postfix form. Recursive-descent parsers use the
        implicit call stack; iterative parsers use an explicit one. In every
        case the LIFO ordering matches the nesting structure of the input.
      </p>
      <h3>Iterative depth-first search</h3>
      <p>
        Depth-first traversal of a graph or tree is naturally recursive, but
        for graphs deep enough to exhaust the call stack the iterative form
        substitutes an explicit <code>Stack&lt;T&gt;</code> for the implicit
        one. Pushing successors and popping the next node to visit produces
        the same traversal order without risking stack overflow on adversarial
        inputs.
      </p>
      <h3>Undo histories</h3>
      <p>
        When the only operation required is “undo the most recent action,” a
        single stack of reversible commands suffices: every user action pushes
        a command, every undo pops and applies its inverse. A redo capability
        promotes the structure to a pair of stacks, with each undo popping
        from one and pushing onto the other.
      </p>

      <h2>What’s next</h2>
      <p>
        The natural pair to the stack is the <strong>queue</strong>, which
        replaces LIFO with first-in, first-out ordering and requires access at
        both ends — a different invariant that drives a different
        implementation. Beyond the basic stack, two extensions are worth
        knowing: the <strong>min-stack</strong>, which augments each node with
        a running minimum so that querying the smallest element is O(1)
        without scanning, and the <strong>persistent stack</strong>, in which
        nodes are immutable and every push returns a new top while sharing
        the unchanged suffix — the foundation of immutable collections in
        functional languages.
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

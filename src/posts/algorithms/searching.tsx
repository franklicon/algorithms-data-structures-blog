import CodeFromRepo from '../../components/posts/CodeFromRepo';
import ComplexityTable from '../../components/posts/ComplexityTable';
import Callout from '../../components/posts/Callout';
import SearchingVisualizer from '../../components/visualizers/SearchingVisualizer';

const SEARCH_PATH = 'src/Algorithms/Searching/SearchAlgorithms.cs';

export default function SearchingPost() {
  return (
    <article className="prose-editorial">
      <p className="font-display italic text-xl sm:text-2xl leading-snug text-ink/85 dark:text-paper/85 mb-10">
        Binary search is the algorithm that turns a sorted million-element
        array into a twenty-comparison lookup. Its correctness is a one-line
        invariant; its bug history is a cautionary tale; and its underlying
        idea — halve the search space at every step — generalizes far beyond
        arrays.
      </p>

      <h2>The idea</h2>
      <p>
        Given a sorted array and a target value, the question to answer is
        whether the target exists and, if so, where. The brute-force approach
        is <strong>linear search</strong>: compare the target to each element
        from left to right until a match is found or the array is exhausted.
        It runs in O(n) and requires nothing of the input.
      </p>
      <p>
        <strong>Binary search</strong> exploits a single additional fact —
        that the array is sorted — to do dramatically better. At each step
        it inspects the middle element of the current search range. If the
        middle is the target, the search is over. If the middle is too
        small, the target (if present) must lie to the right; if too large,
        to the left. Either way, half of the remaining range is eliminated
        in a single comparison. Repeated halving reduces an n-element array
        to one element in ⌈log₂ n⌉ steps, regardless of where the target
        actually lives.
      </p>

      <Callout variant="note" title="The precondition matters">
        Binary search requires the input array to be sorted in the same
        order the comparisons assume — ascending in our implementation. On
        an unsorted array it returns meaningless results without throwing,
        which makes the precondition a quiet contract: violate it and the
        algorithm fails silently. In a production setting, the sortedness
        guarantee should come from the surrounding data structure (a sorted
        list, a B-tree leaf, an index) rather than being assumed by hope.
      </Callout>

      <h2>The implementation</h2>
      <p>
        The C# implementation in the companion repository is iterative — no
        recursion stack, no auxiliary memory. It maintains two indices,{' '}
        <code>left</code> and <code>right</code>, that bracket the live
        search range. The loop continues while <code>left &lt;= right</code>,
        which is exactly the condition under which the range is non-empty.
        Each iteration computes <code>mid</code>, compares the value at that
        index to the target, and either returns or contracts the range by
        one side.
      </p>

      <CodeFromRepo
        path={SEARCH_PATH}
        extractMethod="BinarySearch"
        filename="SearchAlgorithms.cs · BinarySearch"
        caption="BinarySearch — pulled live from the source repo"
      />

      <p>
        Two design choices in this implementation deserve attention. First,
        the method is generic over{' '}
        <code>T where T : IComparable&lt;T&gt;</code>, so the same code
        searches an <code>int[]</code>, a <code>string[]</code>, or any
        user-defined type that supplies a total ordering via{' '}
        <code>IComparable&lt;T&gt;.CompareTo</code> — the same constraint
        used by the sorting algorithms in the companion repository. The
        result of <code>CompareTo</code> is cached in a local{' '}
        <code>cmp</code> before branching, which keeps the algorithm to a
        single comparison per iteration instead of two. Second, the
        convention for a missing target is to return <code>-1</code>. The
        .NET Base Class Library’s <code>Array.BinarySearch</code> returns
        the <em>bitwise complement</em> of the insertion point in the
        not-found case, which lets callers recover the correct insertion
        index in a single operation — a more useful contract for code that
        wants to maintain sorted order.
      </p>

      <h2>The loop invariant</h2>
      <p>
        The correctness argument fits on one line:{' '}
        <em>at every iteration of the while loop, if the target exists in
        the array, it lies within the closed range </em>
        <code>[left, right]</code>. The initial state{' '}
        <code>left = 0, right = array.Length - 1</code> covers the entire
        array, so the invariant holds before the loop. Each branch of the
        if/else preserves it: when the midpoint is too large, the target
        cannot lie at or after <code>mid</code>, so{' '}
        <code>right = mid - 1</code> is safe; symmetrically for the other
        branch. When <code>left &gt; right</code> the range is empty, the
        invariant becomes vacuous, and the target is provably absent — so
        the function returns <code>-1</code>.
      </p>

      <ComplexityTable
        caption="BinarySearch<T>(T[], T) — asymptotic costs"
        rows={[
          { operation: 'Search (target present)', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', note: 'best case is a match at the first midpoint; the search range halves on every iteration' },
          { operation: 'Search (target absent)', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', note: 'always proceeds until the range is empty' },
          { operation: 'Space', average: 'O(1)', note: 'iterative; three int locals, no recursion stack, no auxiliary array' },
        ]}
      />

      <p>
        The O(log n) bound is what justifies the algorithm’s standing as a
        building block of nearly every fast lookup structure in computer
        science. To put concrete numbers on it: a million-element array
        resolves in at most twenty comparisons; a billion-element array in
        at most thirty. Doubling the input size adds a <em>single</em>{' '}
        comparison to the worst case — a guarantee no other in-memory
        search on unindexed data can match.
      </p>

      <SearchingVisualizer />

      <Callout variant="insight" title="Try it">
        Pick a value that appears in the array and one that does not. Watch{' '}
        <code>L</code> and <code>R</code> converge on the target — or close
        in on each other until the range is empty. The number of
        comparisons displayed below the array never exceeds ⌈log₂ 12⌉ = 4,
        regardless of where the target lives.
      </Callout>

      <h2>The overflow bug</h2>
      <p>
        The midpoint calculation in the repository is{' '}
        <code>int mid = left + (right - left) / 2</code>, not the more
        natural-looking <code>(left + right) / 2</code>. The two are
        mathematically equivalent for non-negative operands, but they
        differ in their susceptibility to integer overflow. When{' '}
        <code>left + right</code> exceeds <code>Int32.MaxValue</code>, the
        addition wraps to a negative number, the division yields a
        negative mid, and the algorithm reads out of bounds. This bug
        lived undetected in Joshua Bloch’s implementation of{' '}
        <code>java.util.Arrays.binarySearch</code> in the Java standard
        library for nearly a decade.
      </p>

      <p>
        The safer form <code>left + (right - left) / 2</code> first
        computes the half-range <code>(right - left) / 2</code>, which can
        never exceed <code>right</code>, and then adds it to{' '}
        <code>left</code>. The intermediate value never approaches
        overflow. The form is now standard in competitive-programming
        templates, in production binary-search libraries, and in this
        repository.
      </p>

      <h2>Linear versus binary, in practice</h2>
      <p>
        The theoretical case for binary search is overwhelming: O(log n)
        crushes O(n) at any meaningful input size. The practical case is
        more nuanced. Binary search requires sorted input — and{' '}
        <em>sorting</em> the input is itself O(n log n), so if the array
        will only be searched once, linear search wins.
      </p>
      <p>
        The break-even depends on the search frequency. For an array
        that will be searched <em>k</em> times, the total cost of sort-
        then-binary-search is O(n log n + k log n), and the cost of pure
        linear search is O(kn). The two cross over when{' '}
        <em>k</em> is roughly <em>n / log n</em> — beyond that, sort once
        and search many times wins by a widening margin. For small arrays
        of a few dozen elements, the constant factors of binary search’s
        cache-unfriendly midpoint jumps can also make linear search
        competitive in practice, even though the asymptotic analysis
        favors binary.
      </p>

      <h2>When to actually reach for it</h2>
      <p>
        The cases where binary search is the right answer are remarkably
        broad — far broader than just searching arrays.
      </p>
      <h3>Sorted arrays and lists</h3>
      <p>
        The direct application: when you have sorted data in memory and
        need to look up a value by key. The .NET Base Class Library
        exposes this as <code>Array.BinarySearch</code> and{' '}
        <code>List&lt;T&gt;.BinarySearch</code>, both of which return
        either the index of a match or the bitwise complement of the
        insertion point — the same algorithm with a more useful
        not-found contract than the one in this implementation.
      </p>
      <h3>Indexed data structures</h3>
      <p>
        B-trees and B+ trees — the data structures behind nearly every
        production database index — perform a binary-search-style decision
        at every internal node to choose the next child to descend into.
        The fan-out is larger than two, but the principle is identical:
        partition the key space, examine a separator, descend into the
        matching half (or third, or fourteenth).
      </p>
      <h3>Bisecting over a monotonic predicate</h3>
      <p>
        Binary search generalizes from “find a value in a sorted array”
        to “find the boundary where a monotonic predicate flips from
        false to true.” The classic application is{' '}
        <code>git bisect</code>: given a range of commits where the
        predicate “does the test fail?” transitions from false to true
        somewhere in the middle, binary search identifies the breaking
        commit in O(log n) test runs. The same pattern appears in
        floating-point root-finding, capacity tuning (find the largest
        load a system can sustain), and any optimization where the
        feasibility function is monotonic.
      </p>
      <h3>Lower-bound and upper-bound queries</h3>
      <p>
        A small modification to the comparison logic produces{' '}
        <em>lower-bound</em> (first index whose value is ≥ target) and{' '}
        <em>upper-bound</em> (first index whose value is &gt; target)
        queries. These appear constantly in interval queries, range
        counting, and any code that needs to insert into a sorted
        collection while preserving order. The C++ Standard Library
        exposes them as <code>std::lower_bound</code> and{' '}
        <code>std::upper_bound</code>; the same primitives are
        rediscovered in every language that takes sorted collections
        seriously.
      </p>

      <h2>What’s next</h2>
      <p>
        Three direct extensions are worth knowing.{' '}
        <strong>Exponential search</strong> handles unbounded or
        unknown-length sorted sequences by doubling an index until the
        target is bracketed, then binary-searching the bracketed range —
        useful for searching infinite streams or for the entry point into
        a sorted file of unknown size. <strong>Interpolation search</strong>{' '}
        replaces the midpoint computation with a linear interpolation
        based on the target’s value, achieving O(log log n) on uniformly
        distributed data at the cost of O(n) on adversarial inputs.{' '}
        <strong>Ternary search</strong> partitions into three regions
        rather than two and is well-suited to finding extrema of unimodal
        functions. Finally, the algorithm’s natural recursive structure
        becomes the <strong>binary search tree</strong>, the next data
        structure in the series — where the partition decisions are
        encoded directly into the node layout.
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
